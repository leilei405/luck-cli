import path from "path";
import { program } from "commander";
import { dirname } from "dirname-filename-esm";
import semver from "semver";
import fse from "fs-extra"; // 读取 package.json
import { log } from "@lucky.com/utils";

import { LOWEST_NODE_VERSION } from "./constants.js";

// 读取 package.json
let packageJson;
const __dirname = dirname(import.meta);
const packagePath = path.resolve(__dirname, "../package.json");
packageJson = fse.readJSONSync(packagePath);

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

// 启动 & 初始化 & 安装依赖时的准备工作
const preAction = () => {
  checkNodeVersion();
};

export default function createCli(argv) {
  console.log("当前安装的 lucky-cli 包的版本", packageJson.version);
  program
    .name(Object.keys(packageJson.bin)[0])
    .usage("<command> [options]")
    .version(packageJson.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .hook("preAction", preAction);

  // 监听 debug 命令
  program.on("option:debug", () => {
    const options = program.opts().debug;
    if (options) {
      log.verbose("debug", "开启 debug 调试模式");
    } else {
      log.verbose("debug", "关闭调试模式");
    }
  });

  // 监听未知命令
  program.on("command:*", (obj) => {
    log.error("未知的命令：" + obj[0]);
  });
  return program;
}
