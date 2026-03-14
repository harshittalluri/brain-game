export function generateSudoku(difficulty = "medium") {
  const difficultyMap = { easy: 35, medium: 45, hard: 55 };
  const removeCount = difficultyMap[difficulty] || 45;

  let board = generateFullBoard();
  return removeCells(board, removeCount);
}

function generateFullBoard() {
  let board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board);
  return board;
}

function isValid(board, r, c, num) {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === num || board[i][c] === num) return false;
  }

  let sr = r - (r % 3);
  let sc = c - (c % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[sr + i][sc + j] === num) return false;
    }
  }

  return true;
}

export function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;

            if (solveSudoku(board)) return board;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return board;
}

function removeCells(board, count) {
  let puzzle = board.map((r) => [...r]);
  let removed = 0;

  while (removed < count) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);

    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }

  return puzzle;
}