import pkg from 'eslint';
import execaPkg from 'execa'
import ora from 'ora';
import jest from 'jest';
import Command from "@lucky.com/command";
import { log, printErrorLog } from "@lucky.com/utils";
import overrideConfig from './eslint/vue-config.js';

const { ESLint } = pkg;
const { execa } = execaPkg;
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

  extractESLint(resultText, type) {
    const problems = /[0-9]+ problems/;
    const warnings = /([0-9]+) warnings/;
    const errors = /([0-9]+) errors/;
    switch (type) {
      case 'problems':
        return resultText.match(problems)[0].match(/[0-9]+/)[0];
      case 'warnings':
        return resultText.match(warnings)[0].match(/[0-9]+/)[0];
      case 'errors':
        return resultText.match(errors)[0].match(/[0-9]+/)[0];
      default:
        return null;
    }
  }

  parseESLintResult(resultText) {
    const problems = this.extractESLint(resultText, 'problems');
    const errors = this.extractESLint(resultText, 'errors');
    const warnings = this.extractESLint(resultText, 'warnings');
    return {
      problems: +problems || 0,
      errors: +errors || 0,
      warnings: +warnings || 0,
    };
  }

  async action([name, otherArgs]) {
    log.verbose('lint');
    const spinner = ora('正在安装依赖').start();
    try {
      await execa('npm', ['install', '-D', 'eslint-plugin-vue']);
      await execa('npm', ['install', '-D', 'eslint-config-airbnb-base']);
    } catch (e) {
      printErrorLog(e);
    } finally {
      spinner.stop();
    }

    // 1.初始化eslint
    const cwd = process.cwd()
    log.verbose('cwd',cwd)
    const eslint = new ESLint({
      cwd,
      overrideConfig,
    })
    log.info('正在执行eslint检查');
    // 2.执行eslint
    try {
      const results = await eslint.lintFiles(['./src/**/*.js', './src/**/*.vue'])
      console.log('results',results)
      const formatter = await eslint.loadFormatter('stylish')
      const resultText = formatter.format(results)
      const eslintResult = this.parseESLintResult(resultText);
      log.verbose('eslintResult', eslintResult);
      log.success('eslint检查完毕', '错误: ' + eslintResult.errors, '，警告: ' + eslintResult.warnings);
    } catch (error) {
      log.error('eslint检查失败', error);
    }

  }
}

function Lint(instance) {
  return new LintCommand(instance);
}

export default Lint;
