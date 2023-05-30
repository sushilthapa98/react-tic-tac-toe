import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

function Board({ xIsNext, squares, onPlay, move }) {
  function handleClick(i, row, col) {
    if (squares[i] || calculateWinningLine(squares).length > 0) {
      return;
    }
    onPlay(i, row, col);
  }

  const winningLine = calculateWinningLine(squares);
  let status;
  if (winningLine.length > 0) {
    status = 'Winner: ' + squares[winningLine[0]];
  } else {
    if (move === 9) {
      status = 'Game is Draw!';
    } else {
      status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
    }
  }

  const boardItems = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  return (
    <>
      <div className="status">{status}</div>
      {boardItems.map((rowItems, row) => (
        <div key={row} className="board-row">
          {rowItems.map((i, col) => {
            return <Square key={i} highlight={winningLine.includes(i)} value={squares[i]} onSquareClick={() => handleClick(i, row, col)} />;
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [pointsHistory, setPointsHistory] = useState([[]]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAsc, setIsAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(i, row, column) {
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextPointHistory = [...pointsHistory.slice(0, currentMove + 1), [row, column]];
    setHistory(nextHistory);
    setPointsHistory(nextPointHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setIsAsc(!isAsc);
  }

  function getPoint(move) {
    const point = pointsHistory[move];
    return `(${point.join(', ')})`;
  }

  const moves = history.map((_, move) => {
    let description = '';

    if (move === currentMove) {
      if (move > 0) {
        description = 'You are at ' + getPoint(move);
      } else {
        description = 'You are at Start';
      }
      return <div key={move}>{description}</div>;
    }

    if (move > 0) {
      description = 'Go to move ' + getPoint(move);
    } else {
      description = 'Go to Start';
    }

    return (
      <div key={move}>
        {move + 1} <button onClick={() => jumpTo(move)}>{description}</button>
      </div>
    );
  });

  if (!isAsc) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} move={currentMove} />
      </div>
      <div className="game-info">
        Sort: <button onClick={sortMoves}>{isAsc ? 'Desc' : 'Asc'}</button>
        <div>{moves}</div>
      </div>
    </div>
  );
}
