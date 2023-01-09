#!/usr/bin/env node

const fs = require("fs/promises");
const chalk = require("chalk");
const semver = require("semver");
const path = require("path");
const process = require("process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function readPackageJson() {
  const ctx = await fs.readFile(path.join(process.cwd(), "package.json"));
  const json = JSON.parse(ctx);
  return json;
}

async function getPackageJsonEngines() {
  const json = await readPackageJson();
  let nodeVer = null;
  if (json.engines && json.engines.node) {
    nodeVer = json.engines.node;
  }
  if (!nodeVer) {
    console.log(chalk.red("必須設定 package.json.engines.node 欄位"));
    process.exit(1);
  }
  return nodeVer;
}

async function getNpmrc() {
  try {
    const ctx = await fs.readFile(path.join(process.cwd(), ".npmrc"), {
      encoding: "utf8",
    });
    return ctx;
  } catch (err) {
    console.log(chalk.red("必須擁有 .npmrc 檔案"));
    process.exit(1);
  }
}

async function lintNpmrc() {
  const ctx = await getNpmrc();
  if (!ctx.includes("engine-strict=true")) {
    console.log(chalk.red(".npmrc 必須設定 engine-strict=true"));
    process.exit(1);
  }
}

async function getSystemNodeVersion() {
  const { stdout, stderr } = await exec("node -v");
  if (stderr) {
    console.error(chalk.red(stderr));
    process.exit(1);
  }
  return stdout;
}

async function lintNodeVersion() {
  const enginesNode = await getPackageJsonEngines();
  const currentVersion = await getSystemNodeVersion();
  if (!semver.satisfies(currentVersion, enginesNode)) {
    console.log(chalk.red("目前 node 版本不匹配 package.json.engines.node"));
    console.log("目前使用", currentVersion);
    console.log("必須匹配", enginesNode);
    process.exit(1);
  }
}

async function main() {
  await lintNodeVersion();
  await lintNpmrc();
}

(async () => {
  await main();
})();
