# Welcome to the Sudoku Solver!

## Running

1. Make sure you are in the project repository
2. Run `npm start-api` in one window to boot up flask, then run `npm start` in another window to boot up the react project
3. Go to https://localhost:3000 to see the page!

## General Information

1. If the inputted board has more than one solution when calling `solve()`, one of the solutions will be shown on the screen, but it is still an **invalid** board.
2. Checking your board checks to see if the current board is a valid sudoku board, following the rules of rows, columns, and 3x3 boxes.
