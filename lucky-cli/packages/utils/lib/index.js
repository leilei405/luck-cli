import log from "./log.js";
import isDebug from "./isDebug.js";
import { makeList, makeInput, makePassword } from "./inquirer.js";
import { getLatestVersion } from "./npm.js";
import request from "./request.js";
import GitHub from "./git/GitHub.js";
import { getGitPlatform } from "./git/gitServer.js";
// import {}

function printErrorLog(err, errorType) {
  if (isDebug()) {
    log.error(errorType, err);
  } else {
    log.error(errorType, err.message);
  }
}

export {
  log,
  isDebug,
  makeList,
  makeInput,
  makePassword,
  getLatestVersion,
  printErrorLog,
  request,
  GitHub,
  getGitPlatform,
};
