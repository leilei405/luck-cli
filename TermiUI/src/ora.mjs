import ora, { oraPromise } from "ora";

// const spinner = ora().start();

// let parent = 10;

// spinner.color = "yellow"; // 加载的图标颜色
// spinner.text = `Loading  ${parent} %`; // 加载的文字
// spinner.prefixText = "Rainbow"; // 加载的前缀文字

// let task = setInterval(() => {
//   parent += 10;
//   spinner.text = `Loading ${parent}%`;
//   if (parent === 100) {
//     clearInterval(task);
//     spinner.stop();
//     spinner.succeed("download success"); // 加载成功的文字
//     return;
//   }
// }, 500);

// 自执行异步任务
(async function name() {
  const promise = new Promise((resolve) => {
    console.log("doing something....");
    setTimeout(() => {
      resolve();
    }, 1000);
  });

  await oraPromise(promise, {
    text: "success download",
    color: "yellow",
    prefixText: "Progress",
    failText: "Failed",
    succeedText: "Succeed",
    spinner: {
      interval: 100,
      //   frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      frames: ["-", "\\", "|", "/", "-"], // 自定义加载的图标
    },
  });
})();
