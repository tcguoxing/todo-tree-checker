# todo-tree-checker
It can scan all file under src folder(default), You can choose your own folder by your ease.
## usage

You can add script "check": "todo-tree-checker" in your package.json.
```
npm run todo-tree-checker // default src path
npm run todo-tree-checker ../another-program/src/view // another-program's src/view folder
npm run todo-tree-checker ../another-program/src/view fixme // another-program's src/view folder and check fixme
```
if your target has todo, the result is like below: 
```
_______________filePath_______________ 
++
++
 ..\another-program\src\App.vue:13:16 has todo。
++
++
_______________filePath_______________ 
++
++
 ..\another-program\src\App.vue:14:16 has todo。
++
++
```

