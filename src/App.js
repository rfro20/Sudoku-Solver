import React, {useState, useEffect} from 'react';
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
    
  const [board, setBoard] = useState(initial);

  function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

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

  function solve() {
      fetch('/solve', {
      method : 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body : JSON.stringify({"board": board})
    }).then((response) => response.json()).then((resp) => {
      console.log(resp);
      if(resp["solved"] === true) {
        console.log("solved!");
        console.log(resp["board"]);
        setBoard(resp["board"]);
      } else {
        if (resp["multiple_sols"] === true) {
          console.log("multiple solutions...");
        }
        console.log("not solved!");
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
        <div className="solveDiv">
          <button className="clearButton" onClick={clear}>Reset</button>
          <button className="checkButton" onClick={() => {
              check().then((valid) => {
                if(valid === false) {
                  alert("This is not a valid board.");
                } else {
                  alert("this is a valid board.");
                }
              });
            }
          }>Check</button>
          <button className="solveButton" onClick={solve}>Solve</button>
        </div>
      </header>
    </div>
  );
}

export default App;
