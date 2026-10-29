# llm-random

Ask an OpenAI-compatible LLM the same multiple-choice question repeatedly and see
how it spreads its answers.

## Requirements

- Node.js 24 (LTS) or newer
- Any OpenAI-compatible chat completions endpoint (llama.cpp, Ollama, vLLM, LM Studio, ...).

## Setup

```sh
npm install
cp .env.example .env
```

Then edit `.env`:

```sh
LLM_ENDPOINT=http://localhost:8080/
LLM_MODEL=your-model-name
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
question 5 times per available answer (so a 2-answer set runs 10 times and a
6-answer set runs 30 times).

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

Example sets: `animals.yml`, `color.yml`, `fruit.yml`, `number.yml`. None is a
default — pass whichever file you want.

## Options

- `<question.yml>` — YAML question set to use (required).
- `--iterations <n>`, `-i <n>` — how many times to ask (default: 5 × the
  number of answers in the question file).
- `.env` — endpoint, model name, and optional `LLM_TOKEN`.
