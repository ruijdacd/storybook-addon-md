# Project audit

Date: 2026-09-10. Scope: Markdown addon, example Storybook, package, and verification tooling. No implementation changes were made.

## Remediation status

The findings below record the original audit. The requested fixes are now implemented: Vite 7.3.6 has a clean dependency audit; reserved asset paths use tested disposable copies; CI runs the full verification suite; watcher events are filtered to matching Markdown and dependencies; publication metadata and README links are updated. The dark danger-button contrast finding remains open as requested.

A 300-document local fixture averaged 142 ms per full rescan. Three unrelated application edits now trigger zero rescans. Regression coverage includes safe asset copies in Vite development/static output, copy updates and cleanup, ignored watcher events, missing-sibling recovery, and keyboard toggle interaction. There are 16 unit, 7 Vitest browser, and 11 Storybook end-to-end tests, plus the packed-consumer smoke check. CI execution on GitHub will be verified after pushing.

The visual anti-pattern check passes. The example is restrained and consistent with the requested GitHub direction. System typography and neutral surfaces are intentional here, not defects.

## Assessment

The UI scores **16/20: good, with gaps to address**. This is a scoped engineering assessment, not an accessibility certification or a score for release security.

| Dimension            | Score     | Evidence and limits                                                                                                                 |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Accessibility        | 3/4       | Keyboard toggle and visible focus passed; dark danger text fails contrast.                                                          |
| Performance          | 3/4       | Small integration and writes only when content changes; every root change rescans all Markdown. No large-project benchmark was run. |
| Responsive design    | 3/4       | Existing mobile checks and a 375px long-tag probe passed. Zoom, forced colors, and other browser engines remain unverified.         |
| Theming              | 3/4       | Live manager, Docs, and component switching passes; theme values are duplicated across CSS and Storybook configuration.             |
| Visual anti-patterns | 4/4       | No unnecessary visual framework, decorative effects, or competing page styles.                                                      |
| **Total**            | **16/20** | **Good**                                                                                                                            |

Six findings: **0 P0, 2 P1, 3 P2, 1 P3**.

## Findings

### P1 — Update the vulnerable development toolchain

- Location: `package.json` devDependencies, `package-lock.json`, and the Vite version in `test/package-smoke.ts`.
- Category: security / release readiness.
- Evidence: `npm audit --json` reports Vite at high severity and its nested esbuild at low severity. The project pins Vite 7.3.1; npm reports a non-major fix at 7.3.6.
- Impact: published Vite advisories include development-server file disclosure and filesystem-deny bypasses. Exposure depends on the advisory and server configuration; this finding does not establish a vulnerability in the emitted static Storybook.
- References: [Vite filesystem-deny bypass](https://github.com/advisories/GHSA-v2wj-q39q-566r), [Vite WebSocket file read](https://github.com/advisories/GHSA-p9ff-h696-f583).
- Recommendation: update to a patched Vite 7 release, regenerate the lockfile, update the isolated-consumer fixture and supported-version documentation, and rerun the complete suite. Review the broad peer range as part of that change. Do not blindly apply a major upgrade.
- Suggested command: `/harden`.

### P1 — Dark danger-button text misses AA contrast

- Location: `example/.storybook/tailwind.css:9`, `example/components/Button.tsx:20`.
- Category: accessibility / theming.
- Evidence: axe-core 4.13.0 on the built Button documentation reports **4.44:1** for `#f85149` against `#212830`. The text is 14px, so the required ratio is **4.5:1** under WCAG 1.4.3. The same scoped light-mode scan reported no violations.
- Impact: the example encourages teams to reuse a color pairing that narrowly fails normal-text contrast.
- Recommendation: adjust the danger foreground/background pairing and check default, hover, active, and focus states in both themes. Add contrast checks to the browser suite. The danger token also supplies hover backgrounds, so changing it requires checking white text in those states.
- Suggested command: `/normalize`.

### P2 — Encoded special characters in asset filenames break builds

- Location: `src/content.ts:194`, `src/generator.ts:23`.
- Category: content correctness / error handling.
- Reproduction: create `image#dark.svg`, then reference `![Example](./image%23dark.svg)`. Discovery successfully finds the file, but the generated import is `./image#dark.svg?url&no-inline`; Vite treats the special character as URL syntax and cannot resolve it. `image%3Fdark.svg` fails similarly on filesystems permitting `?`. A plain `image.svg` control builds successfully.
- Impact: valid percent-encoded Markdown links produce bundler errors after passing addon validation.
- Recommendation: establish a Vite-compatible mapping from filesystem paths to asset imports and cover reserved filename characters in both development and static builds. If any characters cannot be supported, reject them during source validation with a useful error and document the limit.
- Suggested command: `/harden`.

### P2 — Release checks are available but not automated

- Location: repository root, `package.json` scripts, `playwright.config.ts`, `test/browser/docs.spec.ts`.
- Category: reliability / test coverage.
- Evidence: no checked-in CI workflow exists. The tests pass locally, but nothing in the repository runs them automatically for proposed changes. Existing browser tests did not catch the contrast or special-filename findings.
- Impact: packaging, filesystem watching, CSS, and browser regressions can reach a release despite the strong local suite.
- Recommendation: add CI for type checking, lint, formatting, unit tests, Vitest Browser Mode, Storybook end-to-end tests, and the packed-consumer smoke test. Install Chromium explicitly. Keep the currently tested Storybook/builder combination narrow. Add focused fixtures for encoded filenames, keyboard interaction, contrast, fenced code, and image rendering. Test a story reference that exists on disk but is excluded from Storybook's story globs, and ensure its diagnostic is actionable.
- Suggested command: `/harden`.

### P2 — Unrelated file changes trigger complete documentation scans

- Location: `src/preset.ts:94`, `src/preset.ts:104`, `src/content.ts:260`.
- Category: performance.
- Evidence: the watcher observes the entire configured root and schedules generation for every event. Generation rediscovers and reparses all Markdown, including filesystem validation for references. Documentation exclusions do not narrow watched events.
- Impact: ordinary application edits can create avoidable work as documentation grows. This is a scaling concern established from the code path; no user-visible slowdown was measured in the small example. The README already acknowledges the broad rescan behavior.
- Recommendation: measure a representative larger fixture, then filter events to Markdown discovery candidates and referenced stories/assets/presentation files. Preserve discovery of new directories and missing-asset recovery. Avoid introducing a generic caching framework before measurements justify it.
- Suggested command: `/optimize`.

### P3 — Finish publication metadata and remove documentation drift

- Location: `package.json`, `README.md:186`, `README.md:232`, `example/.storybook/theme.ts`, `example/.storybook/tailwind.css`.
- Category: onboarding / maintainability.
- Evidence: the README still says Docs follows system preference “at page load,” although it now updates live. The package lacks repository/homepage/issue-tracker metadata. README links to example files are relative, but the published package's file list excludes the example. Storybook theme colors and fonts repeat values already present in the Tailwind theme.
- Impact: npm consumers have less reliable navigation to examples and support; future edits can reintroduce theme inconsistencies or stale instructions.
- Recommendation: add real repository/support URLs before publishing, link example sources using stable repository URLs, correct the stale theme sentence, and keep the two theme representations explicitly aligned. The removed custom-layout page and image demo were deliberate user choices; restoring them is not required for this finding.
- Suggested command: `/clarify`, followed by `/polish`.

## Verification performed

- 13 Vitest unit tests passed.
- 7 Vitest Browser Mode tests passed.
- 11 Storybook end-to-end tests passed, including development/static builds and live system-theme switching.
- Packed-consumer smoke check passed, including asset bundling, missing-asset failure, and first Markdown added after startup.
- TypeScript, Oxlint, and Oxfmt checks passed.
- Ran a temporary Vite asset-build probe outside the repository to reproduce special-filename failures.
- Ran axe-core against the addon page within static Button Docs in light/dark Chromium. This was a scoped scan, not a full audit of Storybook's own manager UI or all component interaction states.
- Verified the standalone Toggle receives keyboard focus, displays a 2px solid focus outline, and changes state with Space.
- Checked the standalone Introduction at 375px, including a long injected tag: document scroll width remained 375px.

## What to preserve

The content, generation, integration, and presentation responsibilities are clear. Disposable MDX uses Storybook's compilation path instead of assuming an indexer can render Markdown. Shared docs, configurable discovery, source-specific errors, static assets, watcher recovery, customization, and live system-theme changes have working tests. The published addon does not depend on the example's Tailwind styling.

The main systemic gap is verification at the edges: tests cover intended workflows well, but dependency advisories, accessibility constraints, and unusual author input need repeatable checks.

## Recommended order

1. `/harden` — patch the development toolchain and resolve special-character asset paths.
2. `/normalize` — correct danger-button contrast in every interaction state.
3. `/harden` — put the existing release checks in CI and add targeted regression coverage.
4. `/optimize` — measure rescans before narrowing watcher work.
5. `/clarify` — update publication links and stale instructions.
6. `/polish` — finish with a visual and documentation consistency pass.

These can be addressed individually or together. Re-run `/audit` after the fixes to reassess the score.
