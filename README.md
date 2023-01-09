# lint-node-version
## 安裝
```
npm install -g @sayoko123f/lint-node-version
```
在 `package.json`
```json
{
    "scripts":{
        "preinstall": "lint-node-version",
        "prestart": "lint-node-version"
    }
}
```

## 檢查
### 第一步
> https://docs.npmjs.com/cli/v9/configuring-npm/package-json#engines

檢查 `package.json` 是否有設置 `engines.node`，如果沒設置就警告並退出。

### 第二步
檢查 `node -v` 是否匹配，如果不匹配就警告並退出。

### 第三步
> https://docs.npmjs.com/cli/v9/using-npm/config

檢查 `.npmrc` 是否有設置 `engine-strict=true`，如果沒設置就警告並退出。