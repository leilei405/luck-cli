import Command from "@lucky.com/command";
import { log } from "@lucky.com/utils";
import { Eslint } from 'eslint'

/**
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
    }
}

function Lint(instance) {
    return new LintCommand(instance);
}

export default Lint;
