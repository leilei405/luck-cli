import Command from "@lucky.com/command";
import { log, GitHub } from "@lucky.com/utils";
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
    // const { github } = new GitHub();
    const { githubApi } = new GitHub();
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
