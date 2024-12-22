const { glob } = require("glob");

// 匹配js文件
const jsfiles = glob("*.js");
console.log(
  jsfiles.then((res) => {
    console.log("匹配js文件", res);
  })
);

// 匹配所有的js文件，包括子目录
const allFile = glob("**/*.js", {
  ignore: ["node_modules/**"],
});
console.log(
  allFile.then((res) => {
    console.log("匹配所有的js文件，包括子目录, 但是不匹配node_modules", res);
  })
);
