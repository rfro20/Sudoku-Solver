def is_valid_sudoku(board):
    n = len(board)
    rows = [0 for _ in range(n)]
    cols = [0 for _ in range(n)]
    boxes = [0 for _ in range(n)]
    
    for row in range(n):
        for col in range(n):
            if board[row][col] == 0:
                continue
            curr_num = board[row][col] - 1
            pos = 1 << curr_num
            
            if (rows[row] & pos) != 0:
                return False
            rows[row] |= pos
            
            if (cols[col] & pos) != 0:
                return False
            cols[col] |= pos
            
            if (boxes[row // 3 * 3 + col // 3] & pos) != 0:
                return False
            boxes[row // 3 * 3 + col // 3] |= pos
    return True


def attempt_solve(board):
    n = len(board)
    rows = [set() for _ in range(n)]
    cols = [set() for _ in range(n)]
    boxes = [set() for _ in range(n)]
    
    def box_index(row, col):
        return row // 3 * 3 + col // 3
    
    def is_valid(row, col, number):
        return number not in rows[row] and number not in cols[col] and number not in boxes[box_index(row, col)]
    
    # First, pre-process board and put numbers in correct locations
    for row in range(n):
        for col in range(n):
            curr = board[row][col]
            if curr != 0:
                if curr in rows[row] or curr in cols[col] or curr in boxes[box_index(row, col)]:
                    return False
                rows[row].add(curr)
                cols[col].add(curr)
                boxes[box_index(row, col)].add(curr)

    sols = 0    
    ans = []
    # Now, backtrack
    def backtrack(row, col):
        nonlocal sols
        if row == n:
            sols += 1
            ans.append([[num for num in row] for row in board])
            return
        
        if col == n:
            backtrack(row+1, 0)
            return
        
        if board[row][col] == 0:
            for i in range(1,10):
                if is_valid(row, col, i):
                    board[row][col] = i
                    rows[row].add(i)
                    cols[col].add(i)
                    boxes[box_index(row,col)].add(i)
                    backtrack(row, col+1)
                    if sols > 1:
                        return
                    board[row][col] = 0
                    rows[row].remove(i)
                    cols[col].remove(i)
                    boxes[box_index(row, col)].remove(i)
        else:
            backtrack(row, col+1)
        
    backtrack(0, 0)
    print(ans)
    return sols == 1, sols, ans