---
kind: knowledge
when-and-why-to-read: When you are about to grep for where something is declared, who calls it, or what would break if you changed it, this knowledge should be read because the compiler already has the exact answer and a text match over a name gives you a different, less reliable one.
short-form: Use `crtr symbols` instead of grep for symbol questions.
surfaces:
  - on: command
    match: ["grep *", "rg *", "git grep *"]
    at: content
---

For symbol navigation — where is X declared, who calls it, what does it call, what breaks if it changes — use `crtr symbols` rather than grep. Its answers come from the TypeScript compiler's own resolution, not text matching, so act on them instead of re-reading files to confirm.
