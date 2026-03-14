// Validates entire 9×9 Sudoku board

export function validateSudoku(board) {
  const isValidSet = (arr) => {
    let nums = arr.filter(x => x !== "");
    return new Set(nums).size === nums.length;
  };

  // Check rows
  for (let row of board) {
    if (!isValidSet(row)) return false;
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    let col = board.map(row => row[c]);
    if (!isValidSet(col)) return false;
  }

  // Check 3×3 boxes
  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      let box = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          box.push(board[r+i][c+j]);
        }
      }
      if (!isValidSet(box)) return false;
    }
  }

  return true;
}
