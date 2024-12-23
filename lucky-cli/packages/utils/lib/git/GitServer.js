import path from "node:path";
import { homedir } from "node:os";
import { pathExistsSync } from "path-exists";
import fse from "fs-extra";
import { makePassword } from "../inquirer.js";

const TEMP_HOME = ".lucky-cli";
const TEMP_TOKEN = ".token";

function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

class GitServer {
  constructor() {
    // 判断token是否存在
    const tokenPath = createTokenPath();
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath);
    } else {
      this.getToken().then((token) => {
        this.token = token;
        // fse.ensureDirSync(path.resolve(homedir(), TEMP_HOME));
        // fse.writeFileSync(tokenPath, token);
      });
    }
  }

  getToken() {
    return makePassword({
      message: "请输入token",
    });
  }
}

export default GitServer;
