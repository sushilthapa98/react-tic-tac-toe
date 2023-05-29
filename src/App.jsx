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

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinningLine(squares).length > 0) {
      return;
    }
    onPlay(i);
  }

  const winningLine = calculateWinningLine(squares);
  let status;
  if (winningLine.length > 0) {
    status = 'Winner: ' + squares[winningLine[0]];
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardItems = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  return (
    <>
      <div className="status">{status}</div>
      {boardItems.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((col) => {
            return <Square key={col} highlight={winningLine.includes(col)} value={squares[col]} onSquareClick={() => handleClick(col)} />;
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [indexHistory, setIndexHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAsc, setIsAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(i) {
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextIndexHistory = [...indexHistory.slice(0, currentMove + 1), i];
    setHistory(nextHistory);
    setIndexHistory(nextIndexHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setIsAsc(!isAsc);
  }

  function getPoint(move) {
    const index = indexHistory[move];
    if (index) {
      return `(${Math.floor(index / 3)}, ${index % 3})`;
    }
    return '';
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        Sort: <button onClick={sortMoves}>{isAsc ? 'Desc' : 'Asc'}</button>
        <div>{moves}</div>
      </div>
    </div>
  );
}
