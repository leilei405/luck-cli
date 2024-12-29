import createInitCommand from "@lucky.com/init";
import createInstallCommand from "@lucky.com/install";
import createLintCommand from "@lucky.com/lint";
import createCli from "./createCli.js";
import "./exception.js";

export default function (argv) {
  const program = createCli();
  createInitCommand(program);
  createInstallCommand(program);
  createLintCommand(program);
  program.parse(process.argv); // 控制台输出
}
