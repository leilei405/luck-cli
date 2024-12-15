import createInitCommand from "@lucky.com/init";
import createCli from "./createCli.js";
import "./exception.js";

export default function (argv) {
  const program = createCli();
  createInitCommand(program);
  program.parse(process.argv); // 控制台输出
}
