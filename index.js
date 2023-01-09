#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk");
const semver = require("semver");
const path = require("path");
const process = require("process");
const child_process = require("child_process");

function readPackageJson() {
  const ctx = fs.readFileSync(path.join(process.cwd(), "package.json"));
  const json = JSON.parse(ctx);
  return json;
}

function getPackageJsonEngines() {
  const json = readPackageJson();
  let nodeVer = null;
  if (json.engines && json.engines.node) {
    nodeVer = json.engines.node;
  }
  if (!nodeVer) {
    console.log(chalk.red("必須設定 package.json.engines.node 欄位"));
    console.log(
      chalk.green(
        "https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines"
      )
    );
    process.exit(1);
  }
  return nodeVer;
}

function getNpmrc() {
  try {
    const ctx = fs.readFileSync(path.join(process.cwd(), ".npmrc"), {
      encoding: "utf8",
    });
    return ctx;
  } catch (err) {
    console.log(chalk.red("必須擁有 .npmrc 檔案"));
    console.log(chalk.green("https://docs.npmjs.com/cli/v9/using-npm/config"));
    process.exit(1);
  }
}

function lintNpmrc() {
  const ctx = getNpmrc();
  if (!ctx.includes("engine-strict=true")) {
    console.log(chalk.red(".npmrc 必須設定 engine-strict=true"));
    console.log(
      chalk.green(
        "https://docs.npmjs.com/cli/v9/using-npm/config#engine-strict"
      )
    );
    process.exit(1);
  }
}

function getSystemNodeVersion() {
  const { stdout, stderr } = child_process.spawnSync("node", ["-v"], {
    encoding: "ascii",
  });
  if (stderr) {
    console.error(chalk.red(stderr));
    process.exit(1);
  }
  return stdout;
}

async function lintNodeVersion() {
  const enginesNode = getPackageJsonEngines();
  const currentVersion = getSystemNodeVersion();
  if (!semver.satisfies(currentVersion, enginesNode)) {
    console.log(chalk.red("目前 node 版本不匹配 package.json.engines.node"));
    console.log("目前使用", currentVersion);
    console.log("必須匹配", enginesNode);
    process.exit(1);
  }
}

function main() {
  lintNodeVersion();
  // lintNpmrc();
}

main();
