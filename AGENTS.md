# Project

A standalone addon that discovers ordinary Markdown and renders it inside Storybook Docs. Keep parsing, generation, Storybook integration, and presentation separate. Prefer public APIs and the smallest complete implementation.

Read [README.md](README.md) before changing behavior, configuration, or supported versions. Read [STYLING.md](STYLING.md) before changing CSS variables or presentation. The example follows GitHub’s visual style and supports the system light/dark preference.

# Working Rules

- Use TypeScript for implementation and tests. Use the existing Vitest, Playwright, Oxlint, and Oxfmt tooling.
- Keep company-specific behavior and example styling out of the addon. Avoid unrelated features and speculative abstractions.
- Preserve plain Markdown authoring. Generated wrappers and assets are disposable; change their source, not generated files.
- Do not add code comments, attribution lines, or co-author trailers. Write concise, natural documentation.
- Commit and push only when explicitly requested. Use the configured Git identity, conventional commit/PR titles, and change-type prefixes for new branches.
- Keep PR descriptions to 2–3 sentences.

# Verification

Run checks appropriate to the change using the README’s development commands. Add regression coverage for behavior fixes. Integration changes must work in development, static builds, and the packed consumer. Run only one development Storybook per config directory when testing file watching. Report verification results and remaining limitations.
