import { log, isDebug } from "@lucky.com/utils";

// 监听异常
function printErrorLog(err, errorType) {
  if (isDebug()) {
    log.error(errorType, err);
  } else {
    log.error(errorType, err.message);
  }
}

process.on("uncaughtException", (e) => printErrorLog(e, "error"));
process.on("unhandledRejection", (e) => printErrorLog(e, "promise"));
