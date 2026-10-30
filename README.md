# lm-bias

Ask an OpenAI-compatible LLM the same multiple-choice question repeatedly and see
how it spreads its answers, or ask a decision model once and see the probability
it assigns to each answer.

- `lm.js` — language-model probe. Samples the answer many times.
- `decision.js` — decision-model probe. Reads the whole probability distribution.

✅ On the rush? [See the results](./RESULTS.md).

## Requirements

- Node.js 24 (LTS) or newer
- Any OpenAI-compatible chat completions endpoint (llama.cpp, Ollama, vLLM, LM Studio, ...).
- For `decision.js`, a llama.cpp server with a decision model that answers
  `/v1/systemone`.

There is no model SDK: `api.js` calls both endpoints with `fetch` and `lm.js`
constrains the language model to the offered answers with a JSON schema.

## Setup

```sh
npm install
cp .env.example .env
```

Then edit `.env`:

```sh
LLM_ENDPOINT=http://localhost:8080/
LLM_MODEL=your-model-name
DECISION_MODEL=your-decision-model
```

If you use a hosted OpenAI-compatible API (OpenAI, OpenRouter, Together, Groq, ...)
instead of a local server, also set `LLM_TOKEN`:

```sh
LLM_ENDPOINT=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
LLM_TOKEN=sk-...
```

`LLM_TOKEN` is optional and sent as a `Bearer` token; local servers that need no
key can leave it out. Note that some providers ship their own `/v1` path — use the
base URL your provider documents.

`.env` is git-ignored. See `.env.example` as an example.

## Usage

```sh
npm start -- animals.yml              # 3 × number of answers iterations
npm start -- animals.yml --iterations 50
npm start -- animals.yml -i 50        # same, short flag
```

The question file is a positional argument and is required. Each iteration prints
the model's pick, and a summary table with the pick count and its percentage of
all answers is printed at the end. Without `--iterations`, the run repeats the
question 3 times per available answer (so a 2-answer set runs 6 times and a
6-answer set runs 18 times).

## Decision models

`decision.js` asks a decision model the same question through llama.cpp's
`/v1/systemone` endpoint. The model answers in one pass with a probability per
answer, and repeating the call returns identical numbers, so the script runs once
and there is no `--iterations`:

```sh
npm run decision -- numbers.yml
npm run decision -- colors.yml
```

The model must advertise `decisions` in `architecture.output_modalities` of
`GET /v1/models`; a plain chat model answers 501 on that endpoint.

```json
{
  "id": "laya-classifier",
  "architecture": {
    "input_modalities": ["text"],
    "output_modalities": ["decisions"]
  }
}
```

It sets `DECISION_MODEL` as the model name and reuses `LLM_ENDPOINT` and the
optional `LLM_TOKEN`. The question text is sent as the question `instructions`,
and each answer becomes one option of a `choice` question. Each option's
probability is printed as a percentage, and the model's own `confidence` in the
`choice` is printed underneath as a 0–1 score.

The script files are deliberately small:

- `lm.js` — language-model loop and summary.
- `decision.js` — one decision call and the probability table.
- `lib.js` — config, question-set loading, percent rounding, table printing.
- `api.js` — the only HTTP code: `askLanguageModel` and `askDecisionModel`.

## Question sets

A question set is a YAML file with a question and the answers the model may pick
from:

```yml
question: Pick a random number between 1 and 10.
answers:
  - "1"
  - "2"
  - "3"
  - "4"
  - "5"
  - "6"
  - "7"
  - "8"
  - "9"
  - "10"
```

Example sets: `animals.yml`, `colors.yml`, `fruits.yml`, `numbers.yml`,
`coin-flip.yml`, `days.yml`, `letters.yml`, `months.yml`, `planets.yml`,
`pizza-toppings.yml`, `instruments.yml`, `nonsense-words.yml`.

The sets added for the fairness tests are processes with a known uniform answer,
so any preference in the output is measurable: `binary-digit.yml`, `yes-no.yml`,
`roulette.yml`, `card-suits.yml`, `vowels.yml`, `dice.yml`, `ab-ba.yml`,
`rand-1-to-3.yml`, `rand-1-to-5.yml`, `two-coins.yml`, `dice-parity.yml`.

None is a default — pass whichever file you want. Keep sets small: the same set
has to be cheap enough to sample many times with `lm.js` before it can be
compared with a decision model.

## Options

- `<question.yml>` — YAML question set to use (required).
- `--iterations <n>`, `-i <n>` — how many times to ask (default: 3 × the
  number of answers in the question file). Language models only.
- `.env` — endpoint, model names, and optional `LLM_TOKEN`.
