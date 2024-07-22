const fs = require("fs");
const path = require("path");
const { parseComponent } = require("vue-template-compiler");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

function processVueBasedOnFilePath(filePath) {
  // 假设这是你的Vue文件路径
  const vueFilePath = path.resolve(__dirname, filePath);

  // 读取Vue文件
  fs.readFile(vueFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // 解析 Vue 模板
    const descriptor = parseComponent(data);

    // 查找 data() 函数中的 gridOptions 对象

    // 获取 script 部分的内容
    const scriptContent = descriptor.script.content;
    // console.log('scriptContent: ', scriptContent)

    // 解析 script 内容为 AST
    const ast = parser.parse(scriptContent, { sourceType: "module" });
    // console.log('ast: ', ast)

    // 遍历 AST 并更新 gridOptions 的 columns
    traverse(ast, {
      enter(path) {
        if (path.isObjectProperty() && path.node.key.name === "gridOptions") {
          // 更新 columns
          path.node.value.properties
            .find((prop) => prop.key.name === "columns")
            .value.elements.forEach((element, index) => {
            if (
              element.properties.some((p) => p.key.name === "title") &&
              element.properties.find((p) => p.key.name === "title").value
                .value !== "操作"
            ) {
              const titleNode = element.properties.find(
                (p) => p.key.name === "title"
              ).value;
              const titleValue = titleNode.value;
              const newMinWidth = `columnWidth(${titleValue.length}, 0, 0, 0)`;

              // 添加或更新 minWidth 属性
              const minWidthProp = element.properties.find(
                (p) => p.key.name === "minWidth"
              );
              // console.log('element.properties: ', element.properties)
              if (minWidthProp) {
                minWidthProp.value.value = newMinWidth;
              } else {
                // 如果没有，就不添加minWidth
                // element.properties.push(parser.types.objectProperty(
                //   parser.types.identifier('minWidth'),
                //   parser.types.stringLiteral(newMinWidth)
                // ));
              }
            }
          });
        }
      },
    });

    // 生成更新后的 JavaScript 代码
    const updatedScriptContent = generator(ast).code;

    // 更新 SFCDescriptor 的 script 内容
    // const newImport = "import columnWidth from '../columnWidth';";
    // updatedScriptContent = newImport + '\n' + updatedScriptContent
    descriptor.script.content = updatedScriptContent;

    // 构建 .vue 文件的字符串
    let vueFileContent = "";

    // 添加 <template> 标签
    if (descriptor.template) {
      vueFileContent += `<template>\n${descriptor.template.content}\n</template>\n\n`;
    }

    // 添加 <script> 标签
    if (descriptor.script) {
      const newImport = "import columnWidth from '@biz/utils/columnWidth';";
      vueFileContent += `<script>\n${
        (!descriptor.script.content.match(newImport)
          ? newImport + "\n"
          : "") + descriptor.script.content
      }\n</script>\n\n`;
    }

    // 添加 <style> 标签
    if (descriptor.styles && descriptor.styles.length) {
      descriptor.styles.forEach((style) => {
        vueFileContent += `<style scoped="${style.scoped}">\n${style.content}\n</style>\n\n`;
      });
    }

    // 删除最后的空行
    vueFileContent = vueFileContent.trim();

    // 写入到文件
    const saveFilePath = path.join(__dirname, filePath);
    fs.writeFileSync(saveFilePath, vueFileContent, "utf8");
  });
}

function findListFoldersAndReadIndexVue(dirPath) {
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dirPath, file.name);
      console.log('file name: ', file.name);

      // 如果是目录
      if (file.isDirectory()) {
        // 检查目录名是否以'List'结尾
        if (file.name.endsWith('List')) {
          // 尝试读取index.vue文件
          const indexVuePath = path.join(filePath, 'index.vue');
          fs.access(indexVuePath, fs.constants.F_OK, (error) => {
            if (!error) {
              // 文件存在，读取内容
              processVueBasedOnFilePath(indexVuePath)
              // fs.readFile(indexVuePath, 'utf8', (err, data) => {
              //   if (err) {
              //     console.error('Error reading file:', err);
              //   } else {
              //     console.log(`Content of ${indexVuePath}:`);
              //     console.log(data);
              //   }
              // });
            }
          });
        }

        // 递归遍历子目录
        // findListFoldersAndReadIndexVue(filePath);
      }
    });
  });
}

const currentDir = process.cwd();
findListFoldersAndReadIndexVue('./micro-app/biz/src/views/genform/')
