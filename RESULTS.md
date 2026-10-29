# Results

Observed model bias when asking the same multiple-choice question repeatedly.

| Setting  | Value                                             |
| -------- | ------------------------------------------------- |
| Model    | Gemma 4 12B (`gemma-4-12B-it`)                    |
| Hardware | Mac Mini M4                                       |
| Runtime  | llama.cpp (`llama-server`, OpenAI-compatible API) |
| Client   | `node index.js <question-set> [-i <iterations>]`  |

Numbers below are copied verbatim from the runs. Each row counts how many of the
iterations picked that answer.

## Numbers

```sh
node index.js numbers.yml -i 16
┌─────────┬────────┬────────┬──────────┐
│ (index) │ option │ picked │ percent  │
├─────────┼────────┼────────┼──────────┤
│ 0       │ '1'    │ 0      │ '0.0%'   │
│ 1       │ '2'    │ 0      │ '0.0%'   │
│ 2       │ '3'    │ 0      │ '0.0%'   │
│ 3       │ '4'    │ 0      │ '0.0%'   │
│ 4       │ '5'    │ 0      │ '0.0%'   │
│ 5       │ '6'    │ 0      │ '0.0%'   │
│ 6       │ '7'    │ 16     │ '100.0%' │
│ 7       │ '8'    │ 0      │ '0.0%'   │
│ 8       │ '9'    │ 0      │ '0.0%'   │
│ 9       │ '10'   │ 0      │ '0.0%'   │
└─────────┴────────┴────────┴──────────┘
```

## Coin-flip

```sh
node index.js -i 13 coin-flip.yml
┌─────────┬─────────┬────────┬─────────┐
│ (index) │ option  │ picked │ percent │
├─────────┼─────────┼────────┼─────────┤
│ 0       │ 'Heads' │ 12     │ '92.3%' │
│ 1       │ 'Tails' │ 1      │ '7.7%'  │
└─────────┴─────────┴────────┴─────────┘
```

## Colors

```sh
node index.js colors.yml
┌─────────┬───────────┬────────┬──────────┐
│ (index) │ option    │ picked │ percent  │
├─────────┼───────────┼────────┼──────────┤
│ 0       │ 'White'   │ 0      │ '0.0%'   │
│ 1       │ 'Black'   │ 0      │ '0.0%'   │
│ 2       │ 'Red'     │ 0      │ '0.0%'   │
│ 3       │ 'Blue'    │ 0      │ '0.0%'   │
│ 4       │ 'Green'   │ 0      │ '0.0%'   │
│ 5       │ 'Yellow'  │ 0      │ '0.0%'   │
│ 6       │ 'Orange'  │ 0      │ '0.0%'   │
│ 7       │ 'Purple'  │ 0      │ '0.0%'   │
│ 8       │ 'Pink'    │ 0      │ '0.0%'   │
│ 9       │ 'Brown'   │ 0      │ '0.0%'   │
│ 10      │ 'Gray'    │ 0      │ '0.0%'   │
│ 11      │ 'Cyan'    │ 0      │ '0.0%'   │
│ 12      │ 'Magenta' │ 0      │ '0.0%'   │
│ 13      │ 'Teal'    │ 10     │ '100.0%' │
│ 14      │ 'Indigo'  │ 0      │ '0.0%'   │
│ 15      │ 'Violet'  │ 0      │ '0.0%'   │
│ 16      │ 'Maroon'  │ 0      │ '0.0%'   │
│ 17      │ 'Olive'   │ 0      │ '0.0%'   │
│ 18      │ 'Navy'    │ 0      │ '0.0%'   │
└─────────┴───────────┴────────┴──────────┘
```

## Animals

```sh
node index.js animals.yml -i 30
┌─────────┬────────────┬────────┬─────────┐
│ (index) │ option     │ picked │ percent │
├─────────┼────────────┼────────┼─────────┤
│ 0       │ 'Lion'     │ 0      │ '0.0%'  │
│ 1       │ 'Tiger'    │ 1      │ '3.3%'  │
│ 2       │ 'Bear'     │ 1      │ '3.3%'  │
│ 3       │ 'Elephant' │ 21     │ '70.0%' │
│ 4       │ 'Giraffe'  │ 0      │ '0.0%'  │
│ 5       │ 'Zebra'    │ 0      │ '0.0%'  │
│ 6       │ 'Monkey'   │ 0      │ '0.0%'  │
│ 7       │ 'Panda'    │ 3      │ '10.0%' │
│ 8       │ 'Kangaroo' │ 0      │ '0.0%'  │
│ 9       │ 'Penguin'  │ 4      │ '13.3%' │
└─────────┴────────────┴────────┴─────────┘
```

## Fruits

```sh
node index.js fruits.yml -i 20
┌─────────┬──────────────┬────────┬─────────┐
│ (index) │ option       │ picked │ percent │
├─────────┼──────────────┼────────┼─────────┤
│ 0       │ 'Apple'      │ 0      │ '0.0%'  │
│ 1       │ 'Banana'     │ 13     │ '65.0%' │
│ 2       │ 'Orange'     │ 0      │ '0.0%'  │
│ 3       │ 'Strawberry' │ 5      │ '25.0%' │
│ 4       │ 'Grape'      │ 0      │ '0.0%'  │
│ 5       │ 'Pineapple'  │ 1      │ '5.0%'  │
│ 6       │ 'Watermelon' │ 0      │ '0.0%'  │
│ 7       │ 'Melon'      │ 0      │ '0.0%'  │
│ 8       │ 'Peach'      │ 1      │ '5.0%'  │
│ 9       │ 'Pear'       │ 0      │ '0.0%'  │
└─────────┴──────────────┴────────┴─────────┘
```

## Musical instruments

```sh
node index.js instruments.yml
┌─────────┬─────────────┬────────┬─────────┐
│ (index) │ option      │ picked │ percent │
├─────────┼─────────────┼────────┼─────────┤
│ 0       │ 'Piano'     │ 0      │ '0.0%'  │
│ 1       │ 'Guitar'    │ 0      │ '0.0%'  │
│ 2       │ 'Violin'    │ 0      │ '0.0%'  │
│ 3       │ 'Drums'     │ 0      │ '0.0%'  │
│ 4       │ 'Flute'     │ 0      │ '0.0%'  │
│ 5       │ 'Trumpet'   │ 0      │ '0.0%'  │
│ 6       │ 'Cello'     │ 41     │ '82.0%' │
│ 7       │ 'Saxophone' │ 6      │ '12.0%' │
│ 8       │ 'Clarinet'  │ 1      │ '2.0%'  │
│ 9       │ 'Harp'      │ 2      │ '4.0%'  │
└─────────┴─────────────┴────────┴─────────┘
```
