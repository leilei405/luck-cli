import Command from "@lucky.com/command";

class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "description ";
  }

  get options() {
    return [
      ["-g, --global", "是否安装全局", false],
      ["-d, --dir <dir>", "指定目录", process.cwd()],
    ];
  }

  async action(params) {
    console.log("params", params);
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
