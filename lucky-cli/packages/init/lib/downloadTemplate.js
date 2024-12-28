import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import ora from "ora";
import { execa } from "execa";
import { log, printErrorLog } from "@lucky.com/utils";

// 1. 先获取缓存目录
const getCacheDir = (targetPath) => {
  return path.resolve(targetPath, "node_modules");
};

// 2. 下载模版
const makeCacheDir = (targetPath) => {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir);
  }
};

// 3. 下载模版 先拿到path 再下载
const downloadAddTemplate = async (targetPath, selectedTemplate) => {
  const { npmName, version } = selectedTemplate;
  const installCommand = "npm";
  const installArgs = ["install", `${npmName}@${version}`];
  const cwd = targetPath;
  log.verbose("installCommand", installArgs);
  log.verbose("cwd", cwd);
  await execa(installCommand, installArgs, {
    cwd,
    stdio: "inherit",
  });
};

export default async function downloadTemplate(selectedTemplate) {
  // 1. 下载模版 先拿到path 再下载
  const { targetPath, template } = selectedTemplate;
  makeCacheDir(targetPath);
  const spinner = ora("正在下载模版...").start();
  try {
    await downloadAddTemplate(targetPath, template);
    spinner.stop();
    spinner.succeed("模版下载成功");
    log.success("模版下载成功");
  } catch (error) {
    spinner.fail("模版下载失败");
    spinner.stop();
    printErrorLog(error);
  }

  makeCacheDir(targetPath);
}
