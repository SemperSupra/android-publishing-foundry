# Open Space Duel automated critic and autonomous improvement flywheel
Date: 2026-11-17 | Status: **W0 deterministic scaffold LIVE-PASS; model/vision inference NOT_RUN**.
Auth: Foundry only owns generic critic tooling; Open Space Duel private #279/#277/#278 own game source and V0–V4 release membrane. Agent Dispatch private #104 owns model×runtime qualification methodology, BrowserParity private #25/#56 owns evidence-to-deterministic-convergence methodological prior art, Model Artifact Foundry private #15 owns model/benchmark artifact provenance. No production application source change authorized.

## Executive decision
Use **deterministic critics as mandatory correctness gates**, a cheap small local VLM as visual hypothesis generator, a second independent free hosted multimodal model for reasoning/counterexamples when confirmed within quota, and a *separate* developer actor to propose focused code changes. Critics cannot approve their own proposals. All models are untrusted; only exact-run independent oracles can promote results. No paid inference fallback, no production API calls from untrusted PRs.

## Candidate model interview matrix
All candidates are *unqualified for Open Space Duel* until independently run against the same frozen evaluation set.

| Candidate | Role / modality | Free-tier resource assumption | Admission condition |
|---|---|---|---|
| `ggml-org/SmolVLM2-256M-Video-Instruct-GGUF` | cheap CPU image/frame observer; basic HUD element presence | open weights, `ghcr.io/ggml-org/llama.cpp:server` CPU image on free public Ubuntu x64 | approved exact GGUF+mmproj SHA, OCI image digest, legal license, no deceptive visual inference |
| `ggml-org/SmolVLM2-500M-Video-Instruct-GGUF` | low-cost visual critic of sampled frames/video windows | same, likely slower on hosted CPU; sample budget | infer real screenshots with independently labeled positive/negative fixtures |
| Google Gemini 2.5 Flash-Lite or an eligible current free multimodal Gemini model | independent stronger visual+reasoning critic, structured output | actual AI Studio free quota depends on project and model; no paid fallback | account eligibility, quota readback, scoped owner-supplied API key in **protected** trusted environment, public-safe inputs only |
| OpenRouter `:free` capable model | independent adversarial reasoning/logic critic | free account request/day limit and model availability may change | programmatic live availability, free-price check, modality, privacy policy, rate limit and JSON compliance verified |
| Human-free deterministic `osdcritic` + Playwright/Vitest/physics/network invariants | high-trust mandatory regression/falsification | GHA public free standard runners, no inference requests | real game trace adapter, truth-grounded invariants, independent golden fixtures and no grader tampering |

**Not admitted automatically:** retired GitHub Models service; Hugging Face Hosted Inference Providers (free-user included credits currently not a reliable zero-dollar source); free mobile browser LLMs without API or model provenance. Existing user-owned local Qwen/Gemini/other model endpoints may be *optional* actors but are not free public GHA workload guarantees. No public issue should contain API keys, usage account identifiers, or private prompts/data.

Reference links (revalidate per run):
- https://huggingface.co/ggml-org/SmolVLM2-500M-Video-Instruct-GGUF
- https://huggingface.co/ggml-org/SmolVLM2-256M-Video-Instruct-GGUF
- https://github.com/ggml-org/llama.cpp/blob/master/docs/docker.md
- https://ai.google.dev/gemini-api/docs/pricing
- https://openrouter.ai/pricing
- https://huggingface.co/docs/inference-providers/pricing

## Judge roles, source-of-truth and measurable oracles
1. **Visual UI/UX:** annotated browser/Android captures on frozen viewport/orientation/language matrix; objective pixel/DOM/AX checks for clipping, offscreen controls, readable HUD, tiny touch targets, focus loss, contrast and logical grouping. VLM *hypothesizes* issues and identifies screenshot coordinates/evidence hashes; DOM/accessibility tree/layout oracle determines falsifiable claim.
2. **Gameplay and feel:** deterministic seeded frame/state traces with simulation tick, flight model, pilot inputs, energy/shield/health, collisions, thrust and round lifecycle. Check nonnegative resource accounting (ranges must be calibrated from actual game), conservation/invariants when applicable, collisions, frame-rate independence, reset, stable step order. VLM watches brief video, but temporal/physics assertions come from numerical reference.
3. **Multiplayer:** genuine WebRTC client↔client handshake, seed/model identity, sequence/replay constraints, host/guest role reversal, latency/jitter/drop/reconnect, state-hash divergence and user-facing failure codes. Critic claims require trace + network evidence, not synthetic mocks alone.
4. **DX/human+automation+agent:** language-neutral JSON schemas, stable CLI, discoverable intents/commands/observations, localized EN/DE/TH strings, installer/onboarding instructions, reproducible build and dry-run, feature equivalence. Exercise same capability through UI/manual emulator, deterministic CLI replay and bounded agent tool use.
5. **Adversarial reasoning critic:** challenge proposals, check for contradictory observations, confounders (simulator vs real device, screenshot vs physics, runner vs game, source mismatches, uncaught regression), provide disconfirming experiment; measure independently validated novel finds rather than persuasiveness.

## Feedback flywheel with immutable trust stages
```
Approved public source SHA + model/tool/image digests
  -> disposable test scene replay + deterministic trace + screenshots/video
  -> hard deterministic oracles and privacy/asset sanitization
  -> bounded cheap VLM + independent reasoning critic (public-safe only)
  -> typed observations + hypotheses + severity + confidence + falsifier
  -> triage by evidence, critic disagreement and human steering
  -> tightly scoped implementation actor PR (different actor from critics)
  -> independent test replay and regression + cross-platform diff
  -> qualify corrected deterministic reusable invariant/tool/test
  -> reviewed source release gate; re-run to detect drift
```
No self-modification of frozen golden tests, baseline truth, release policy, signed artifacts, keys or grader criteria. Findings not yet experimentally confirmed stay `HYPOTHESIS`. Validated issue transitions to `FALSIFIED` or `CONFIRMED`; only an accepted independent retest can promote `FIX_VERIFIED`. No automatic merge or publication.

## Canonical critic finding (proposed)
```json
{
  "schema": "osd-critic-finding/v1",
  "source_sha": "<40 lowercase hex>",
  "scene_id": "arcade-two-pilot-seed42",
  "evidence": {
    "frame_tick": 120,
    "screenshot_sha256": "<64 lowercase hex>",
    "trace_sha256": "<64 lowercase hex>",
    "runner": "ubuntu-24.04",
    "browser": "chromium",
    "ghcr_image_sha256": "<approved digest>"
  },
  "critic": {
    "model": "smolvlm2-500m",
    "runtime": "llama.cpp",
    "prompt_sha256": "<64 lowercase hex>",
    "inference_mode": "cpu",
    "tokens": 0,
    "latency_ms": 0,
    "cost_usd": 0
  },
  "finding": {
    "category": "ui_accessibility",
    "hypothesis": "ship health indicator is clipped in portrait",
    "severity": "major",
    "confidence": 0.5,
    "disconfirming_test": "DOM bounding box measured against visible viewport and independent screen-reader traversal",
    "status": "HYPOTHESIS"
  }
}
```
Do not use confidence as release permission; include claimed screen region and visible evidence pointer. Do not upload copyrighted/private assets, user/player PII, passwords, invite URLs, or private code to public model services.

## Model qualification interview: hard filters before ranking
- Capability: image/video input for visual critic; non-image reasoning models can analyze structured traces only, never claim they saw screenshots.
- Venue: free-tier GHA public on fresh VM; GHCR image digest and GGUF+mmproj immutable file hashes, no permanent host installs; cap model downloads, token generation, image resolution and runtime.
- License/security: redistributability, endpoint privacy/retention, source/provenance, provider no-cost pricing confirmed immediately before request, zero-spend/no-paid-fallback flag and quota guard.
- Work samples: 10+ synthetic known-fault UI screenshots (text clipping, score overflow, low contrast, focus and touch target), 10+ clean negatives, seeded motion video + trace contradictions, 10+ gameplay/network fabricated evidence traps. Include language EN/DE/TH and browser/Android differentiation. Hidden expected verdicts are withheld from the actor; evaluator cannot modify truth.
- Measures: precision/recall of evidence-backed faults, false-positive risk, abstention on ambiguous clips, disconfirming-experiment yield, independent improvement over deterministic checks, unique complementarity between critics, time per scene, RAM, download bytes, API quota, operator minutes and repair attempts.
- Decision gate: adopt if hard filters pass and incremental validated coverage per unit of attention/resource beats deterministic-only baseline. Model-specific thresholds set before seeing candidate outputs; do not select a flattering model post-hoc.

## W0 actual public executable seed and limits
- `tools/osdcritic/main.go`: Go stdlib deterministic validator for **synthetic** `osd-observation-trace/v1`: checks SHA/schema, frame ordering, stable match/mode, ship identity, finite coordinates and bounded synthetic resource values. Returns `osd-critic-report/v1` with result `PASS_CONTRACT_ONLY` or `FAIL`. No model API.
- `tools/osdcritic/main_test.go`: adversarial malformed JSON, size cap, 14 negative fixtures, warning and serialization.
- `.github/workflows/osd-critic-contract.yml`: read-only public Ubuntu 24.04 standard runner, 8-minute deadline, pinned checkout, no secrets or cache, Go vet/tests. **Actual passed run:** https://github.com/SemperSupra/android-publishing-foundry/actions/runs/44149266058 at exact commit `a8595f083a9f6cf7f472f92e52b6bd7d0d8e5325`. No OSD real game telemetry consumed or visual inference run.
- Go preinstalled on fresh public GitHub-hosted VM is a short-lived bootstrap toolchain; GHCR-preferred, digest-pinned image qualification is pending from Foundry W0/W1. A disposable VM qualifies non-taint but is not proof of GHCR image readiness.

## Next parallel bounded actions
A. Build exact-source, non-mutating public OSD gameplay observation adapter with stable hooks, synthetic fixtures and private-source membrane check. No private code public projection.
B. Produce 20+ original synthetic screen/video falsifiers in EN/DE/TH with independent geometric truth labels using disposable browser runner (not user/private screenshots). Capture identical screenshots and UI AX trees per viewport.
C. Containerize CPU llama.cpp + SmolVLM2-256M/500M from public weights as separate **GHCR** image/build manifests, pin OCI and weights digests; run one image+frame VLM work sample on Ubuntu24 x64; require memory/latency/quality receipt and cleanup.
D. Integrate a protected-cost-zero Gemini Flash-Lite model adapter and optional OpenRouter free route with live pricing/quota check and strict request budget; no API access without authorized secrets and free eligibility; mock offline contract first.
E. Run independent blind critic debate and falsifier challenge; adjudicate via deterministic rerun and human steering, record unique valid contributions and accepted candidate tests.
F. Generate a bounded issue/PR proposal only for confirmed defects, then independently test fixes on desktop/browser/mobile emulation + actual Android where admitted. Maintain release gate and source isolation.

## Failure/stop classifications
`NO_MODEL_ACCESS`, `QUOTA_EXHAUSTED`, `NOT_FREE`, `HOST_UNSUPPORTED`, `MODEL_DOWNLOAD_POLICY`, `VISUAL_UNGROUNDED`, `HYPOTHESIS_UNCONFIRMED`, `ORACLE_FAILURE`, `MODEL_HALLUCINATION`, `HUMAN_GATE`, `AUTHORIZED_RERUN`. Do not convert missing data into a pass; retry only after bounded discriminating diagnosis, not endless API loops.

## Stop rules
No paid provider calls, no private GitHub Actions minutes, no credentials in public PRs, no private image/OSD source sent to public inference, no automated tests that overwrite hardcoded oracle truth, no autonomous merge, production signing, GitHub Pages promotion, or store submission. The P0 objective is a qualified **critic detection loop**, not autonomous unreviewed production code change.
