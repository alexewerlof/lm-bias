# Results

Observed model bias when asking the same multiple-choice question repeatedly, for
a language model and a decision model side by side.

Every test appears twice: the language-model block first (how often each answer
was sampled), then the decision-model block (the probability each answer is given).
Both blocks are copied verbatim from the runs, so the `percent` columns are
directly comparable.

The tests fall into two families:

- **Fair processes** ([part 1](#part-1--fair-processes)) — a bit, a coin, a die, a
  deck, an alphabet. The question names a process that is random by construction,
  so the correct answer distribution is known in advance. Deviating from it is
  measurable bias, not a matter of taste.
- **Category questions** ([part 2](#part-2--category-questions)) — animals, colors,
  months, letters. There is no correct distribution here; they show which member
  of a category the model reaches for first.

Part 1 comes first because it has ground truth. It turns "the model seems to like
`7`" into "eighteen fair dice rolls came up `4`, every single time".

## Models

| Setting  | Language model                                  | Decision model                              |
| -------- | ----------------------------------------------- | ------------------------------------------- |
| Model    | Gemma 4 12B (`gemma-4-12B-it`)                  | Laya (`laya-classifier`)                    |
| Thinking | Default                                         | Not applicable                              |
| Sampling | Default                                         | Not applicable                              |
| Hardware | Mac Mini M4                                     | Mac Mini M4                                 |
| Runtime  | llama.cpp (`llama-server`, `/chat/completions`) | llama.cpp (`llama-server`, `/v1/systemone`) |
| Client   | `node lm.js <question-set> [-i <iterations>]`   | `node decision.js <question-set>`           |

The language model samples one answer per iteration and each row counts how many
iterations picked that answer; every loop ran fresh, so the model did not see its
historical performance. The decision model answers once with a probability for
every answer, so its blocks have no iteration count and no `picked` column, and a
repeated call returns identical numbers. `confidence` is the model's own
confidence in its pick, on a 0–1 scale.

## Part 1 — Fair processes

Every question in this part describes a process that is random by construction —
a bit, a coin, a die, a deck — so the correct answer distribution is known before
the model is asked. A human answering honestly would be uniform. Whatever the
model does instead is prior leakage, and because the expectation is exact it can
be measured against a number instead of argued about.

The headline sections are the experiments whose most-picked answer passed **95%**
of all sampled iterations using the script's default count (3 × the number of
answers, so 2 answers → 6 runs, 4 answers → 12). Anything held less strongly is
kept under [Close calls and counter-examples](#close-calls-and-counter-examples)
and labelled as such.

### Summary

| Question set       | Fair answer | Language model       | Decision model       |
| ------------------ | ----------- | -------------------- | -------------------- |
| `binary-digit.yml` | 50 / 50     | **100% `1`**         | 61.2% `1`            |
| `yes-no.yml`       | 50 / 50     | **100% `Yes`**       | 61.4% `Yes`          |
| `roulette.yml`     | 50 / 50     | **100% `Red`**       | 61.3% `Black`        |
| `card-suits.yml`   | 25% each    | **100% `Spades`**    | 32.3% `Spades`       |
| `vowels.yml`       | 20% each    | **100% `E`**         | 25.2% `E`            |
| `dice.yml`         | 16.7% each  | **100% `4`**         | 28.4% `3`            |
| `ab-ba.yml`        | 50 / 50     | **100% `AB`**        | 73.3% `BA`           |
| `rand-1-to-3.yml`  | 33.3% each  | **100% `2`**         | 41.3% `3`            |
| `two-coins.yml`    | 25% each    | 91.7% `Heads, Tails` | 32.5% `Heads, Heads` |
| `rand-1-to-5.yml`  | 20% each    | 93.3% `4`            | 25.3% `4`            |
| `dice-parity.yml`  | 50 / 50     | 50 / 50, unbiased    | 71.1% `Even`         |

The visual pattern is the point: the language model is **not** a sampler that
sometimes lands in the wrong place. Eight separate fair processes were answered
unanimously, and the choice is always the option with the most mass among those
offered — never the one a random draw would produce. The decision model never
reaches certainty: roughly 60–73% on the two-option questions and under 45% on the
rest, and on four questions it picks an answer the language model never picked at
all (`roulette.yml`, `ab-ba.yml`, `rand-1-to-3.yml`, `dice.yml`).

### A single bit

A bit has exactly two states and no texture at all in human writing, so any
preference here cannot come from taste.

```sh
node lm.js binary-digit.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ '1'    │ 6      │ 100     │
│ 1       │ '0'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js binary-digit.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ '1'    │ 61.2    │
│ 1       │ '0'    │ 38.8    │
└─────────┴────────┴─────────┘
confidence: 0.224
```

`1` wins unanimously. `1` is the affirmative literal in code, the success exit
code, `true`, the populated array — it appears in more contexts that mean "yes"
than `0` does, and that asymmetry survives even when the question asks for a
_random_ bit. The decision model shows the same direction but at the same mild
strength it shows everywhere else.

### Yes / No

```sh
node lm.js yes-no.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ 'Yes'  │ 6      │ 100     │
│ 1       │ 'No'   │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js yes-no.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ 'Yes'  │ 61.4    │
│ 1       │ 'No'   │ 38.6    │
└─────────┴────────┴─────────┘
confidence: 0.227
```

The instruction is to pick a _random answer_, not to answer. Yet the model cannot
produce `No` once in six tries. Assistant-tuned text is overwhelmingly helpful and
affirming, so `Yes` sits where a "positive response" has to start — and a request
to be random does not remove that pressure. Note that a `true-false.yml` set (same
shape, different wording) came out only 4–2 for `False` and was discarded, so this
is not simply "positivity wins"; the _specific strings_ carry the effect.

### Roulette: red, or black?

The clearest example of two models disagreeing about a 50/50.

```sh
node lm.js roulette.yml
┌─────────┬─────────┬────────┬─────────┐
│ (index) │ option  │ picked │ percent │
├─────────┼─────────┼────────┼─────────┤
│ 0       │ 'Red'   │ 6      │ 100     │
│ 1       │ 'Black' │ 0      │ 0       │
└─────────┴─────────┴────────┴─────────┘
```

```sh
node decision.js roulette.yml
┌─────────┬─────────┬─────────┐
│ (index) │ option  │ percent │
├─────────┼─────────┼─────────┤
│ 0       │ 'Black' │ 61.3    │
│ 1       │ 'Red'   │ 38.7    │
└─────────┴─────────┴─────────┘
confidence: 0.227
```

The language model is unanimous for `Red`; the decision model leans to `Black`.
Whichever prior drives the language model, it is not the one the classifier uses —
and neither model comes close to the 50/50 the question promises. This is the
strongest evidence that these results describe two different decision mechanisms
rather than noise.

### Card suits

```sh
node lm.js card-suits.yml
┌─────────┬────────────┬────────┬─────────┐
│ (index) │ option     │ picked │ percent │
├─────────┼────────────┼────────┼─────────┤
│ 0       │ 'Spades'   │ 12     │ 100     │
│ 1       │ 'Hearts'   │ 0      │ 0       │
│ 2       │ 'Diamonds' │ 0      │ 0       │
│ 3       │ 'Clubs'    │ 0      │ 0       │
└─────────┴────────────┴────────┴─────────┘
```

```sh
node decision.js card-suits.yml
┌─────────┬────────────┬─────────┐
│ (index) │ option     │ percent │
├─────────┼────────────┼─────────┤
│ 0       │ 'Spades'   │ 32.3    │
│ 1       │ 'Clubs'    │ 28.5    │
│ 2       │ 'Diamonds' │ 24.1    │
│ 3       │ 'Hearts'   │ 15.1    │
└─────────┴────────────┴─────────┘
confidence: 0.097
```

Worth noting _which_ suit: `Spades` is listed **last**. It is also the highest
card in most ranking conventions, and bridge/bidding text is full of spade-heavy
praise. Both models agree here, which makes it a useful control against the naive
explanation "the first item in the list wins" — that explanation fails on this
data.

### Vowels

```sh
node lm.js vowels.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ 'E'    │ 15     │ 100     │
│ 1       │ 'A'    │ 0      │ 0       │
│ 2       │ 'I'    │ 0      │ 0       │
│ 3       │ 'O'    │ 0      │ 0       │
│ 4       │ 'U'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js vowels.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ 'E'    │ 25.2    │
│ 1       │ 'O'    │ 20.4    │
│ 2       │ 'I'    │ 19.2    │
│ 3       │ 'A'    │ 17.9    │
│ 4       │ 'U'    │ 17.2    │
└─────────┴────────┴─────────┘
confidence: 0.065
```

Fifteen out of fifteen for `E`. This is the most defensible bias in the set
because it has a documented cause: `E` is the most common letter in English.
Asking for a "random vowel" retrieves a frequency distribution rather than a
uniform one. The decision model picks the same winner, but holds it at a quarter
of the mass instead of all of it.

### A six-sided die

The single sharpest result in this collection.

```sh
node lm.js dice.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ '4'    │ 18     │ 100     │
│ 1       │ '1'    │ 0      │ 0       │
│ 2       │ '2'    │ 0      │ 0       │
│ 3       │ '3'    │ 0      │ 0       │
│ 4       │ '5'    │ 0      │ 0       │
│ 5       │ '6'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js dice.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ '3'    │ 28.4    │
│ 1       │ '4'    │ 22.6    │
│ 2       │ '6'    │ 19.7    │
│ 3       │ '5'    │ 18      │
│ 4       │ '2'    │ 7       │
│ 5       │ '1'    │ 4.3     │
└─────────┴────────┴─────────┘
confidence: 0.141
```

Eighteen consecutive rolls of `4`, on a die the question explicitly calls _fair_.
A player would notice. The model cannot. Like the `7` in `numbers.yml`, `4` is a
well-worn single-token number (dice idioms, clocks, seasons, the "roll a 4"
example), and the word "die" in the prompt pulls that token forward harder than
"random" pushes the distribution flat.

### AB or BA

The cleanest available test of _ordering_ as a cause, because the two options are
the same two characters.

```sh
node lm.js ab-ba.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ 'AB'   │ 6      │ 100     │
│ 1       │ 'BA'   │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js ab-ba.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ 'BA'   │ 73.3    │
│ 1       │ 'AB'   │ 26.7    │
└─────────┴────────┴─────────┘
confidence: 0.465
```

The language model returns `AB` six times out of six; the decision model returns
`BA` at 73%. Each picked one ordering, and they picked opposite ones. Neither
picked at random. `AB` is the ordering convention (alphabet, patterns, chords,
blood types), and a request for randomness does not dissolve convention — it just
exposes it.

### Numbers 1 to 3

This one tests what happens when the favourite token is _not on the menu_.

```sh
node lm.js rand-1-to-3.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ '2'    │ 9      │ 100     │
│ 1       │ '1'    │ 0      │ 0       │
│ 2       │ '3'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js rand-1-to-3.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ '3'    │ 41.3    │
│ 1       │ '1'    │ 33.5    │
│ 2       │ '2'    │ 25.2    │
└─────────┴────────┴─────────┘
confidence: 0.119
```

Nine out of nine for `2`. With `7` and `4` unavailable, the model does not spread
its mass toward uniform — it collapses to the geometric centre of the offered
range. The decision model does the exact opposite and gives the centre its
_lowest_ probability. This is the result that most surprised me while designing
these tests: the fallback is not "be more random", it is "be more average".

### Close calls and counter-examples

These are kept because the numbers are informative, not because they clear the
95% bar. All three are reproducible with the same commands.

#### Two coins — 91.7%

```sh
node lm.js two-coins.yml
┌─────────┬────────────────┬────────┬─────────┐
│ (index) │ option         │ picked │ percent │
├─────────┼────────────────┼────────┼─────────┤
│ 0       │ 'Heads, Tails' │ 11     │ 91.7    │
│ 1       │ 'Tails, Heads' │ 1      │ 8.3     │
│ 2       │ 'Heads, Heads' │ 0      │ 0       │
│ 3       │ 'Tails, Tails' │ 0      │ 0       │
└─────────┴────────────────┴────────┴─────────┘
```

```sh
node decision.js two-coins.yml
┌─────────┬────────────────┬─────────┐
│ (index) │ option         │ percent │
├─────────┼────────────────┼─────────┤
│ 0       │ 'Heads, Heads' │ 32.5    │
│ 1       │ 'Tails, Heads' │ 23.4    │
│ 2       │ 'Heads, Tails' │ 22.9    │
│ 3       │ 'Tails, Tails' │ 21.1    │
└─────────┴────────────────┴─────────┘
confidence: 0.100
```

Four equally likely outcomes; two of them never occurred in twelve flips. The
winner is `Heads, Tails` — the exact word order of the idiom "heads or tails", and
not the alphabetical order (`Heads, Heads`) that the decision model prefers. The
mechanism is memorised collocation rather than probability.

#### Numbers 1 to 5 — 93.3%

```sh
node lm.js rand-1-to-5.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ '4'    │ 14     │ 93.3    │
│ 1       │ '3'    │ 1      │ 6.7     │
│ 2       │ '1'    │ 0      │ 0       │
│ 3       │ '2'    │ 0      │ 0       │
│ 4       │ '5'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js rand-1-to-5.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ '4'    │ 25.3    │
│ 1       │ '3'    │ 24.2    │
│ 2       │ '1'    │ 18.1    │
│ 3       │ '2'    │ 16.9    │
│ 4       │ '5'    │ 15.5    │
└─────────┴────────┴─────────┘
confidence: 0.066
```

Read next to `rand-1-to-3.yml`, this pins down the mechanism: `4` is a token
attractor in its own right, and the "middle" result above only appears because
`4` and `7` were not offered. The rule is not "pick the middle" — it is "pick the
heaviest available token, falling back to the middle when none is heavy".

#### Odd or even — the LM was fair, the decision model was not

```sh
node lm.js dice-parity.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ 'Odd'  │ 3      │ 50      │
│ 1       │ 'Even' │ 3      │ 50      │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js dice-parity.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ 'Even' │ 71.1    │
│ 1       │ 'Odd'  │ 28.9    │
└─────────┴────────┴─────────┘
confidence: 0.422
```

The only question in the set the language model answered exactly as a fair process
would, and the decision model got it wrong at 71/29. It is the control that makes
the rest credible: the language model is not uniformly bad at this task, it is bad
in a specific, reproducible direction, and the two models fail differently.

## Part 2 — Category questions

No correct distribution exists for these questions: "pick a random animal" has no
uniform truth to compare against, and one could argue any answer reflects taste
rather than error. They are included because they show the same retrieval
behaviour at a coarser grain — which member of a category the model reaches for
first — and because the language model and the decision model often rank the
category completely differently. Read them as a survey, not as a measurement.

### Numbers

```sh
node lm.js numbers.yml -i 16
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ '7'    │ 16     │ 100     │
│ 1       │ '1'    │ 0      │ 0       │
│ 2       │ '2'    │ 0      │ 0       │
│ 3       │ '3'    │ 0      │ 0       │
│ 4       │ '4'    │ 0      │ 0       │
│ 5       │ '5'    │ 0      │ 0       │
│ 6       │ '6'    │ 0      │ 0       │
│ 7       │ '8'    │ 0      │ 0       │
│ 8       │ '9'    │ 0      │ 0       │
│ 9       │ '10'   │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js numbers.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ '7'    │ 15.9    │
│ 1       │ '9'    │ 13.5    │
│ 2       │ '6'    │ 13.1    │
│ 3       │ '8'    │ 10.8    │
│ 4       │ '4'    │ 10.5    │
│ 5       │ '3'    │ 9.5     │
│ 6       │ '10'   │ 9.3     │
│ 7       │ '5'    │ 8.9     │
│ 8       │ '1'    │ 5.5     │
│ 9       │ '2'    │ 3.1     │
└─────────┴────────┴─────────┘
confidence: 0.065
```

### Coin-flip

```sh
node lm.js -i 13 coin-flip.yml
┌─────────┬─────────┬────────┬─────────┐
│ (index) │ option  │ picked │ percent │
├─────────┼─────────┼────────┼─────────┤
│ 0       │ 'Heads' │ 12     │ 92.3    │
│ 1       │ 'Tails' │ 1      │ 7.7     │
└─────────┴─────────┴────────┴─────────┘
```

```sh
node decision.js coin-flip.yml
┌─────────┬─────────┬─────────┐
│ (index) │ option  │ percent │
├─────────┼─────────┼─────────┤
│ 0       │ 'Heads' │ 85.1    │
│ 1       │ 'Tails' │ 14.9    │
└─────────┴─────────┴─────────┘
confidence: 0.702
```

### Colors

```sh
node lm.js colors.yml
┌─────────┬───────────┬────────┬─────────┐
│ (index) │ option    │ picked │ percent │
├─────────┼───────────┼────────┼─────────┤
│ 0       │ 'Teal'    │ 10     │ 100     │
│ 1       │ 'White'   │ 0      │ 0       │
│ 2       │ 'Black'   │ 0      │ 0       │
│ 3       │ 'Red'     │ 0      │ 0       │
│ 4       │ 'Blue'    │ 0      │ 0       │
│ 5       │ 'Green'   │ 0      │ 0       │
│ 6       │ 'Yellow'  │ 0      │ 0       │
│ 7       │ 'Orange'  │ 0      │ 0       │
│ 8       │ 'Purple'  │ 0      │ 0       │
│ 9       │ 'Pink'    │ 0      │ 0       │
│ 10      │ 'Brown'   │ 0      │ 0       │
│ 11      │ 'Gray'    │ 0      │ 0       │
│ 12      │ 'Cyan'    │ 0      │ 0       │
│ 13      │ 'Magenta' │ 0      │ 0       │
│ 14      │ 'Indigo'  │ 0      │ 0       │
│ 15      │ 'Violet'  │ 0      │ 0       │
│ 16      │ 'Maroon'  │ 0      │ 0       │
│ 17      │ 'Olive'   │ 0      │ 0       │
│ 18      │ 'Navy'    │ 0      │ 0       │
└─────────┴───────────┴────────┴─────────┘
```

```sh
node decision.js colors.yml
┌─────────┬───────────┬─────────┐
│ (index) │ option    │ percent │
├─────────┼───────────┼─────────┤
│ 0       │ 'Purple'  │ 99.8    │
│ 1       │ 'Cyan'    │ 0.1     │
│ 2       │ 'White'   │ 0       │
│ 3       │ 'Black'   │ 0       │
│ 4       │ 'Red'     │ 0       │
│ 5       │ 'Blue'    │ 0       │
│ 6       │ 'Green'   │ 0       │
│ 7       │ 'Yellow'  │ 0       │
│ 8       │ 'Orange'  │ 0       │
│ 9       │ 'Pink'    │ 0       │
│ 10      │ 'Brown'   │ 0       │
│ 11      │ 'Gray'    │ 0       │
│ 12      │ 'Magenta' │ 0       │
│ 13      │ 'Teal'    │ 0       │
│ 14      │ 'Indigo'  │ 0       │
│ 15      │ 'Violet'  │ 0       │
│ 16      │ 'Maroon'  │ 0       │
│ 17      │ 'Olive'   │ 0       │
│ 18      │ 'Navy'    │ 0       │
└─────────┴───────────┴─────────┘
confidence: 0.998
```

### Animals

```sh
node lm.js animals.yml -i 30
┌─────────┬────────────┬────────┬─────────┐
│ (index) │ option     │ picked │ percent │
├─────────┼────────────┼────────┼─────────┤
│ 0       │ 'Elephant' │ 21     │ 70      │
│ 1       │ 'Penguin'  │ 4      │ 13.3    │
│ 2       │ 'Panda'    │ 3      │ 10      │
│ 3       │ 'Tiger'    │ 1      │ 3.3     │
│ 4       │ 'Bear'     │ 1      │ 3.3     │
│ 5       │ 'Lion'     │ 0      │ 0       │
│ 6       │ 'Giraffe'  │ 0      │ 0       │
│ 7       │ 'Zebra'    │ 0      │ 0       │
│ 8       │ 'Monkey'   │ 0      │ 0       │
│ 9       │ 'Kangaroo' │ 0      │ 0       │
└─────────┴────────────┴────────┴─────────┘
```

```sh
node decision.js animals.yml
┌─────────┬────────────┬─────────┐
│ (index) │ option     │ percent │
├─────────┼────────────┼─────────┤
│ 0       │ 'Panda'    │ 19.1    │
│ 1       │ 'Monkey'   │ 13.9    │
│ 2       │ 'Zebra'    │ 13      │
│ 3       │ 'Bear'     │ 10.1    │
│ 4       │ 'Tiger'    │ 9.5     │
│ 5       │ 'Giraffe'  │ 8.3     │
│ 6       │ 'Kangaroo' │ 7.2     │
│ 7       │ 'Penguin'  │ 7.2     │
│ 8       │ 'Elephant' │ 6.8     │
│ 9       │ 'Lion'     │ 5       │
└─────────┴────────────┴─────────┘
confidence: 0.101
```

### Fruits

```sh
node lm.js fruits.yml -i 20
┌─────────┬──────────────┬────────┬─────────┐
│ (index) │ option       │ picked │ percent │
├─────────┼──────────────┼────────┼─────────┤
│ 0       │ 'Banana'     │ 13     │ 65      │
│ 1       │ 'Strawberry' │ 5      │ 25      │
│ 2       │ 'Pineapple'  │ 1      │ 5       │
│ 3       │ 'Peach'      │ 1      │ 5       │
│ 4       │ 'Apple'      │ 0      │ 0       │
│ 5       │ 'Orange'     │ 0      │ 0       │
│ 6       │ 'Grape'      │ 0      │ 0       │
│ 7       │ 'Watermelon' │ 0      │ 0       │
│ 8       │ 'Melon'      │ 0      │ 0       │
│ 9       │ 'Pear'       │ 0      │ 0       │
└─────────┴──────────────┴────────┴─────────┘
```

```sh
node decision.js fruits.yml
┌─────────┬──────────────┬─────────┐
│ (index) │ option       │ percent │
├─────────┼──────────────┼─────────┤
│ 0       │ 'Watermelon' │ 12.2    │
│ 1       │ 'Pineapple'  │ 11.5    │
│ 2       │ 'Banana'     │ 11.2    │
│ 3       │ 'Orange'     │ 11      │
│ 4       │ 'Strawberry' │ 10.9    │
│ 5       │ 'Pear'       │ 10.7    │
│ 6       │ 'Peach'      │ 9.8     │
│ 7       │ 'Melon'      │ 8.5     │
│ 8       │ 'Apple'      │ 7.4     │
│ 9       │ 'Grape'      │ 6.7     │
└─────────┴──────────────┴─────────┘
confidence: 0.024
```

### Musical instruments

```sh
node lm.js instruments.yml
┌─────────┬─────────────┬────────┬─────────┐
│ (index) │ option      │ picked │ percent │
├─────────┼─────────────┼────────┼─────────┤
│ 0       │ 'Cello'     │ 41     │ 82      │
│ 1       │ 'Saxophone' │ 6      │ 12      │
│ 2       │ 'Harp'      │ 2      │ 4       │
│ 3       │ 'Clarinet'  │ 1      │ 2       │
│ 4       │ 'Piano'     │ 0      │ 0       │
│ 5       │ 'Guitar'    │ 0      │ 0       │
│ 6       │ 'Violin'    │ 0      │ 0       │
│ 7       │ 'Drums'     │ 0      │ 0       │
│ 8       │ 'Flute'     │ 0      │ 0       │
│ 9       │ 'Trumpet'   │ 0      │ 0       │
└─────────┴─────────────┴────────┴─────────┘
```

```sh
node decision.js instruments.yml
┌─────────┬─────────────┬─────────┐
│ (index) │ option      │ percent │
├─────────┼─────────────┼─────────┤
│ 0       │ 'Violin'    │ 36.8    │
│ 1       │ 'Flute'     │ 11.4    │
│ 2       │ 'Guitar'    │ 10.4    │
│ 3       │ 'Piano'     │ 9.6     │
│ 4       │ 'Cello'     │ 7.4     │
│ 5       │ 'Harp'      │ 6.9     │
│ 6       │ 'Clarinet'  │ 6       │
│ 7       │ 'Drums'     │ 4.2     │
│ 8       │ 'Saxophone' │ 4       │
│ 9       │ 'Trumpet'   │ 3.3     │
└─────────┴─────────────┴─────────┘
confidence: 0.298
```

### Planets

```sh
node lm.js planets.yml -i 20
┌─────────┬───────────┬────────┬─────────┐
│ (index) │ option    │ picked │ percent │
├─────────┼───────────┼────────┼─────────┤
│ 0       │ 'Saturn'  │ 9      │ 45      │
│ 1       │ 'Jupiter' │ 8      │ 40      │
│ 2       │ 'Mars'    │ 3      │ 15      │
│ 3       │ 'Mercury' │ 0      │ 0       │
│ 4       │ 'Venus'   │ 0      │ 0       │
│ 5       │ 'Earth'   │ 0      │ 0       │
│ 6       │ 'Uranus'  │ 0      │ 0       │
│ 7       │ 'Neptune' │ 0      │ 0       │
└─────────┴───────────┴────────┴─────────┘
```

```sh
node decision.js planets.yml
┌─────────┬───────────┬─────────┐
│ (index) │ option    │ percent │
├─────────┼───────────┼─────────┤
│ 0       │ 'Uranus'  │ 68.2    │
│ 1       │ 'Jupiter' │ 11.3    │
│ 2       │ 'Neptune' │ 6.7     │
│ 3       │ 'Mars'    │ 6.1     │
│ 4       │ 'Saturn'  │ 2.2     │
│ 5       │ 'Venus'   │ 2.1     │
│ 6       │ 'Mercury' │ 1.7     │
│ 7       │ 'Earth'   │ 1.7     │
└─────────┴───────────┴─────────┘
confidence: 0.637
```

### Pizza toppings

```sh
node lm.js pizza-toppings.yml
┌─────────┬───────────────┬────────┬─────────┐
│ (index) │ option        │ picked │ percent │
├─────────┼───────────────┼────────┼─────────┤
│ 0       │ 'Mushroom'    │ 18     │ 60      │
│ 1       │ 'Pineapple'   │ 6      │ 20      │
│ 2       │ 'Pepperoni'   │ 4      │ 13.3    │
│ 3       │ 'Sausage'     │ 1      │ 3.3     │
│ 4       │ 'Spinach'     │ 1      │ 3.3     │
│ 5       │ 'Onion'       │ 0      │ 0       │
│ 6       │ 'Bacon'       │ 0      │ 0       │
│ 7       │ 'Ham'         │ 0      │ 0       │
│ 8       │ 'Olives'      │ 0      │ 0       │
│ 9       │ 'Bell pepper' │ 0      │ 0       │
└─────────┴───────────────┴────────┴─────────┘
```

```sh
node decision.js pizza-toppings.yml
┌─────────┬───────────────┬─────────┐
│ (index) │ option        │ percent │
├─────────┼───────────────┼─────────┤
│ 0       │ 'Bacon'       │ 25.5    │
│ 1       │ 'Ham'         │ 18.2    │
│ 2       │ 'Pineapple'   │ 17.9    │
│ 3       │ 'Pepperoni'   │ 10.3    │
│ 4       │ 'Olives'      │ 8.3     │
│ 5       │ 'Mushroom'    │ 5.6     │
│ 6       │ 'Sausage'     │ 5.6     │
│ 7       │ 'Spinach'     │ 3.4     │
│ 8       │ 'Bell pepper' │ 3.2     │
│ 9       │ 'Onion'       │ 2.1     │
└─────────┴───────────────┴─────────┘
confidence: 0.172
```

### Months

```sh
node lm.js months.yml
┌─────────┬─────────────┬────────┬─────────┐
│ (index) │ option      │ picked │ percent │
├─────────┼─────────────┼────────┼─────────┤
│ 0       │ 'October'   │ 17     │ 47.2    │
│ 1       │ 'August'    │ 9      │ 25      │
│ 2       │ 'July'      │ 7      │ 19.4    │
│ 3       │ 'September' │ 2      │ 5.6     │
│ 4       │ 'May'       │ 1      │ 2.8     │
│ 5       │ 'January'   │ 0      │ 0       │
│ 6       │ 'February'  │ 0      │ 0       │
│ 7       │ 'March'     │ 0      │ 0       │
│ 8       │ 'April'     │ 0      │ 0       │
│ 9       │ 'June'      │ 0      │ 0       │
│ 10      │ 'November'  │ 0      │ 0       │
│ 11      │ 'December'  │ 0      │ 0       │
└─────────┴─────────────┴────────┴─────────┘
```

```sh
node decision.js months.yml
┌─────────┬─────────────┬─────────┐
│ (index) │ option      │ percent │
├─────────┼─────────────┼─────────┤
│ 0       │ 'August'    │ 42.7    │
│ 1       │ 'April'     │ 16.6    │
│ 2       │ 'July'      │ 11.1    │
│ 3       │ 'June'      │ 11      │
│ 4       │ 'November'  │ 11      │
│ 5       │ 'May'       │ 3.2     │
│ 6       │ 'September' │ 1.7     │
│ 7       │ 'October'   │ 1.7     │
│ 8       │ 'March'     │ 0.8     │
│ 9       │ 'February'  │ 0.2     │
│ 10      │ 'January'   │ 0       │
│ 11      │ 'December'  │ 0       │
└─────────┴─────────────┴─────────┘
confidence: 0.375
```

### Nonsense words

```sh
node lm.js nonsense-words.yml
┌─────────┬─────────┬────────┬─────────┐
│ (index) │ option  │ picked │ percent │
├─────────┼─────────┼────────┼─────────┤
│ 0       │ 'Zib'   │ 15     │ 62.5    │
│ 1       │ 'Plarn' │ 6      │ 25      │
│ 2       │ 'Quast' │ 3      │ 12.5    │
│ 3       │ 'Vok'   │ 0      │ 0       │
│ 4       │ 'Drox'  │ 0      │ 0       │
│ 5       │ 'Miv'   │ 0      │ 0       │
│ 6       │ 'Torp'  │ 0      │ 0       │
│ 7       │ 'Nek'   │ 0      │ 0       │
└─────────┴─────────┴────────┴─────────┘
```

```sh
node decision.js nonsense-words.yml
┌─────────┬─────────┬─────────┐
│ (index) │ option  │ percent │
├─────────┼─────────┼─────────┤
│ 0       │ 'Zib'   │ 24.8    │
│ 1       │ 'Vok'   │ 16.3    │
│ 2       │ 'Quast' │ 11.5    │
│ 3       │ 'Nek'   │ 11.2    │
│ 4       │ 'Plarn' │ 10      │
│ 5       │ 'Miv'   │ 9.3     │
│ 6       │ 'Drox'  │ 8.6     │
│ 7       │ 'Torp'  │ 8.2     │
└─────────┴─────────┴─────────┘
confidence: 0.140
```

### Days

```sh
node lm.js days.yml
┌─────────┬─────────────┬────────┬─────────┐
│ (index) │ option      │ picked │ percent │
├─────────┼─────────────┼────────┼─────────┤
│ 0       │ 'Wednesday' │ 19     │ 90.5    │
│ 1       │ 'Thursday'  │ 2      │ 9.5     │
│ 2       │ 'Monday'    │ 0      │ 0       │
│ 3       │ 'Tuesday'   │ 0      │ 0       │
│ 4       │ 'Friday'    │ 0      │ 0       │
│ 5       │ 'Saturday'  │ 0      │ 0       │
│ 6       │ 'Sunday'    │ 0      │ 0       │
└─────────┴─────────────┴────────┴─────────┘
```

```sh
node decision.js days.yml
┌─────────┬─────────────┬─────────┐
│ (index) │ option      │ percent │
├─────────┼─────────────┼─────────┤
│ 0       │ 'Sunday'    │ 18.6    │
│ 1       │ 'Monday'    │ 16.9    │
│ 2       │ 'Tuesday'   │ 15.6    │
│ 3       │ 'Saturday'  │ 15.5    │
│ 4       │ 'Wednesday' │ 13.6    │
│ 5       │ 'Friday'    │ 10.1    │
│ 6       │ 'Thursday'  │ 9.7     │
└─────────┴─────────────┴─────────┘
confidence: 0.050
```

### Letters

```sh
node lm.js letters.yml
┌─────────┬────────┬────────┬─────────┐
│ (index) │ option │ picked │ percent │
├─────────┼────────┼────────┼─────────┤
│ 0       │ 'R'    │ 43     │ 55.1    │
│ 1       │ 'M'    │ 20     │ 25.6    │
│ 2       │ 'S'    │ 8      │ 10.3    │
│ 3       │ 'Q'    │ 4      │ 5.1     │
│ 4       │ 'H'    │ 1      │ 1.3     │
│ 5       │ 'J'    │ 1      │ 1.3     │
│ 6       │ 'K'    │ 1      │ 1.3     │
│ 7       │ 'A'    │ 0      │ 0       │
│ 8       │ 'B'    │ 0      │ 0       │
│ 9       │ 'C'    │ 0      │ 0       │
│ 10      │ 'D'    │ 0      │ 0       │
│ 11      │ 'E'    │ 0      │ 0       │
│ 12      │ 'F'    │ 0      │ 0       │
│ 13      │ 'G'    │ 0      │ 0       │
│ 14      │ 'I'    │ 0      │ 0       │
│ 15      │ 'L'    │ 0      │ 0       │
│ 16      │ 'N'    │ 0      │ 0       │
│ 17      │ 'O'    │ 0      │ 0       │
│ 18      │ 'P'    │ 0      │ 0       │
│ 19      │ 'T'    │ 0      │ 0       │
│ 20      │ 'U'    │ 0      │ 0       │
│ 21      │ 'V'    │ 0      │ 0       │
│ 22      │ 'W'    │ 0      │ 0       │
│ 23      │ 'X'    │ 0      │ 0       │
│ 24      │ 'Y'    │ 0      │ 0       │
│ 25      │ 'Z'    │ 0      │ 0       │
└─────────┴────────┴────────┴─────────┘
```

```sh
node decision.js letters.yml
┌─────────┬────────┬─────────┐
│ (index) │ option │ percent │
├─────────┼────────┼─────────┤
│ 0       │ 'G'    │ 34.1    │
│ 1       │ 'Y'    │ 24.4    │
│ 2       │ 'J'    │ 14.3    │
│ 3       │ 'Q'    │ 4.9     │
│ 4       │ 'K'    │ 3.8     │
│ 5       │ 'Z'    │ 2.9     │
│ 6       │ 'U'    │ 2.3     │
│ 7       │ 'V'    │ 2.3     │
│ 8       │ 'N'    │ 2       │
│ 9       │ 'M'    │ 1.7     │
│ 10      │ 'F'    │ 1.3     │
│ 11      │ 'R'    │ 1.3     │
│ 12      │ 'O'    │ 1.2     │
│ 13      │ 'L'    │ 0.7     │
│ 14      │ 'T'    │ 0.7     │
│ 15      │ 'I'    │ 0.6     │
│ 16      │ 'S'    │ 0.5     │
│ 17      │ 'P'    │ 0.3     │
│ 18      │ 'C'    │ 0.2     │
│ 19      │ 'E'    │ 0.2     │
│ 20      │ 'H'    │ 0.2     │
│ 21      │ 'A'    │ 0.1     │
│ 22      │ 'B'    │ 0       │
│ 23      │ 'D'    │ 0       │
│ 24      │ 'W'    │ 0       │
│ 25      │ 'X'    │ 0       │
└─────────┴────────┴─────────┘
confidence: 0.314
```
