import { parseArgs } from "node:util";
import { askLanguageModel } from "./api.js";
import {
  loadConfig,
  loadQuestionSet,
  percent,
  printTable,
  questionSetPath,
} from "./lib.js";

const ITERATIONS_PER_ANSWER = 3;

const { values, positionals } = parseArgs({
  options: { iterations: { type: "string", short: "i" } },
  allowPositionals: true,
});

const { endpoint, model, token } = loadConfig("LLM_MODEL");
const questionFile = questionSetPath(
  positionals,
  "Usage: node lm.js <question.yml> [--iterations n]",
);

const requestedIterations = values.iterations;
if (
  requestedIterations !== undefined &&
  (!Number.isInteger(Number(requestedIterations)) ||
    Number(requestedIterations) < 1)
) {
  throw new Error("--iterations must be a positive integer.");
}

const { question, answers } = await loadQuestionSet(questionFile);

// Default to enough runs to cover every answer a few times; an explicit
// --iterations always wins.
const iterations =
  requestedIterations === undefined
    ? answers.length * ITERATIONS_PER_ANSWER
    : Number(requestedIterations);

const answerCounts = Object.fromEntries(answers.map((answer) => [answer, 0]));

console.log(question);
for (let i = 1; i <= iterations; i++) {
  const start = Date.now();
  const picked = await askLanguageModel({
    endpoint,
    model,
    token,
    prompt: question,
    options: answers,
  });
  const end = Date.now();
  console.log(`${i}/${iterations}: ${picked} (${end - start} ms)`);
  answerCounts[picked]++;
}

printTable(
  Object.entries(answerCounts).map(([option, picked]) => ({
    option,
    picked,
    percent: percent(picked, iterations),
  })),
  "picked",
);
