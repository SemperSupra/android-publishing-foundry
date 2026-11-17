# Android Publishing Foundry

Public, credential-free engineering and execution plane for reusable open-source Android application qualification and distribution to **direct signed APK, self-hosted F-Droid, official F-Droid, Amazon Appstore (Fire OS), and Google Play**.

**Status: DLE bootstrap; no production publisher has been built or authorized.**

## Authority and scope

- This **public repository** owns source, build templates, tools, release schemas, test fixtures, reusable workflows, public documentation, and sanitized qualification evidence.
- [Private companion](https://github.com/SemperSupra/android-publishing-foundry-private) owns nonpublic operational planning and sanitized metadata for credential provisioning and account governance, *never* actual secrets, identity documents, signing keys, or API tokens in Git.
- Public CI must operate independently with read-only unprivileged permissions for untrusted PRs. Store publishing is protected by manual, per-artifact, per-target authorization.
- Release orchestration must **fail closed** on missing licenses, incompatible signing identities, invalid or stale evidence, or unmet prerequisites.

## Start here

1. `AGENTS.md` — actor contract and trust boundaries.
2. `CURRENT_TASK.md` — next bounded execution wave.
3. `docs/plans/mvp-critical-path.md` — executable roadmap and gates.
4. `docs/architecture/distribution-contract.md` — channel and signing rules.

## Upstream governance

Organization-level [draft DLE proposal PR #5](https://github.com/SemperSupra/.github/pull/5) is historical bootstrap context. Once this repository's DLE is reviewed and merged, **this repository becomes authoritative for public implementation**. Private companion independently owns private operational state. No store credentials or apps have been deployed.
