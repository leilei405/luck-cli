const log = require("npmlog");

// 调试模式 -d --debug
if (process.argv.includes("--debug") || process.argv.includes("-d")) {
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
