const log = require("npmlog");
const isDebug = require("./isDebug");

// 调试模式 -d --debug
if (isDebug) {
  log.level = "verbose";
} else {
  log.level = "info";
}

// 日志前缀
log.heading = "lucky-cli";

// 自定义日志级别
log.addLevel("success", 2000, {
  fg: "green",
  bold: true,
});

module.exports = log;
