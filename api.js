// Thin HTTP client for the two model kinds this repo probes. Both servers are
// llama.cpp's, so the request/response shapes are documented at
// https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md

// The decision API answers a map of questions; every call here asks exactly one.
const QUESTION_ID = "question";

const joinUrl = (endpoint, path) => `${endpoint.replace(/\/+$/, "")}${path}`;

async function post(endpoint, path, token, payload) {
  const target = joinUrl(endpoint, path);
  const response = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Only sent when a token is configured; local servers need none.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`${target} returned ${response.status}: ${body}`);
  }
  return { target, reply: JSON.parse(body) };
}

/**
 * Asks a language model one question and returns the option it picked. The
 * answer is schema-constrained to the offered options, so the model can only
 * reply with one of them.
 */
export async function askLanguageModel({
  endpoint,
  model,
  token,
  prompt,
  options,
}) {
  const { target, reply } = await post(endpoint, "/chat/completions", token, {
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "choice",
        strict: true,
        schema: {
          type: "object",
          properties: { choice: { type: "string", enum: options } },
          required: ["choice"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = reply.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error(`Unexpected ${target} response: ${JSON.stringify(reply)}`);
  }
  const picked = JSON.parse(content).choice;
  if (!options.includes(picked)) {
    throw new Error(
      `${target} picked "${picked}" outside the options: ${content}`,
    );
  }
  return picked;
}

/**
 * Asks a decision model one choice question and returns its answer: the picked
 * option, the probability of every option, and the model's own confidence.
 * One call answers the whole distribution, so there is nothing to repeat.
 */
export async function askDecisionModel({
  endpoint,
  model,
  token,
  state,
  instructions,
  options,
}) {
  const { target, reply } = await post(endpoint, "/v1/systemone", token, {
    model,
    state,
    questions: {
      [QUESTION_ID]: {
        type: "choice",
        instructions,
        criteria: Object.fromEntries(options.map((option) => [option, null])),
      },
    },
  });

  const answer = reply.answers?.[QUESTION_ID];
  if (answer?.type !== "choice" || typeof answer.confidence !== "number") {
    throw new Error(`Unexpected ${target} response: ${JSON.stringify(reply)}`);
  }
  if (!options.includes(answer.choice)) {
    throw new Error(
      `Chose "${answer.choice}", which is not an offered answer: ${JSON.stringify(reply)}`,
    );
  }
  for (const option of options) {
    if (typeof answer.probabilities?.[option] !== "number") {
      throw new Error(
        `No probability for "${option}" in ${target} response: ${JSON.stringify(reply)}`,
      );
    }
  }
  return {
    choice: answer.choice,
    probabilities: answer.probabilities,
    confidence: answer.confidence,
  };
}
