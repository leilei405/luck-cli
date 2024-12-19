import path from "node:path";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import ora from "ora";
import { printErrorLog } from "@lucky.com/utils";

// 1. 先获取缓存目录
const getCacheDir = (targetPath) => {
  return path.resolve(targetPath, "node_modules");
};

// 2.
const makeCacheDir = (targetPath) => {
  const cacheDir = getCacheDir(targetPath);
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir);
  }
};

export default function downloadTemplate(selectedTemplate) {
  // 1. 下载模版 先拿到path 再下载
  const { targetPath, template } = selectedTemplate;
  const spinner = ora("正在下载模版...").start();
  try {
    setTimeout(() => {
      spinner.stop();
    }, 2000);
    spinner.succeed("模版下载成功");
  } catch (error) {
    spinner.fail("模版下载失败");
    spinner.stop();
    printErrorLog(error);
  }

  makeCacheDir(targetPath);
}
