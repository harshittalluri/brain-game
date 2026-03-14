export function randomNumber(max = 10) {
  return Math.floor(Math.random() * max);
}

export function generateMathProblem(level = "easy") {
  let maxNum = 10;

  if (level === "medium") maxNum = 25;
  if (level === "hard") maxNum = 50;

  const num1 = randomNumber(maxNum);
  const num2 = randomNumber(maxNum);
  const ops = ["+", "-", "×", "÷"];

  const op = ops[Math.floor(Math.random() * ops.length)];

  let answer;

  switch (op) {
    case "+":
      answer = num1 + num2;
      break;

    case "-":
      answer = num1 - num2;
      break;

    case "×":
      answer = num1 * num2;
      break;

    case "÷":
      answer = num2 !== 0 ? (num1 / num2).toFixed(1) : 0;
      break;

    default:
      answer = 0;
  }

  return { num1, num2, op, answer };
}
