#!/usr/bin/env node

import importLocal from "import-local";
import { log } from "@lucky.com/utils";
import { filename } from "dirname-filename-esm";
import entry from "../lib/index.js";

// 优先加载本地脚手架版本
if (importLocal(filename(import.meta))) {
  log.info("cli", "正在使用本地版本");
} else {
  entry(process.argv.slice(2));
}
