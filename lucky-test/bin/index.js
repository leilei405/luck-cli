#!/usr/bin/env node

const commander = require("commander");

// 获取commander的单例
const { program } = commander;

// 实例化commander
// const program = new commander.Command();

// 执行 lucky-test 时候直接调出帮助信息
program.outputHelp();

// 解析参数
program.parse(process.argv);

customization;
