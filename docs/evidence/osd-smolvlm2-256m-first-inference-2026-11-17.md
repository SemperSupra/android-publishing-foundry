# Open Space Duel VLM CPU qualification — first genuine inference receipt (2026-11-17)

## Status and authority
**Actual inference executed, strict oracle FAILED. No Open Space Duel gameplay/UI test or model qualification granted.** Experiment in public Foundry draft PR #4, stacked on critic contract PR #3. Public GHA only, no private assets or credentials, no release effects.

### Immutable evidence
- First failure (harness compile and cleanup): https://github.com/SemperSupra/android-publishing-foundry/actions/runs/44149926863 at `a58e52e8f78c8b9a26b5a2b1799045c0256e52f3`. `fmt` unused blocked Go compile, root-owned cache cleanup failed. Preserve RED, not a model judgment.
- Corrected live run: https://github.com/SemperSupra/android-publishing-foundry/actions/runs/44150183492 at `ec302d321d327c967ef99fd0188ed0dc42c200bf`; job `134276162597`.
- Upstream GHCR llama.cpp server OCI image exact observed digest `sha256:5b43086e3ba7ea5794d72904654f6cd41224a9b1c6ac0398f4940ee380d30f23`, pulled by digest (observed experimental image, **not** promoted catalog-approved).
- Actual model `ggml-org/SmolVLM2-256M-Video-Instruct-GGUF:Q4_K_M`; Hugging Face cache observed repo snapshot `a48f519adb9e5a5f262e3a5004fb9a88fcfca54e` and model `SmolVLM2-256M-Video-Instruct-Q4_K_M.gguf`, paired projector file `mmproj-SmolVLM2-256M-Video-Instruct-Q8_0.gguf`. Full SHA256 of both model files not yet independently recorded; model pinning incomplete. Runtime `go1.24.13 linux/amd64`.
- Original generated stimulus: blue 128x128 square with central red 64x64 square, PNG SHA256 `dbfb3ff50770913e79fc598457a779322a9717b351377a45b96806f529e3d4a8`.
- **Actual completion:** `the image displays a blue square with a red rectangle in the center.`
- Response: HTTP 200; 1159 prompt tokens; 15 completion tokens; 1174 total; measured request latency **25,094 ms**.
- Strict accepted reply requested exactly one of `red`, `green`, `blue`, `unknown` for the center square; response failed strict **one-word machine format** oracle, `classification=ORACLE_FAILURE` (CI job failure), despite verbally identifying the red central geometry. Do not relabel overall result PASS.
- Receipt + synthetic PNG + image digest are in artifact `14358666440`, public run linked above (3-day retention).

## Interpretive separation
- `runner:ghcr-pull-and-model-start` SUPPORTED.
- `model:real-image-input-and-response` SUPPORTED for this synthetic.
- `visual:central-color-detection` evidence *consistent* with truth, not blind independent visual accuracy qualification.
- `structured-output:one-word-label` FAILED under preregistered prompt.
- `gameplay:actual-Open-Space-Duel-UI-UX-DX` NOT_RUN.
- `mobile/real-browser WebRTC` NOT_RUN.
- `cost`: no paid provider/model API or private hosted minutes; GHA public standard runner. Exact GHCR free-use and download expenses should still be audited as separate cost-class metadata.

## Next *discriminating* experiments
1. Preserve original failure and do not alter its frozen expected response merely to manufacture success. Distinguish visually-grounded semantic content from instruction-format compliance in *new* declared evaluator. Add independent clean negatives (no red center, inverted palettes, small text/overlap) and heldout private-to-critic truth.
2. Compare 256M and 500M VLM on **identical frozen** screenshot packs, evidence-backed object/contrast/text/hud questions and output schema. Add a bounded structured-output adapter (grammar/JSON schema if runtime supports), but score instruction-following separately.
3. Pin model file SHA256 and projector SHA256, model repo revision, GHCR approved OCI digest, token/context budgets; promote only after reviewed license/provenance and runtime memory/non-taint evidence.
4. Consume genuine source-authorized *public-only* OSD 0.3.1 screenshots, DOM/accessibility trees and numerical replay from existing cross-browser RDTE; no private OSD protected evaluator assets may cross public boundary.
5. Qualify a stronger independent hosted free multimodal reasoning critic only with owner-authorized secrets and live zero-cost quota/availability check. Keep the critic's outputs advisory and independently falsifiable.
6. Build confirmed-issue→scoped PR→deterministic retest→reviewed merge feedback. No autonomous publication.

## Reconciliation
Private OSD DLE #279/#277/#278 remains the gameplay implementation and V0–V4 release authority. Foundry PR #3 holds shared critic architecture, PR #4 is bounded local image-inference candidate. Agent Dispatch private #104 owns actor interview methodology; model-artifact-foundry private #15 owns broader image benchmark artifact provenance. Nothing here authorizes production game fixes, test oracle rewrites, new store submissions or a model registry promotion.
