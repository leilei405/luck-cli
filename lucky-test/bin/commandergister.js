#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");

// 获取commander的单例
// const { program } = commander;

// 实例化commander
const program = new commander.Command();

// command 注册命令
const clone = program.command("clone <source> [destination]");
clone
  .description("执行克隆仓库")
  .option("-f, --force", "强制初始化")
  .action((source, destination, cmdObj) => {
    console.log("克隆了一个仓库", source, destination, cmdObj.force);
  });

// addCommand 注册命令
const service = new commander.Command("service");
service
  .description("启动服务")
  .command("start [port]")
  .action((port, cmdObj) => {
    console.log("启动了一个服务", port);
  });

service
  .description("停止服务")
  .command("stop")
  .action(() => {
    console.log("停止了一个服务");
  });

program.addCommand(service);
