import React from 'react';
import './App.css';

var clickingCount = 0;

function Square(props) {
  return (
    <button className="square"
      style={{"backgroundColor": props.bgColor}}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      bgColor={this.props.bgColor}
      onClick={() => this.props.onClick(i)}
      />
  }

  
  render() {
    const numArray = Array(9).fill(null);

    for (var i=0; i<numArray.length; ++i) {
      numArray[i] = i;
    }

    return (
      <div>
        <div className="board-row">
          <ul>
            {/* v-for */}
            {numArray.map((value, index) => {
              return <li key={index}>{this.renderSquare(value)}</li>
            })}
          </ul>
          {/* {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)} */}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        posi: Array(2).fill(null) // Let posi be an array to store number of row and col
      }],
      stepNumber: 0,
      xIsNext: true,
      clickingCount: 0,
      bgColor: "transparent" // Render the background color of squares caused the win
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const posi = current.posi.slice();

    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Record the position
    const row = Math.floor(i / 3) + 1;
    const col = i % 3 + 1;

    posi[0] = row;
    posi[1] = col;

    this.setState({
      history: history.concat([{ squares: squares, posi: posi}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  movesSorting() {
    this.setState({clickingCount: clickingCount += 1});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    var moves = null;

    moves = history.map((step, move) => {
      if (clickingCount % 2 === 0) {
        const moveDesc = move ? 'Go to move #' + move : 'Go to game start';
            const positionDesc = move ? 'row: ' + step.posi[0] + ', column: ' + step.posi[1] : '';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{moveDesc}</button>
                <span style={{ "marginLeft": "10px" }}>{positionDesc}</span>
              </li>
            )  
      } else {
        // Sort in a descending way
        const moveDesc = move !== history.length - 1 ? 'Go to move #' + (history.length - move - 1) : 'Go to game start';
            const positionDesc = move !== history.length - 1 ? 'row: ' + history[history.length - move - 1].posi[0] + ', column: ' + history[history.length - move - 1].posi[1] : '';
            return (
              <li key={move}>
                <button onClick={() => this.jumpTo(history.length - move - 1)}>{moveDesc}</button>
                <span style={{ "marginLeft": "10px" }}>{positionDesc}</span>
              </li>
            )  
      }
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (this.state.stepNumber !== 9)
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      else 
        status = 'Being a draw'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
          bgColor={this.state.bgColor}
          onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
            <div>{ status }</div>
            <button onClick={() => this.movesSorting()}>Moves sorting</button>
            <ol>{ moves }</ol>
        </div>
      </div>
    )
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i=0; i<lines.length; ++i) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Let an array to keep the value
      return squares[a];
    }
  }
  return null;
}

export default Game;
