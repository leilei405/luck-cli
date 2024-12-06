const yargs = require("yargs/yargs");
const dedent = require("dedent");
const { hideBin } = require("yargs/helpers");

const argv = hideBin(process.argv);

const cli = yargs(argv);

cli
  // 使用说明
  .usage("请使用: $0 <命令>/<command> [参数]/[options]")
  .demandCommand(1, "请最少输入一个参数来执行此命令")

  // 如果我们输入的命令不存在，会给我们推荐一些命令，从指令列表中去匹配比较相近的命令 提示出来
  .recommendCommands()

  // 监听错误
  .fail((msg, err, yargs) => {
    console.log(msg, "msg");
    console.log(err, "err");
  })

  // 注册命令
  .command(
    "init [name]",
    "初始化一个项目",
    (yargs) => {
      yargs.option("name", {
        type: "string",
        describe: "项目名称",
        alias: "n",
      });
    },
    (argReset) => {
      console.log(argReset, "argReset1");
    }
  )
  .command({
    command: "list",
    aliases: ["ls", "la", "ll"],
    describe: "查看项目列表",
    builder: (yargs) => {
      yargs.option("name", {
        type: "string",
        describe: "项目名称",
        alias: "n",
      });
    },
    handler: (argReset) => {
      console.log(argReset, "argReset2");
    },
  })

  // 给命令注册起一个别名
  .alias("v", "version")
  .alias("h", "help")

  // 设定控制台信息展示的一个宽度 terminalWidth表示铺满
  .wrap(cli.terminalWidth())

  // 注册命令的描述信息 注册多个
  .options({
    debug: {
      type: "boolean",
      describe: "查看一些调试信息(log)日志",
      alias: "d",
    },
  })

  // 命令一个一个注册
  .option("registry", {
    type: "string",
    describe: "请输入你的名字",
    alias: "r",
  })

  // 给我们的命令进行分组
  .group(["debug"], "Debug Options")
  .group(["registry"], "Register Options")
  .group(["help"], "Help Options")
  .group(["version"], "Version Options")

  // 在底部加一段说明
  .epilogue(
    dedent`用起来非常香的一个库、欢迎使用（食用）欢迎大家使用！！！
    Lucky出版必属精品、欢迎大家！！！`
  )

  // 严格模式，不允许输入不存在的命令
  .strict().argv;
