import { parseArgs } from "node:util";
import { askDecisionModel } from "./api.js";
import {
  loadConfig,
  loadQuestionSet,
  percent,
  printTable,
  questionSetPath,
} from "./lib.js";

const { positionals } = parseArgs({ allowPositionals: true });

const { endpoint, model, token } = loadConfig("DECISION_MODEL");
const questionFile = questionSetPath(
  positionals,
  "Usage: node decision.js <question.yml>",
);
const { question, answers } = await loadQuestionSet(questionFile);

// A decision model answers in one pass and returns the whole distribution, so
// there is no --iterations: repeating the call only yields the same numbers.
const { probabilities, confidence } = await askDecisionModel({
  endpoint,
  model,
  token,
  // There is no separate document to classify, so the state is empty and the
  // question text carries the whole prompt.
  state: "",
  instructions: question,
  options: answers,
});

// Probabilities are 0-1, so a whole of 1 turns them into percentages.
const rows = answers.map((option) => ({
  option,
  percent: percent(probabilities[option], 1),
}));

console.log(question);
// Most likely first; the top row is the model's pick.
printTable(rows, "percent");
console.log(`confidence: ${confidence.toFixed(3)}`);
