# Results

Observed model bias when asking the same multiple-choice question repeatedly.

| Setting  | Value                                             |
| -------- | ------------------------------------------------- |
| Model    | Gemma 4 12B (`gemma-4-12B-it`)                    |
| Thinking | Default                                           |
| Sampling | Default                                           |
| Hardware | Mac Mini M4                                       |
| Runtime  | llama.cpp (`llama-server`, OpenAI-compatible API) |
| Client   | `node index.js <question-set> [-i <iterations>]`  |

Numbers below are copied verbatim from the runs. Each row counts how many of the
iterations picked that answer.
Every loop ran fresh, meaning the model did not see its historical performance.

## Numbers

```sh
node index.js numbers.yml -i 16
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

## Coin-flip

```sh
node index.js -i 13 coin-flip.yml
┌─────────┬─────────┬────────┬─────────┐
│ (index) │ option  │ picked │ percent │
├─────────┼─────────┼────────┼─────────┤
│ 0       │ 'Heads' │ 12     │ 92.3    │
│ 1       │ 'Tails' │ 1      │ 7.7     │
└─────────┴─────────┴────────┴─────────┘
```

## Colors

```sh
node index.js colors.yml
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

## Animals

```sh
node index.js animals.yml -i 30
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

## Fruits

```sh
node index.js fruits.yml -i 20
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

## Musical instruments

```sh
node index.js instruments.yml
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

## Planets

```sh
node index.js planets.yml -i 20
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

## Pizza toppings

```sh
node index.js pizza-toppings.yml
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

## Months

```sh
node index.js months.yml
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

## Nonsense words

```sh
node index.js nonsense-words.yml
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

## Days

```sh
node index.js days.yml
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

## Letters

```sh
node index.js letters.yml
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
