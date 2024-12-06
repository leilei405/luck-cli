// const chalk = require("chalk");
import chalk from "chalk";

/**
 * @description 简单的API调用
 */
console.log(chalk.red("Hello world!")); // 输出红色的 Hello world!

/**
 * @description 支持rgb色的API调用
 */

console.log(chalk.rgb(255, 0, 0)("Hello world!")); // 输出红色的 Hello world!

/**
 * @description 支持16进制色的API调用
 *
 */
console.log(chalk.hex("#FF0000")("Hello world!")); // 输出红色的 Hello world!

/**
 * @description 组合使用 链式调用
 */
console.log(chalk.red("Hello") + " World" + chalk.underline.bgBlue("!")); // 输出红色的 Hello world!

const error = (...text) => {
  console.log(chalk.bold.hex("#ff0000")(text));
};

const success = (...text) => {
  console.log(chalk.bold.hex("#00ff00")(text));
};

const warning = (...text) => {
  console.log(chalk.bold.hex("#ffff00")(text));
};

error("error");
success("success");
warning("warning");
