# Architecture rules
- Keep newly added documentation procedures in JSX modules, separate from the legacy documentation renderer, to respect the JavaScript-only preference without rewriting unrelated guides.
- Store original uploaded manuals as Lovable Assets pointers and link to their URLs so binaries stay outside the repository.
- Obtain SheetJS xlsx from its official versioned CDN distribution, at version 0.20.3 or newer, because the npm-registry 0.18.5 release has unpatched prototype-pollution and ReDoS vulnerabilities.
- Include JSX and JS in Tailwind content discovery so documentation layout utilities are generated for JavaScript pages.
- Preserve source dates and explicit SIM mappings in fiscal-benefit lookup data; never infer a benefit from CST alone, because multiple legal grounds can share a CST.