# Architecture rules
- Keep newly added documentation procedures in JSX modules, separate from the legacy documentation renderer, to respect the JavaScript-only preference without rewriting unrelated guides.
- Store original uploaded manuals as Lovable Assets pointers and link to their URLs so binaries stay outside the repository.