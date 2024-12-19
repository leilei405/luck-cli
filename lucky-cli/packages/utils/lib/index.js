import log from "./log.js";
import isDebug from "./isDebug.js";
import { makeList, makeInput } from "./inquirer.js";
import { getLatestVersion } from "./npm.js";

function printErrorLog(err, errorType) {
  if (isDebug()) {
    log.error(errorType, err);
  } else {
    log.error(errorType, err.message);
  }
}

export { log, isDebug, makeList, makeInput, getLatestVersion, printErrorLog };
