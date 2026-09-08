---
kind: knowledge
when-and-why-to-read: When a local file must render in a GitHub pull request or issue body, read this because the permanent GitHub attachment URL can only be created through the signed-in browser upload flow.
short-form: Run `crtr github-asset attach <file> --pr <number> [--repo owner/name]`; it prints the permanent GitHub attachment URL without changing the body.
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

The command accepts files up to 1 MiB. It reads the file, inlines it into JavaScript, and runs GitHub's attachment upload flow in the existing signed-in browser. It prints the permanent attachment URL and does not add that URL to the pull request or issue body. Paste the URL into the body with the normal GitHub edit command after the upload.

Before invoking it, ensure `crtr capture tab list` can see a running CDP-enabled browser with a GitHub tab. The command discovers those endpoints, opens a GitHub page in each candidate browser, and checks `meta[name=user-login]` instead of assuming Chrome, Arc, or a port. It never launches a browser.

## Failures

- `github_login_not_found`: open github.com in the browser where you are signed in, then retry.
- `capture_failed`: install the Capture CLI so `crtr capture` works, then confirm the selected GitHub tab is responsive.
- `target_not_found`: correct the number or pass the intended `--repo owner/name`.
- `file_too_large`: trim or compress the file to 1 MiB or less.
- `issue_upload_page_not_found`: open a pull request in the repository, or use a pull request number directly.
