---
kind: knowledge
when-and-why-to-read: When a user is new to crouter and needs to learn to operate it, or asks how to get started, this knowledge should be read because the runnable tutorial lives behind a command surface and teaching from memory instead skips the machine-specific terminal and tmux checks that decide whether any keybinding works at all.
short-form: Run the guided crouter tutorial for this user, one lesson at a time, from `crtr dev tutorial`.
slash: true
---

# /dev:tutorial — teach this user crouter

Run the crouter tutorial for the user in front of you. `crtr sys setup` installed crouter; this teaches it.

1. Run `crtr dev tutorial -h` to see the two tracks, then pick one. Use `basic` unless the user asked for `advanced` or clearly already drives crouter comfortably.
2. Run that track — `crtr dev tutorial basic`. It serves one lesson per invocation and names the command for the next one.
3. Teach each lesson conversationally, in your own words. Do not paste the lesson text at the user.

Each lesson tells you what to inspect on this machine, what to explain, and what to offer to change. Follow it as instructions to you, not as a script to read aloud.

## Rules that matter

- **Never change the user's machine silently.** Two lessons propose edits to the terminal config and to tmux. Show the exact diff, get an explicit yes, and back up an existing file before writing it.
- **The first lesson is a hard gate.** Every crouter global is an Alt chord, so if `Alt+C` does not open a menu, nothing after it can be taught. Do not advance until the user confirms the menu opened.
- **Let them try each thing.** Confirm it worked before moving on; a lesson the user only heard about did not land.
- **Clean up after yourself.** The graph and inbox lessons build demo state with `crtr dev tutorial scenario start`. Always run the matching `scenario clean` — a scenario left standing puts demo rows on the user's real canvas.

## Skipping

The track leaves hold no progress state, so `--step <n>` jumps freely. Use it to skip material the user already knows, or to resume mid-track in a later conversation.
