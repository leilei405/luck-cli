const commander = require("commander");
const { program } = commander;
const packageJson = require("../package.json");

module.exports = function (argv) {
  program
    .name(Object.keys(packageJson.bin)[0])
    .usage("<command> [options]")
    .version(packageJson.version)
    .option("-d, --debug", "是否开启调试模式", false);

  // 注册命令
  program
    .command("init [name]")
    .description("初始化一个项目")
    .option("-f, --force", "是否强制初始化项目", false)
    .action((project, otherArgs) => {
      // 执行 init 之后的逻辑
      console.log(project, otherArgs);
    });

  // 控制台输出
  program.parse(process.argv);
};
