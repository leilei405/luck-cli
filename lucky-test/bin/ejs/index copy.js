const ejs = require("ejs");
const path = require("path");

const html = "<div><%= user.name %></div>";
const options = {};
const data1 = {
  user: {
    name: "张三",
  },
};

const data2 = {
  user: {
    name: "李四",
  },
};

// 第一种方式 编译模板 -> 执行模板 -> 解析html中的 ejs 模版
const result = ejs.compile(html, options)(data1);
console.log("第一种方式", result);

// 第二种方式 编译模板 -> 执行模板 -> 解析html中的 ejs 模版
const result2 = ejs.render(html, data2, options);
console.log("第二种方式", result2);

// 第三种方式 编译模板 -> 执行模板 -> 解析html中的 ejs 模版
// 3.1 Promise 方式
const result3 = ejs.renderFile(
  path.resolve(__dirname, "tem.html"),
  data1,
  options
);
result3.then((res) => {
  console.log("第三种方式 3.1", res);
});

// 3.2 回调方式
ejs
  .renderFile(path.resolve(__dirname, "tem.html"), data2, options)
  .then((res) => {
    console.log("第三种方式 3.2", res);
  });
