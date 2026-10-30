import { readFile } from "node:fs/promises";
import dotenv from "dotenv";
import { load as parseYaml } from "js-yaml";

// `quiet` stops dotenv v18 from printing its injection tip.
dotenv.config({ quiet: true });

/**
 * Reads `LLM_ENDPOINT`, the model name from `modelVar`, and the optional
 * `LLM_TOKEN`. Each script names its own model variable so both can share one
 * endpoint.
 */
export function loadConfig(modelVar) {
  const endpoint = process.env.LLM_ENDPOINT;
  const model = process.env[modelVar];
  if (!endpoint || !model) {
    throw new Error(
      `Missing LLM_ENDPOINT and/or ${modelVar} environment variables.`,
    );
  }
  // Optional: only needed for hosted APIs that require a key.
  return { endpoint, model, token: process.env.LLM_TOKEN };
}

/** The question set is always the first positional argument. */
export function questionSetPath(positionals, usage) {
  const [questionFile] = positionals;
  if (!questionFile) {
    throw new Error(usage);
  }
  return questionFile;
}

/** Reads and validates the `question` and `answers` fields of a question set. */
export async function loadQuestionSet(questionFile) {
  const { question, answers } = parseYaml(await readFile(questionFile, "utf8"));
  if (typeof question !== "string" || !question.trim()) {
    throw new Error(`${questionFile} needs a "question" string.`);
  }
  if (
    !Array.isArray(answers) ||
    answers.length < 2 ||
    !answers.every((answer) => typeof answer === "string")
  ) {
    throw new Error(`${questionFile} needs at least two "answers".`);
  }
  return { question, answers };
}

// One decimal place, but still a number so it prints unquoted.
export function percent(part, whole) {
  return Math.round((part / whole) * 1000) / 10;
}

// Most first. Array#sort is stable, so ties keep the listing order.
export function printTable(rows, sortBy) {
  console.table([...rows].sort((a, b) => b[sortBy] - a[sortBy]));
}
