# Security policy

## Reporting a vulnerability

Please report security vulnerabilities privately, by email to **rhyneer.silas@gmail.com**. Do not open a public GitHub issue or pull request for a suspected vulnerability.

Include what you found, the plugin name and version (`crtr pkg plugin show <plugin>`), the crouter version (`crtr --version`) and platform, and the steps or a proof of concept that reproduce it. If the report involves a token or credential, redact it.

Reports are read by a single maintainer, and no response time is guaranteed. Fix timelines depend on severity and on what the fix involves. Say in your report if you want credit in the fix.

## Supported versions

Fixes land on `main`, and the auto-bump workflow tags a new release. Only the latest release is supported.

## What is in scope

The code in this repository: the plugins under [`plugins/`](plugins), the marketplace catalog, and the scripts in [`.github/`](.github). Of particular interest:

- An executable or hook in a plugin doing something its manifest and documentation do not say, such as sending data off the machine or running code at install time. Installing a plugin does not run its executables, but once installed its hooks run implicitly and its commands run when invoked, with your user's permissions.
- A plugin reading, logging or transmitting a credential it was given, such as the Exa API key used by `exa-search`.
- The auto-bump workflow letting a pull request change what gets released or tagged on `main`.

Commands such as `crtr bird` post to X as you, and `crtr github-asset` uploads files through your signed-in browser. That is what they are for, not a vulnerability. Flaws in the external tools that plugins forward to (Capture, tsym, bird, Grove) belong in those tools' repositories.
