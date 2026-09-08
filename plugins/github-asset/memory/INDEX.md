---
kind: knowledge
when-and-why-to-read: When a GitHub pull request or issue needs a locally produced video, image, or other file attached through GitHub so its body can use the permanent attachment URL, read this because `gh` cannot perform GitHub’s browser attachment flow.
short-form: Attach a local file to a GitHub pull request or issue through an existing signed-in browser with `crtr github-asset attach`.
surfaces:
  - on: command
    match:
      - "*github-asset*"
    at: content
---

# GitHub attachments

Use [[github-asset/attach]] to upload a local file through GitHub's own attachment flow and receive its permanent `https://github.com/user-attachments/assets/...` URL.

The command requires the Capture CLI (`crtr capture`), `gh`, and an already-running CDP-enabled browser with a GitHub tab. It lists CDP endpoints, opens a GitHub page in each browser that already has a GitHub tab, and checks `meta[name=user-login]` there; it does not assume a browser or port and never launches one.
