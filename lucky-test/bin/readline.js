const readline = require("readline");

const rl = readline.createInterface({
  // 输入输出流
  input: process.stdin,
  // 输入输出流
  output: process.stdout,
});

// 输入
rl.question("Enter a number: ", (num) => {
  console.log(num);

  // 输出完之后自动关闭
  rl.close();
});
