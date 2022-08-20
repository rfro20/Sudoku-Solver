import React, {useState} from 'react';
import './App.css';

function App() {

  const empty = [ [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0],
                  [0,0,0,0,0,0,0,0,0]
                ];

  const initial = [ [5,3,0,0,7,0,0,0,0],
                    [6,0,0,1,9,5,0,0,0],
                    [0,9,8,0,0,0,0,6,0],
                    [8,0,0,0,6,0,0,0,3],
                    [4,0,0,8,0,3,0,0,1],
                    [7,0,0,0,2,0,0,0,6],
                    [0,6,0,0,0,0,2,8,0],
                    [0,0,0,4,1,9,0,0,5],
                    [0,0,0,0,8,0,0,7,9] 
                  ];

  // State Hook for altering sudoku board
  const [board, setBoard] = useState(initial);

  // State Hook for altering displayed text under board
  const [textBox, setTextBox] = useState("");

  function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  // Update board based on user input
  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || 0;
    var grid = deepCopy(board);

    // Input in range 1-9 for value, 0 for empty the cell
    if(val === 0 || (val >= 1 && val <= 9)) { 
      grid[row][col] = val;
    }
    setBoard(grid);
  }

  function clear() {
    setBoard(empty);
  }

  // Hit flask endpoint to check board validity and get results
  function check() {
    return fetch('/check', {
      method : 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body : JSON.stringify({"board": board})
    }).then((response) => response.json()).then((resp) => {
      return Promise.resolve(resp["valid"]);
    });
  }

  // Hit Flask endpoint to solve and get results
  function solve() {
      return fetch('/solve', {
      method : 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body : JSON.stringify({"board": board})
    }).then((response) => response.json()).then((resp) => {
      if(resp["solved"] === true) {
        setBoard(resp["board"]);
        return Promise.resolve([true, null]);
      } else {
        if (resp["multiple_sols"] === true) {
          setBoard(resp["board"]);
          return Promise.resolve([false, true]);

        }
        return Promise.resolve([false, false]);
      }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Sudoku Solver</h3>
        <p>Enter any numbers in below, or just hit solve!</p>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rowIndex) => {
                  return <tr key={rowIndex} className={(row + 1) % 3 === 0 ? "borderRow" : ""}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, colIndex) => {
                      return <td key={rowIndex + colIndex} className={(col + 1) % 3 === 0 ? "borderCol" : ""}>
                        <input onChange={(e) => onInputChange(e, row, col)} value={board[row][col] === 0 ? '' : board[row][col]} key={colIndex} className="cellInput"/>
                      </td>
                    })}
                  </tr>
              })
            }
          </tbody>
        </table>
        <div className="gameTextDiv">
          <p className="gameText">
            {textBox}
          </p>
        </div>
        <div className="solveDiv">
          <button className="clearButton" onClick={() => {
            clear();
            setTextBox("");
          }}>Clear</button>
          <button className="checkButton" onClick={() => {
            check().then((valid) => {
              if(valid === false) {
                setTextBox("This is not a valid board.")
              } else {
                setTextBox("This is a valid board.");
              }
            });
            }
          }>Check</button>
          <button className="solveButton" onClick={() => {
            solve().then((response) => {
              if(response[0] === true) {
                setTextBox("Solved!");
              } else {
                if(response[1] === true) {
                  setTextBox("Multiple solutions exist to this board.");
                } else {
                  setTextBox("This board is either invalid or unsolvable.")
                }
              }
            });
          }}>Solve</button>
        </div>
      </header>
    </div>
  );
}

export default App;
