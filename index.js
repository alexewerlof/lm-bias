import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText, Output } from "ai";
import dotenv from "dotenv";
import { load as parseYaml } from "js-yaml";

const ITERATIONS_PER_ANSWER = 3;

dotenv.config();

const { values, positionals } = parseArgs({
  options: { iterations: { type: "string", short: "i" } },
  allowPositionals: true,
});

const endpoint = process.env.LLM_ENDPOINT;
const model = process.env.LLM_MODEL;
if (!endpoint || !model) {
  throw new Error(
    "Missing LLM_ENDPOINT and/or LLM_MODEL environment variables.",
  );
}

// Optional: only needed for hosted OpenAI-compatible APIs that require a key.
const token = process.env.LLM_TOKEN;

const [questionFile] = positionals;
if (!questionFile) {
  throw new Error("Usage: node index.js <question.yml> [--iterations n]");
}

const requestedIterations = values.iterations;
if (
  requestedIterations !== undefined &&
  (!Number.isInteger(Number(requestedIterations)) ||
    Number(requestedIterations) < 1)
) {
  throw new Error("--iterations must be a positive integer.");
}

const { question, answers } = parseYaml(await readFile(questionFile, "utf8"));
if (typeof question !== "string" || !question.trim()) {
  throw new Error(`${questionFile} needs a "question" string.`);
}
if (!Array.isArray(answers) || answers.length < 2) {
  throw new Error(`${questionFile} needs at least two "answers".`);
}

// Default to enough runs to cover every answer a few times; an explicit
// --iterations always wins.
const iterations =
  requestedIterations === undefined
    ? answers.length * ITERATIONS_PER_ANSWER
    : Number(requestedIterations);

const gemma = createOpenAICompatible({
  name: "gemma",
  baseURL: endpoint,
  apiKey: token,
  supportsStructuredOutputs: true,
});
const answerCounts = Object.fromEntries(answers.map((answer) => [answer, 0]));

console.log(question);
for (let i = 1; i <= iterations; i++) {
  const start = Date.now();
  const { output: picked } = await generateText({
    model: gemma(model),
    output: Output.choice({ options: answers }),
    prompt: question,
  });
  const end = Date.now();
  console.log(`${i}/${iterations}: ${picked} (${end - start} ms)`);
  answerCounts[picked]++;
}

console.table(
  Object.entries(answerCounts).map(([option, picked]) => ({
    option,
    picked,
    percent: `${((picked / iterations) * 100).toFixed(1)}%`,
  })),
);
