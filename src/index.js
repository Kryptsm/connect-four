import React from 'react';
import ReactDOM from 'react-dom';
import { unstable_concurrentAct } from 'react-dom/cjs/react-dom-test-utils.production.min';
import './index.css';
import $ from 'jquery';

var globalFile = "";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function WinnerSquare(props) {
  return (
    <button className="winners">
    </button>
  );
}

class Board extends React.Component {
  renderSquare(y, x) {
    if(this.props.squares[y][x] !== '!!!'){
      return (
        <Square
          value={this.props.squares[y][x]}
          onClick={() => this.props.onClick(y, x)}
        />
      );
    } else {
      return (
        <WinnerSquare/>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
          {this.renderSquare(0, 3)}
          {this.renderSquare(0, 4)}
          {this.renderSquare(0, 5)}
          {this.renderSquare(0, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
          {this.renderSquare(1, 3)}
          {this.renderSquare(1, 4)}
          {this.renderSquare(1, 5)}
          {this.renderSquare(1, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
          {this.renderSquare(2, 3)}
          {this.renderSquare(2, 4)}
          {this.renderSquare(2, 5)}
          {this.renderSquare(2, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(3, 0)}
          {this.renderSquare(3, 1)}
          {this.renderSquare(3, 2)}
          {this.renderSquare(3, 3)}
          {this.renderSquare(3, 4)}
          {this.renderSquare(3, 5)}
          {this.renderSquare(3, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(4, 0)}
          {this.renderSquare(4, 1)}
          {this.renderSquare(4, 2)}
          {this.renderSquare(4, 3)}
          {this.renderSquare(4, 4)}
          {this.renderSquare(4, 5)}
          {this.renderSquare(4, 6)}
        </div>
        <div className="board-row">
          {this.renderSquare(5, 0)}
          {this.renderSquare(5, 1)}
          {this.renderSquare(5, 2)}
          {this.renderSquare(5, 3)}
          {this.renderSquare(5, 4)}
          {this.renderSquare(5, 5)}
          {this.renderSquare(5, 6)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var arrayInitial = new Array(6);

    for(var i = 0; i < arrayInitial.length; i++)
      arrayInitial[i] = new Array(7).fill(null);

    this.state = {
      squares: arrayInitial,
      squaresEmpty: arrayInitial,
      stepNumber: 0,
      xIsNext: true,
      lastX: -1,
      lastY: -1,
    };
  }
  

  handleClick(y, x) {
    const squares = this.state.squares.slice();
    var bottomY = findBottom(x, squares);

    if (calculateWinner(squares, x, bottomY) || squares[y][x]) {
      return;
    }

    squares[bottomY][x] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      stepNumber: this.state.stepNumber + 1,
      xIsNext: !this.state.xIsNext,
      lastX: x,
      lastY: bottomY,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  
  render() {
    const winner = calculateWinner(this.state.squares, this.state.lastX, this.state.lastY);

    let status;
    let winnerFound = false;

    if (winner) {
      status = 'Winner: ' + winner;
      winnerFound = true;
    } else if (this.state.stepNumber === 42){
      status = 'Tie game!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(y, x) => {if(!winnerFound) this.handleClick(y, x)}}
          />
        </div>
        <div className="game-info">
          <div style={{margin: 5 + 'px'}}>{status}</div>
          <div style={{margin: 5 + 'px'}}>Step number: {this.state.stepNumber}</div>
          <button style={{margin: 5 + 'px'}} onClick={() => window.location.reload()}>Reset game!</button>
          <br/>
          <button style={{margin: 5 + 'px'}} onClick={() => executeCode()}>Click me.</button>
          <br/>
          <input style={{margin: 5 + 'px'}} type="file" id="file" accept=".py"></input>
          <br/>
          <button style={{margin: 5 + 'px'}} onClick={() => executeCode()}>Load File</button>
          <br/>
          <button style={{margin: 5 + 'px'}} onClick={() => readFile()}>Read File</button>
        </div>
      </div>
    );
  }
}

function executeCode() {
  var file = document.getElementById("file").files[0],
    read = new FileReader();

  read.readAsBinaryString(file);

  var contents = read;
  read.onloadend = function () {
    contents = read.result;
    globalFile = contents;
  }
}

function readFile() {
  console.log(globalFile);
}

function calculateWinner(squares, x, y) {
  if((x === -1 || y === -1) || (squares[y][x] == null))
    return null
  else{
    var value = squares[y][x];

    var inARowDown = 0;
    var keepDown = true;

    var inARowUp = 0;
    var keepUp = true;

    var inARowLeft = 0;
    var keepLeft = true;

    var inARowRight = 0;
    var keepRight = true;

    var inARowNW = 0;
    var keepNW = true;

    var inARowNE = 0;
    var keepNE = true;

    var inARowSW = 0;
    var keepSW = true;

    var inARowSE = 0;
    var keepSE = true;

    var horizontalStorage = [x];
    var verticalStorage = [y];
    var diagonalTopBottomStorage = [[x, y]];
    var diagonalBottomTopStorage = [[x, y]];

    //counts up the amount of tiles in a row in each direction.
    //If it finds one that doesnt match in a direction, it stops counting
    //In that direction
    for(var change = 1; change <= 3; change++){
      if(((y + change) < 6) && squares[y + change][x] === value && keepDown) {
        verticalStorage.push(y + change);
        inARowDown++;
      } else
        keepDown = false;

      if(((y - change) > -1) && squares[y - change][x] === value && keepUp) {
        verticalStorage.push(y - change);
        inARowUp++;
      } else
        keepUp = false;

      if(((x - change) > -1) && squares[y][x - change] === value && keepLeft) {
        horizontalStorage.push(x - change);
        inARowLeft++;
      } else 
        keepLeft = false;

      if(((x + change) < 7) && squares[y][x + change] === value && keepRight) {
        horizontalStorage.push(x + change);
        inARowRight++;
      } else
        keepRight = false;

      if(((y - change) > -1) && ((x - change) > -1) && squares[y - change][x - change] === value && keepNW) {
        diagonalTopBottomStorage.push([x - change, y - change])
        inARowNW++;
      } else
        keepNW = false;

      if(((y - change) > -1) && ((x + change) < 7) && squares[y - change][x + change] === value && keepNE) {
        diagonalBottomTopStorage.push([x + change, y - change]);
        inARowNE++;
      } else
        keepNE = false;

      if(((y + change) < 6) && ((x - change) > -1) && squares[y + change][x - change] === value && keepSW) {
        diagonalBottomTopStorage.push([x - change, y + change]);
        inARowSW++;
      } else
        keepSW = false;

      if(((y + change) < 6) && ((x + change) < 7) && squares[y + change][x + change] === value && keepSE) {
        diagonalTopBottomStorage.push([x + change, y + change])
        inARowSE++;
      } else
        keepSE = false;
    }
    //If any of the directions (X or Y) have 3 or more tiles in a row (which adds
    // up to 4) return that tile so that we can know they won!
    if((inARowUp + inARowDown) >= 3){
      console.log(verticalStorage);
      for(var p = 0; p < 4; p++){
        squares[verticalStorage[p]][x] = '!!!';
      }

      return value
    } else if((inARowLeft + inARowRight) >= 3){
      console.log(horizontalStorage);

      for(var n = 0; n < 4; n++){
        squares[y][horizontalStorage[n]] = '!!!';
      }

      return value
    }
    //if any of the diagonal directions (Southeast and northwest together
    // southwest and northeast together) have 3 tiles together (plus the first so 4)
    //return that square type so we know they won
    if((inARowNW + inARowSE) >= 3){
      console.log(diagonalTopBottomStorage);

      for(var f = 0; f < 4; f++){
        squares[diagonalTopBottomStorage[f][1]][diagonalTopBottomStorage[f][0]] = '!!!';
      }

      return value
    } else if((inARowNE + inARowSW) >= 3){
      console.log(diagonalBottomTopStorage);

      for(var e = 0; e < 4; e++){
        squares[diagonalBottomTopStorage[e][1]][diagonalBottomTopStorage[e][0]] = '!!!';
      }

      return value
    }

  }

  return null
}

function findBottom(x, squares) {
  var bottomValue = 0;
  while(bottomValue < 6 && squares[bottomValue][x] == null)
    bottomValue++;

  return bottomValue - 1;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);