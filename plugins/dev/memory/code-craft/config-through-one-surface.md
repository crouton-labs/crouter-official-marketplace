---
kind: preference
when-and-why-to-read: When you need a configuration value at a use site and the service's designated configuration surface does not expose it, this preference should be read because a second read path makes the effective value depend on which code path ran.
short-form: Read and validate each configuration value through one designated service surface.
---

Each service reads configuration through one designated surface and nowhere else.

Never add an ad hoc environment read at a use site, and never give a configuration value a second undeclared override. A value that two paths can set is decided by whichever path ran, which a reader cannot determine from the use site.

Expose the value through the service's existing configuration surface. Put a required-value guard on that surface once rather than repeating it at every caller.
