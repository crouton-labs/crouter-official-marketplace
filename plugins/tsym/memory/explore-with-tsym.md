---
kind: knowledge
when-and-why-to-read: When you are mapping a TypeScript codebase, this knowledge should be read because the compiler already holds the structure you would otherwise reconstruct by reading files end to end.
short-form: Map TypeScript code with tsym before reading files.
gate: {kind: explore}
surfaces:
  - on: boot
    at: content
---

**Map TypeScript code from the compiler, not by reading files end to end.** When the repo has a `tsconfig.json`: run `crtr tsym outline <dir or file>` before opening any file; answer "who calls X", "what renders Y", "what implements Z" with `crtr tsym inspect`, never with grep; run `crtr tsym inspect <name> --only refs` before calling anything dead. Read a file only after tsym has told you it matters. Grep for what the compiler cannot see — route strings, SQL, Prisma schema, config keys. A tsym negative finding covers indexed, compiler-resolved relations only; framework, HTTP, and dependency-injection invocation are invisible to it, so say so when a claim rests on one.
