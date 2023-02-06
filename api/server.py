from solver import is_valid_sudoku, attempt_solve
from flask import Flask, request
import random

app = Flask(__name__)

@app.route('/check', methods=['POST'])
def check_sudoku():
    board = request.get_json()['board']
    return {"status": "200", "valid": is_valid_sudoku(board)}


@app.route('/solve', methods=['POST'])
def solve_sudoku():
    board = request.get_json()['board']

    possible, num_sols, ans = attempt_solve(board)

    if not possible:
        if num_sols > 1:
            print("There exist multiple solutions to this board. Providing one of them now.")
            ans[0] = random.choice(ans)
        else:
            print("This board is not solvable.")
    return {"status": "200", "solved" : possible, "board": ans[0] if len(ans) > 0 else board, "multiple_sols": num_sols > 1}

