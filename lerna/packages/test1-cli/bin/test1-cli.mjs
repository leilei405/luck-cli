#!/usr/bin/env node

"use strict";

// eslint-disable-next-line no-unused-expressions
import test3 from "@lucky-test/lerna-test3";
import test4 from "@lucky-test/lerna-test4";

console.log("测试输出");
console.log(test3(), "test3");
console.log(test4(), "test4");
import cli from "../src/cli.mjs";
cli().parse(process.argv.slice(2));
