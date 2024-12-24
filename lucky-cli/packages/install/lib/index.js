import Command from "@lucky.com/command";
import { log, GitHub, makeList, getGitPlatform, Gitee } from "@lucky.com/utils";
class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "description ";
  }

  get options() {}

  async action(params) {
    let platform = getGitPlatform();
    if (!platform) {
      platform = await makeList({
        message: "请选择仓库平台",
        choices: [
          {
            name: "Github",
            value: "github",
          },
          {
            name: "Gitee",
            value: "gitee",
          },
        ],
      });
    }
    log.verbose("platform", platform);

    let gitAPI;
    if (platform === "github") {
      gitAPI = new GitHub();
    } else {
      gitAPI = new Gitee();
    }
    gitAPI.savePlatform(platform);
    await gitAPI.init();

    const searchResult = await gitAPI.searchRepositories({
      q: "vue ",
      language: "JavaScript",
      order: "desc",
      sort: "stars_count",
      per_page: 2,
      page: 1,
    });

    console.log(searchResult);
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
