# todo-tree-checker

[中文](./README-CN.md) | [English](./README.md)

在构建前扫描源码中的 `TODO` / `FIXME`（或自定义关键词）行注释 —— 可作独立 CLI，也可作为 Vite / Webpack 插件使用。

## 安装

```bash
pnpm add -D todo-tree-checker
# 或: npm i -D todo-tree-checker
```

## package.json 配置

```json
{
  "todoTreeChecker": {
    "paths": ["src"],
    "targets": ["todo", "fixme"],
    "exclude": ["**/node_modules/**", "**/dist/**"],
    "pretty": true,
    "failOnMatch": true,
    "reportFile": null
  },
  "scripts": {
    "todo-check": "todo-check"
  }
}
```

优先级：CLI 参数 / 插件构造参数 > `todoTreeChecker` 字段 > 内置默认值。

## CLI

默认开启 **Temir 终端美化**（圆角边框 + 旋转扫描动画 + 双线结果面板）。

```bash
pnpm todo-check
pnpm todo-check --path src --target todo --target fixme
pnpm todo-check --no-pretty
pnpm todo-check --no-fail-on-match --report-file ./todo-report.json
```

- **pretty**（默认 `true`）：Temir 美化终端。加 `--no-pretty` 或配置 `"pretty": false` 可改为纯文本。
- **failOnMatch**（默认 `true`）：发现匹配时以退出码 `1` 结束。

旧命令名 `todo-tree-checker` 仍然可用。

## Vite 插件

```js
// vite.config.js
import todoTreeChecker from 'todo-tree-checker/vite'

export default {
  plugins: [
    todoTreeChecker() // 读取 package.json；可用 todoTreeChecker({ failOnMatch: false }) 覆盖
  ],
}
```

在 `buildStart` 时执行（仅 build）。插件默认使用纯文本输出（`pretty: false`）。

## Webpack 插件

```js
const TodoTreeCheckerPlugin = require('todo-tree-checker/webpack')

module.exports = {
  plugins: [new TodoTreeCheckerPlugin()],
}
```

## 编程式 API

```js
const { scan, resolveConfig } = require('todo-tree-checker')
const result = scan({ paths: ['src'], targets: ['todo'] })
console.log(result.matches, result.stats)
```
