import { pathExistsSync } from "path-exists";
import path from "node:path";
import fse from "fs-extra";
import ora from "ora";
import ejs from "ejs";
import pkg from "glob";
import { log, makeInput, makeList } from "@lucky.com/utils";

const { glob } = pkg;

// 1. 获取缓存目录
const getCacheFilePath = (targetPath, template) => {
  return path.resolve(targetPath, "node_modules", template.npmName, "template");
};

// 获取插件
const getPluginFilePath = (targetPath, template) => {
  return path.resolve(
    targetPath,
    "node_modules",
    template.npmName,
    "plugins",
    "index.js"
  );
};

// 2. 拷贝文件
const copyFile = async (targetPath, tempalte, installDir) => {
  const originFile = getCacheFilePath(targetPath, tempalte);
  const fileList = await fse.readdirSync(originFile);
  const spinner = ora("正在拷贝模版...").start();
  fileList.map((file) => {
    fse.copySync(`${originFile}/${file}`, `${installDir}/${file}`);
  });
  spinner.stop();
  log.success("模版拷贝成功");
};

// 2. 渲染文件
const ejsRender = async (targetPath, installDir, tempalte, customName) => {
  log.verbose("installDir", installDir, tempalte);
  const { ignore } = tempalte;
  // 执行插件
  let data = {};
  const pluginsPath = await getPluginFilePath(targetPath, tempalte);
  if (pathExistsSync(pluginsPath)) {
    const pluginsFn = (await import(pluginsPath)).default;
    const api = {
      makeList,
      makeInput,
    };
    data = await pluginsFn(api);
  }

  const ejsData = {
    data: {
      // name: value, // 项目名称
      name: customName, // 项目名称
      ...data,
    },
  };

  glob(
    "**",
    {
      cwd: installDir,
      nodir: true,
      ignore: [...ignore, "**/node_modules/**"],
    },
    (err, files) => {
      // 循环遍历文件路径
      files.forEach((file) => {
        const filePath = path.resolve(installDir, file);
        log.verbose("filePath", filePath);
        ejs.renderFile(filePath, ejsData, (err, result) => {
          if (err) {
            log.error(err);
          } else {
            fse.writeFileSync(filePath, result);
          }
        });
      });
    }
  );
};

// 3. 安装模版 先拿到path 再下载
const installTemplate = async (selectedTemplate, opts) => {
  const { force = false } = opts;
  const { targetPath, template, name } = selectedTemplate;
  // 1. 当前工作目录
  const rootDir = process.cwd();
  // 2. 检查当前目录是否为空
  fse.ensureDirSync(targetPath);
  const installDir = path.resolve(`${rootDir}/${name}`);
  if (pathExistsSync(installDir)) {
    if (!force) {
      log.error("当前目录不为空", "已存在", installDir, "目录，请选择其他目录");
    } else {
      await fse.removeSync(installDir);
      await fse.ensureDirSync(installDir);
    }
  } else {
    await fse.ensureDirSync(installDir);
  }

  // 2. 拷贝文件
  await copyFile(targetPath, template, installDir);

  // 3. 渲染文件 name 自己输入的项目名称
  await ejsRender(targetPath, installDir, template, name);
};

export default installTemplate;
