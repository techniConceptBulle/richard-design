---
title: 'Migrate repository to Bitbucket'
type: 'chore'
created: '2026-08-06'
status: 'done'
baseline_commit: '86bbbd0de8ec20d19c993ed0ee506737b1e093b0'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The project lives only on GitHub (`origin` → `techniConceptBulle/richard-design`). The team wants the canonical remote on Bitbucket while keeping GitHub as a secondary remote, and the untracked BMAD/agent trees should be part of the committed project.

**Approach:** Guide Razvan to create a private empty Bitbucket repo, commit the pending project files (with safe ignores), rewire remotes so Bitbucket is `origin` and GitHub is `github`, then push `main` to Bitbucket.

## Boundaries & Constraints

**Always:**
- Create a **private** Bitbucket repository named `richard-design` (unless the human renames it during creation).
- Keep both remotes: Bitbucket = `origin`, GitHub = `github`.
- Commit BMAD/agent artifacts: `.agents/`, `_bmad/`, `_bmad-output/`.
- Keep `node_modules/` and `dist/` ignored; add `test-results/` to `.gitignore` (ephemeral Playwright output).
- Never commit secrets (`.env`, credentials, tokens).
- Never `git push --force` to `main` on either remote.
- Never commit or push without the human confirming the commit step when prompted.
- Speak guidance in French; one UI instruction at a time while creating the Bitbucket repo.

**Ask First:**
- Bitbucket workspace slug / final HTTPS or SSH clone URL after repo creation.
- SSH vs HTTPS for the new `origin`.
- Whether to also `git push github main` after Bitbucket succeeds.
- Any rename of the Bitbucket repo away from `richard-design`.

**Never:**
- Delete or archive the GitHub repository.
- Add Bitbucket Pipelines / CI / production deploy config (out of scope — migration only).
- Change application source under `js/`, `pages/`, `styles/` for this chore.
- Use `--force`, `--no-verify`, or rewrite published history.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path | Private empty Bitbucket repo + clean commit of tracked+BMAD trees | `origin` → Bitbucket, `github` → current GitHub URL; `main` pushed to Bitbucket | N/A |
| Repo name taken | Create fails on Bitbucket | Halt; ask human for alternate name; do not invent | Wait for human |
| Auth failure on push | Credentials/SSH missing | Report exact git error; guide auth fix; do not force | Retry after human fix |
| Unexpected dirty tracked files | Modified tracked files appear | Halt; show `git status`; ask before staging | Do not auto-stage surprises |

</frozen-after-approval>

## Code Map

- `.gitignore` — extend ignores (`test-results/`) before the project commit
- `.git/config` (via `git remote`) — rename `origin` → `github`, add Bitbucket as `origin`
- `.agents/`, `_bmad/`, `_bmad-output/` — include in the migration commit
- `_bmad-output/implementation-artifacts/spec-migrate-bitbucket.md` — this spec

## Tasks & Acceptance

**Execution:**
- [x] Guide Bitbucket UI (one step at a time) — create private empty repo `richard-design` — get workspace + clone URL
- [x] `.gitignore` -- add `test-results/` -- keep ephemeral artifacts out of git
- [x] Stage `.agents/`, `_bmad/`, `_bmad-output/`, `.gitignore` (+ this spec if under `_bmad-output`) -- commit with enterprise French prefix when human confirms
- [x] `git remote` -- rename `origin` → `github`; add Bitbucket URL as `origin`
- [x] `git push -u origin main` -- publish history to Bitbucket
- [x] Verify with `git remote -v` and Bitbucket web UI -- confirm files/history visible

**Acceptance Criteria:**
- Given a Bitbucket account and chosen workspace, when the human finishes the guided create flow, then a private empty `richard-design` repo exists and its clone URL is known.
- Given the local repo after remotes are rewired, when `git remote -v` is run, then `origin` is Bitbucket and `github` is the former GitHub URL.
- Given the commit of BMAD/agent trees (excluding ignored paths), when `git push -u origin main` succeeds, then Bitbucket `main` matches local `main`.
- Given migration complete, when checking GitHub, then the GitHub remote still exists locally as `github` and was not deleted.

## Spec Change Log

## Verification

**Commands:**
- `git status -sb` -- expected: clean tree after commit (ignored untracked OK)
- `git remote -v` -- expected: `origin` Bitbucket, `github` GitHub
- `git ls-remote --heads origin` -- expected: `main` present after push

**Manual checks (if no CLI):**
- Bitbucket repo Settings → Access: Private; Source: latest commit visible with BMAD folders

## Suggested Review Order

**Ignore hygiene**

- Ephemeral Playwright output excluded from the migration commit
  [`.gitignore:3`](../../.gitignore#L3)

**Migration tracking**

- Deferred GitHub drift and follow-ups captured for later
  [`deferred-work.md:1`](deferred-work.md#L1)

- Spec tasks and remotes acceptance criteria for the cutover
  [`spec-migrate-bitbucket.md:69`](spec-migrate-bitbucket.md#L69)
