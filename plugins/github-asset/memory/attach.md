---
kind: knowledge
when-and-why-to-read: When a local file must render in a GitHub pull request or issue body, read this because the permanent GitHub attachment URL can only be created through the signed-in browser upload flow.
short-form: Run `crtr github-asset attach <file> --pr <number> [--repo owner/name] [--port <n>]`; it prints the permanent GitHub attachment URL without changing the body.
surfaces:
  - on: command
    match:
      - "*github-asset attach*"
    at: content
---

# Attach a file to GitHub

Run:

```bash
crtr github-asset attach ./proof.mp4 --pr 123 --repo vallum-security/crouter
```

The `--pr` number can identify either a pull request or an issue. GitHub's current issue editor does not expose the attachment form, so an issue upload uses one open pull request in the same repository only to create the attachment URL; the command still returns the issue URL as its target. Omit `--repo` only when the current directory lets `gh repo view` resolve the repository.

The command reads the file, inlines it into JavaScript (a 12 MB mp4 uploads in about 15 seconds), and runs GitHub's attachment upload flow in the existing signed-in browser. It prints the permanent attachment URL and does not add that URL to the pull request or issue body. Paste the URL into the body with the normal GitHub edit command after the upload.

Pass `--port <n>` to name the CDP browser to upload through, taking `n` from `crtr capture tab list`. The command then skips the search, opens a GitHub page on that endpoint, and fails with `github_login_not_found` if no user is signed in there. Use it when the signed-in browser has no github.com tab open: without `--port`, attach only tries browsers that already list a GitHub tab, and Arc lists only tabs opened over CDP, so a signed-in Arc is missed.

Without `--port`, before invoking it, ensure `crtr capture tab list` can see a running CDP-enabled browser with a GitHub tab. The command discovers those endpoints, opens a GitHub page in each candidate browser, and checks `meta[name=user-login]` instead of assuming Chrome, Arc, or a port. It never launches a browser. It finds the browser independently of your own capture session or `CDP_PORT`, and closes the tabs it opens (the login probe and the upload page) when it finishes or fails.

## Failures

- `github_login_not_found`: without `--port`, open github.com in the browser where you are signed in, or pass that browser's `--port`; with `--port`, sign in to GitHub in that browser.
- `capture_failed`: the message names the failing `capture` command and the cause Capture reported (for example `exec_timeout_cancelled: Evaluation exceeded 61000ms`). The in-page upload deadline is 60 s plus 20 s per MB, so a timeout means the upload itself stalled: check the connection and the tab, then retry. Only when the message says the process could not run or exited without a report is the Capture CLI missing (`crtr capture -h`).
- `target_not_found`: correct the number or pass the intended `--repo owner/name`.
- `GitHub refused the upload (422)`: GitHub's own size limit for the repository's plan (10 MB for images; 10 MB for videos on a free plan, 100 MB on a paid plan). Compress the clip and retry.
- `issue_upload_page_not_found`: open a pull request in the repository, or use a pull request number directly.
