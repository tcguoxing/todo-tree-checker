# todo-tree-checker

[中文](./README.md) | [English](./README-EN.md)

Scan source files for `TODO` / `FIXME` (or custom) line comments — as a CLI, or as a Vite / Webpack plugin before build.

## Install

```bash
pnpm add -D todo-tree-checker
# or: npm i -D todo-tree-checker
```

## package.json config

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

Priority: CLI flags / plugin options > `todoTreeChecker` field > defaults.

## CLI

**Temir pretty UI is on by default** (rounded spinner frame + double-border result panel).

```bash
pnpm todo-check
pnpm todo-check --path src --target todo --target fixme
pnpm todo-check --no-pretty
pnpm todo-check --no-fail-on-match --report-file ./todo-report.json
```

- **pretty** (default `true`): Temir terminal UI. Use `--no-pretty` or `"pretty": false` for plain text.
- **failOnMatch** (default `true`): exit `1` when matches are found.

Legacy bin name `todo-tree-checker` still works.

## Vite plugin

```js
// vite.config.js
import todoTreeChecker from 'todo-tree-checker/vite'

export default {
  plugins: [
    todoTreeChecker() // reads package.json; override with todoTreeChecker({ failOnMatch: false })
  ],
}
```

Runs on `buildStart` (build only). Plugin default is plain output (`pretty: false`).

## Webpack plugin

```js
const TodoTreeCheckerPlugin = require('todo-tree-checker/webpack')

module.exports = {
  plugins: [new TodoTreeCheckerPlugin()],
}
```

## Programmatic API

```js
const { scan, resolveConfig } = require('todo-tree-checker')
const result = scan({ paths: ['src'], targets: ['todo'] })
console.log(result.matches, result.stats)
```
