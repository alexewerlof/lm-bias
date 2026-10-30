# AGENTS.md

Guidance for AI agents working in this repository. User-facing documentation lives
in `README.md`; this file covers what an agent needs to operate here without
rediscovering the layout.

## What this is

Two small CLIs that probe model bias with the same question/answer sets. `lm.js`
asks an OpenAI-compatible language model the same multiple-choice question N times
and prints how it distributed its answers. `decision.js` asks a decision model
once and prints the probability it assigns to each answer. Shared boilerplate
lives in `lib.js` and shared HTTP calls in `api.js`, so both scripts stay short
and readable.

## Layout

| Path                                                     | Role                                                                                                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lm.js`                                                  | Language-model probe. CLI parsing, the iteration loop, and the summary all live here by design — keep each script a single flat file rather than splitting it further.    |
| `decision.js`                                            | Decision-model probe. One `/v1/systemone` call per run; no `--iterations`, because the probabilities are deterministic.                                                   |
| `lib.js`                                                 | Shared plumbing: config loading, question-set loading, percent rounding, table printing. Keep it free of script-specific logic.                                           |
| `api.js`                                                 | The only place that talks HTTP: `askLanguageModel` (one chat completion constrained to the offered options) and `askDecisionModel` (one `/v1/systemone` choice question). |
| `animals.yml`, `colors.yml`, `fruits.yml`, `numbers.yml` | Example question sets. None is a default.                                                                                                                                 |
| `.env`                                                   | Local secrets/config. Git-ignored, never commit it.                                                                                                                       |
| `.env.example`                                           | Committed template for `.env`.                                                                                                                                            |
| `README.md`                                              | User-facing docs. Update it when CLI surface or setup changes.                                                                                                            |

## Commands

```sh
npm install                                  # install deps
cp .env.example .env                         # first-time setup, then edit
node lm.js animals.yml                       # run (10 iterations)
node lm.js animals.yml --iterations 20       # override iteration count
node lm.js animals.yml -i 20                 # same, short flag
node decision.js numbers.yml                 # one decision-model call
```

There is no test suite, linter, or formatter script configured. Verify behavior by
running the script; a single language-model iteration against a local endpoint
takes roughly 10–25 seconds, so prefer `--iterations 1` when smoke-testing.

## Configuration

- `.env` provides `LLM_ENDPOINT`, `LLM_MODEL`, and `DECISION_MODEL`. All three are
  required and the scripts throw if any is missing; `lm.js` reads `LLM_MODEL` and
  `decision.js` reads `DECISION_MODEL`, so both can share one endpoint. The endpoint
  must be an OpenAI-compatible base URL; `api.js` calls `/chat/completions` on it
  (no `/v1` suffix added by us — include `/v1` yourself if the provider needs it),
  and `/v1/systemone` for the decision model.
- `LLM_TOKEN` is optional and sent as a `Bearer` token by both scripts. Never make
  it required — local servers work without it.
- The decision model must advertise `decisions` in `architecture.output_modalities`
  of `GET /v1/models`; a plain chat model returns 501 from `/v1/systemone`.
- The question set is the **first positional argument** and is required — there is
  intentionally no default file.
- `--iterations` / `-i` ( `lm.js` only) defaults to `ITERATIONS_PER_ANSWER` times the
  number of answers in the question file (2 answers → 6 runs, 6 answers → 18 runs).

Question file format:

```yml
question: What is the capital of France?
answers:
  - Paris
  - London
  - Berlin
  - Madrid
```

Only `question` (non-empty string) and `answers` (array of at least two strings) are
validated. Adding stricter checks is fine, but keep them inline and short.

## Conventions

- ES modules (`"type": "module"`); top-level `await` is used instead of a `main()`
  wrapper or try/catch. Errors are meant to surface as thrown exceptions with
  stack traces, not as hand-written user messages — do not add a catch-all handler.
- Validation is inline and ordered: env vars → positional file → iterations → YAML
  fields. The env, positional, and YAML steps are the `lib.js` helpers; everything
  else stays inline in the script that owns it.
- `config({ quiet: true })` is deliberate: dotenv v18 prints an injection tip
  otherwise. `lib.js` calls it once, at import time.
- Match the existing style in `lm.js` (2-space indent, double quotes, semicolons);
  do not introduce a second formatting style.
- Do not split the scripts further than `lib.js` and `api.js`: config, defaults
  files, and option-parsing helpers were tried in earlier iterations and
  deliberately removed. HTTP calls belong in `api.js` only; no third-party SDK.

## Publishing notes

The repo is public. Never hardcode an endpoint or model name, never commit `.env`,
and keep `package.json` free of machine-specific paths or secrets.
