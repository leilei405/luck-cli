import path from "path";
// import path from "node:path";
import { program } from "commander";
import createInitCommand from "@lucky.com/init";
import { log, isDebug } from "@lucky.com/utils";
import { dirname } from "dirname-filename-esm";
import semver from "semver";
import chalk from "chalk";
import fse from "fs-extra"; // 读取 package.json
import { LOWEST_NODE_VERSION } from "./constants.js";

// 读取 package.json
let packageJson;
const __dirname = dirname(import.meta);
const packagePath = path.resolve(__dirname, "../package.json");
packageJson = fse.readJSONSync(packagePath);

// 启动 & 初始化 & 安装依赖时的准备工作
const preAction = () => {
  checkNodeVersion();
};

// 检查 node 版本
const checkNodeVersion = () => {
  log.info("当前正在使用的 Node.js 版本", process.version);
  const currentVersion = process.version; // 当前Node.js版本
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION)) {
    throw new Error(
      `lucky-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`
    );
  }
};

// 捕获我们自己抛出的异常
process.on("uncaughtException", (err) => {
  if (isDebug()) {
    console.log(err);
  } else {
    console.log(err.message);
  }
  process.exit(1);
});

export default function (argv) {
  log.info("当前安装 lucky-cli 包的版本", packageJson.version);
  program
    .name(Object.keys(packageJson.bin)[0])
    .usage("<command> [options]")
    .version(packageJson.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  createInitCommand(program);

  // 控制台输出
  program.parse(process.argv);
}
