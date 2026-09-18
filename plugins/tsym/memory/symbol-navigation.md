---
kind: knowledge
when-and-why-to-read: When you are about to grep for where something is declared, who calls it, or what would break if you changed it, this knowledge should be read because the compiler already has the exact answer and a text match over a name gives you a different, less reliable one.
short-form: Run `crtr tsym -h` before grepping for a symbol.
surfaces:
  - on: command
    match: ["grep *", "rg *", "git grep *"]
    at: content
---

Before grepping for a symbol — where it is declared, who calls it, what breaks if it changes — run `crtr tsym -h`. Its answers come from the TypeScript compiler, not text matching.
