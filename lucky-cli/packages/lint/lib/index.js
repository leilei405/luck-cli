import pkg from 'eslint';
import Command from "@lucky.com/command";
import { log } from "@lucky.com/utils";

const { ESLint } = pkg;
/**
 * @description: 测试命令
 * 交互式创建项目: lucky-cli lint
 */
class LintCommand extends Command {
  get command() {
    return "lint";
  }

  get description() {
    return "lint Project";
  }

  get options() {
    return [];
  }

  async action([name, otherArgs]) {
    log.verbose('lint')
    const eslint = new ESLint({ cwd: process.cwd() })
    const results = await eslint.lintFiles(['**/*.js'])
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)
    console.log(resultText, 'resultText')
    console.log(results, 'results')
  }
}

function Lint(instance) {
  return new LintCommand(instance);
}

export default Lint;
