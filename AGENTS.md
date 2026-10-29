# AGENTS.md

Guidance for AI agents working in this repository. User-facing documentation lives
in `README.md`; this file covers what an agent needs to operate here without
rediscovering the layout.

## What this is

A single-script CLI: it asks an OpenAI-compatible LLM the same multiple-choice
question N times and prints how the model distributed its answers. It is used to
probe model bias with predefined question/answer sets.

## Layout

| Path                                                  | Role                                                                                                                                                                       |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.js`                                            | The entire program. Config loading, CLI parsing, YAML validation, and the iteration loop all live here by design — keep it a single flat file rather than splitting it up. |
| `animals.yml`, `color.yml`, `fruit.yml`, `number.yml` | Example question sets. None is a default.                                                                                                                                  |
| `.env`                                                | Local secrets/config. Git-ignored, never commit it.                                                                                                                        |
| `.env.example`                                        | Committed template for `.env`.                                                                                                                                             |
| `README.md`                                           | User-facing docs. Update it when CLI surface or setup changes.                                                                                                             |

## Commands

```sh
npm install                                  # install deps
cp .env.example .env                         # first-time setup, then edit
node index.js animals.yml                    # run (10 iterations)
node index.js animals.yml --iterations 20    # override iteration count
node index.js animals.yml -i 20              # same, short flag
```

There is no test suite, linter, or formatter script configured. Verify behavior by
running the script; a single iteration against a local endpoint takes roughly
10–25 seconds, so prefer `--iterations 1` when smoke-testing.

## Configuration

- `.env` provides `LLM_ENDPOINT` and `LLM_MODEL`. Both are required and the script
  throws if either is missing. The endpoint must be an OpenAI-compatible base URL;
  `@ai-sdk/openai-compatible` appends `/chat/completions` (no `/v1` suffix added by
  us — include `/v1` yourself if the provider needs it).
- `LLM_TOKEN` is optional and passed as the provider `apiKey`; the provider only
  adds an `Authorization: Bearer` header when it is set. Never make it required —
  local servers work without it.
- The question set is the **first positional argument** and is required — there is
  intentionally no default file.
- `--iterations` / `-i` defaults to `ITERATIONS_PER_ANSWER` (5) times the number
  of answers in the question file (2 answers → 10 runs, 6 answers → 30 runs).

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
  fields.
- `config({ quiet: true })` is deliberate: dotenv v18 prints an injection tip
  otherwise.
- Match the existing style in `index.js` (2-space indent, double quotes, semicolons);
  do not introduce a second formatting style.
- Do not add a config module, defaults file, or option-parsing helper — earlier
  iterations of this repo had those and they were deliberately removed.

## Publishing notes

The repo is public. Never hardcode an endpoint or model name, never commit `.env`,
and keep `package.json` free of machine-specific paths or secrets.
