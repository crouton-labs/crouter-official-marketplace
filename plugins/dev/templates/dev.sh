#!/bin/sh
# dev.sh — development lifecycle for this repository.
#
# Grove dispatches `dev [args...]` here with cwd at the repo root and env:
#   GROVE_SLOT           instance slot number (0 = the source checkout)
#   GROVE_INSTANCE_NAME  instance name (project name for the source)
#   GROVE_TARGET         absolute path of the checkout being operated on
#   GROVE_PORT_<NAME>    one resolved port per entry in .grove/config.json ports
#
# This is a stack-agnostic starting point: replace the SERVICES table and
# adjust start commands for this repository. Keep the verb set stable —
# agents rely on start/stop/restart/status/logs/logpath/doctor/reset everywhere.
# Your -h output below is the live contract; keep it truthful as you edit.

set -u

# --- services ---------------------------------------------------------------
# One line per service: name|port|start command (run from the repo root).
# Port may be empty for a service without a listener. Use $GROVE_PORT_<NAME>
# so planted instances get non-colliding ports.
services() {
  cat <<EOF
app|${GROVE_PORT_APP:-3000}|npm run dev -- --port ${GROVE_PORT_APP:-3000}
EOF
}

DEFAULT_SERVICES="app"   # started when no service is named

# --- plumbing ---------------------------------------------------------------
RUN_DIR="/tmp/dev-runs/$(printf '%s' "${GROVE_TARGET:-$PWD}" | tr '/' '-' | sed 's/^-*//')"
mkdir -p "$RUN_DIR"

line_for()  { services | grep "^$1|" || true; }
port_of()   { line_for "$1" | cut -d'|' -f2; }
cmd_of()    { line_for "$1" | cut -d'|' -f3-; }
pidfile()   { echo "$RUN_DIR/$1.pid"; }
logfile()   { echo "$RUN_DIR/$1.log"; }
names()     { services | cut -d'|' -f1; }

port_pid() { [ -n "$1" ] && lsof -ti "tcp:$1" -s tcp:LISTEN 2>/dev/null | head -1; }

alive() {
  [ -f "$(pidfile "$1")" ] && kill -0 "$(cat "$(pidfile "$1")")" 2>/dev/null
}

start_one() {
  name=$1; port=$(port_of "$name"); cmd=$(cmd_of "$name")
  [ -z "$cmd" ] && { echo "unknown service: $name" >&2; return 1; }
  if [ -n "$port" ] && [ -n "$(port_pid "$port")" ]; then
    echo "✓ $name already serving on :$port"
    return 0
  fi
  nohup sh -c "exec $cmd" >>"$(logfile "$name")" 2>&1 &
  echo $! >"$(pidfile "$name")"
  if [ -n "$port" ]; then
    i=0
    while [ $i -lt 30 ]; do
      [ -n "$(port_pid "$port")" ] && { echo "✓ $name up on :$port"; return 0; }
      alive "$name" || { echo "✗ $name exited — read: $0 logs $name --tail 40" >&2; return 1; }
      sleep 1; i=$((i + 1))
    done
    echo "⚠ $name started (pid $(cat "$(pidfile "$name")")) but :$port not serving after 30s" >&2
    return 1
  fi
  echo "✓ $name started (pid $(cat "$(pidfile "$name")"))"
}

stop_one() {
  name=$1; port=$(port_of "$name"); stopped=0
  if [ -f "$(pidfile "$name")" ]; then
    pid=$(cat "$(pidfile "$name")")
    kill -0 "$pid" 2>/dev/null && { kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null; stopped=1; }
    rm -f "$(pidfile "$name")"
  fi
  # reclaim a listener this script lost track of
  lp=$(port_pid "$port")
  [ -n "$lp" ] && { kill "$lp" 2>/dev/null; stopped=1; }
  [ "$stopped" = 1 ] && echo "✓ $name stopped" || echo "- $name was not running"
}

status_one() {
  name=$1; port=$(port_of "$name")
  if [ -n "$port" ] && [ -n "$(port_pid "$port")" ]; then state="✓ serving :$port"
  elif alive "$name"; then state="⚠ running, not serving${port:+ :$port}"
  else state="○ stopped"; fi
  last=$(tail -1 "$(logfile "$name")" 2>/dev/null || true)
  printf '  %-10s %s\n' "$name" "$state"
  [ -n "$last" ] && printf '             ↳ %s\n' "$last"
  return 0
}

targets() {
  # named services from the argv, else the default group
  found=""
  for a in "$@"; do
    [ -n "$(line_for "$a")" ] && found="$found $a"
  done
  echo "${found:-$DEFAULT_SERVICES}"
}

doctor() {
  issues=0
  echo "doctor — read-only"
  for s in $(names); do
    port=$(port_of "$s")
    pidstate="no pidfile"; alive "$s" && pidstate="pid $(cat "$(pidfile "$s")") alive"
    if [ -f "$(pidfile "$s")" ] && ! alive "$s"; then pidstate="stale pidfile"; issues=1; fi
    portstate="no port"
    if [ -n "$port" ]; then
      if [ -n "$(port_pid "$port")" ]; then
        portstate=":$port listening"
        [ ! -f "$(pidfile "$s")" ] && { portstate="$portstate (untracked)"; issues=1; }
      else
        portstate=":$port free"
      fi
    fi
    printf '  %-10s %s · %s\n' "$s" "$pidstate" "$portstate"
  done
  [ "$issues" = 0 ] && echo "verdict: green" || echo "verdict: repair inconsistent state with 'dev stop'."
  return "$issues"
}

# Add repository-specific generated-artifact work here. It runs after reset
# has fast-forwarded a clean checkout to main.
regenerate() {
  :
}

reset_inventory() {
  reset_parked_file=$1
  printf '## inventory\n'
  current_branch=$(git branch --show-current)
  printf '%s\n' "current branch: ${current_branch:-detached}"

  if dirty_paths=$(git status --porcelain) && [ -n "$dirty_paths" ]; then
    printf '%s\n' "- dirty tree: $dirty_paths" >>"$reset_parked_file"
  fi

  git for-each-ref --format='%(refname:short)' refs/heads | while IFS= read -r local_branch; do
    [ -z "$local_branch" ] && continue
    [ "$local_branch" = main ] && continue
    if ! git merge-base --is-ancestor "$local_branch" origin/main; then
      printf '%s\n' "- unmerged branch: $local_branch" >>"$reset_parked_file"
    fi
    upstream=$(git for-each-ref --format='%(upstream:short)' "refs/heads/$local_branch")
    if [ -n "$upstream" ]; then
      unpushed=$(git rev-list --count "$upstream..$local_branch")
    elif git show-ref --verify --quiet "refs/remotes/origin/$local_branch"; then
      unpushed=$(git rev-list --count "origin/$local_branch..$local_branch")
    else
      unpushed=$(git rev-list --count "origin/main..$local_branch")
    fi
    [ "$unpushed" -gt 0 ] && printf '%s\n' "- unpushed commits: $local_branch ($unpushed)" >>"$reset_parked_file"
  done

  git worktree list --porcelain | while IFS= read -r record; do
    case "$record" in
      worktree\ *) reset_worktree=${record#worktree } ;;
      '')
        if [ -n "${reset_worktree:-}" ] && worktree_dirty=$(git -C "$reset_worktree" status --porcelain) && [ -n "$worktree_dirty" ]; then
          printf '%s\n' "- dirty worktree: $reset_worktree: $worktree_dirty" >>"$reset_parked_file"
        fi
        reset_worktree="" ;;
    esac
  done

  printf '## parked\n'
  if [ -s "$reset_parked_file" ]; then cat "$reset_parked_file"; else printf '%s\n' '- none'; fi
}

reset() {
  reset_parked_file="$RUN_DIR/reset-parked.$$"
  trap 'rm -f "$reset_parked_file"' EXIT HUP INT TERM
  : >"$reset_parked_file"

  printf '## stop\n'
  for s in $(names); do stop_one "$s" || return 1; done

  printf '## fetch\n'
  git fetch origin || return 1

  reset_inventory "$reset_parked_file"

  printf '## converge\n'
  if [ -n "$(git status --porcelain)" ]; then
    printf '%s\n' '- skipped: current checkout is dirty'
    reset_converged=0
  else
    git checkout main && git pull --ff-only origin main || return 1
    reset_converged=1
  fi

  printf '## regenerate\n'
  if [ "$reset_converged" = 1 ]; then regenerate || return 1; else printf '%s\n' '- skipped: checkout did not converge'; fi

  printf '## doctor\n'
  doctor || return 1

  [ -s "$reset_parked_file" ] && return 3
  return 0
}

# --- verbs -------------------------------------------------------------------
usage() {
  cat <<EOF
dev — development lifecycle for ${GROVE_INSTANCE_NAME:-this repo} (slot ${GROVE_SLOT:-0})

USAGE
  dev [verb] [service...]      no verb: start; no service: default group

SERVICES
$(services | awk -F'|' '{ printf "  %-10s :%s\n", $1, $2 }')

VERBS
  start     start services (idempotent — skips one already serving)
  stop      stop services and free their ports
  restart   stop + start
  status    per service: state, port, last log line
  logs      follow a service log; --tail N prints last N lines instead
  logpath   print the log dir, or one service's log file
  doctor    read-only: report state and anything inconsistent
  reset     stop, fetch, inventory/park, fast-forward main, regenerate, and doctor; exits 3 when items are parked

Logs and pidfiles: $RUN_DIR
EOF
}

verb=start; args=""
for a in "$@"; do
  case "$a" in
    start|stop|restart|status|logs|logpath|doctor|reset) verb=$a ;;
    -h|--help|help) usage; exit 0 ;;
    *) args="$args $a" ;;
  esac
done
# shellcheck disable=SC2086
set -- $args

case "$verb" in
  start)   for s in $(targets "$@"); do start_one "$s"; done ;;
  stop)    for s in $(targets "$@"); do stop_one "$s"; done ;;
  restart) for s in $(targets "$@"); do stop_one "$s"; start_one "$s"; done ;;
  status)  echo "SERVICES  ${GROVE_INSTANCE_NAME:-$(basename "$PWD")} slot ${GROVE_SLOT:-0}"
           for s in $(names); do status_one "$s"; done ;;
  logs)
    svc=""; tail_n=""
    prev=""
    for a in "$@"; do
      [ "$prev" = "--tail" ] && tail_n=$a
      [ -n "$(line_for "$a")" ] && svc=$a
      prev=$a
    done
    [ -z "$svc" ] && { echo "logs: name a service ($(names | tr '\n' ' '))" >&2; exit 1; }
    if [ -n "$tail_n" ]; then tail -n "$tail_n" "$(logfile "$svc")"; else tail -f "$(logfile "$svc")"; fi ;;
  logpath) if [ -n "${1:-}" ] && [ -n "$(line_for "$1")" ]; then logfile "$1"; else echo "$RUN_DIR"; fi ;;
  doctor)  doctor ;;
  reset)   reset ;;
esac
