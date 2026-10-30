# Results

Observed model bias when asking the same multiple-choice question repeatedly, for
a language model and a decision model side by side.

Every test appears twice: the language-model block first (how often each answer
was sampled), then the decision-model block (the probability each answer is given).
Both blocks are copied verbatim from the runs, so the `percent` columns are
directly comparable.

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

## Numbers

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

## Coin-flip

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

## Colors

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

## Animals

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

## Fruits

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

## Musical instruments

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

## Planets

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

## Pizza toppings

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

## Months

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

## Nonsense words

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

## Days

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

## Letters

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
