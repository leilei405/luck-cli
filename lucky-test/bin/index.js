const inquirer = require("inquirer");

inquirer
  .createPromptModule()([
    {
      type: "editor",
      name: "editor",
      message: "请输入你的内容",
    },
    // {
    //   type: "password",
    //   name: "password",
    //   message: "请输入你的密码",
    // },
    // {
    //   type: "checkbox",
    //   name: "framework",
    //   message: "请选择你喜欢的框架",
    //   default: ["vue", "react"],
    //   choices: [
    //     {
    //       name: "vue",
    //       value: "vue",
    //       short: "v",
    //     },
    //     {
    //       name: "react",
    //       value: "react",
    //       short: "r",
    //     },
    //   ],
    // },
    // {
    //   type: "expand",
    //   name: "framework",
    //   message: "请选择你喜欢的框架",
    //   default: "vue",
    //   choices: [
    //     {
    //       key: "v",
    //       name: "vue",
    //       value: "vue",
    //     },
    //     {
    //       key: "r",
    //       name: "react",
    //       value: "react",
    //     },
    //   ],
    // },
    // {
    //   type: "rawlist",
    //   name: "framework",
    //   message: "请选择你喜欢的框架",
    //   choices: [
    //     {
    //       name: "vue",
    //       value: "vue",
    //       short: "v",
    //     },
    //     {
    //       name: "react",
    //       value: "react",
    //       short: "r",
    //     },
    //   ],
    // },
    // 列表进行选择 单选
    // {
    //   type: "list",
    //   name: "language",
    //   message: "请选择你喜欢的编程语言",
    //   choices: ["javascript", "typescript", "java", "python"],
    // },
    // {
    //   type: "confirm",
    //   name: "choice",
    //   message: "你是否喜欢编程",
    //   default: true,
    // },
    // {
    //   /** 输入类型 */
    //   type: "input",
    //   /** 输入的内容 */
    //   name: "name",
    //   /** 输入的提示 */
    //   message: "请输入你的名字",
    //   /** 默认值 */
    //   default: "lucky",
    //   /** 校验输入的是否符合预期 */
    //   validate: (val) => {
    //     if (val === "lucky") {
    //       console.log("你好，lucky");
    //       return true;
    //     }
    //     return "请输入正确的名字";
    //   },
    //   /** 说明 补充信息 提示 */
    //   transformer: (val) => {
    //     return val + "(input your name)";
    //   },
    //   /** 过滤输入的内容 进行改变 */
    //   filter: (val) => {
    //     return val.trim();
    //   },
    // },
    // {
    //   type: "number",
    //   name: "age",
    //   message: "请输入你的年龄",
    //   default: "18",
    // },
  ])
  .then((answers) => {
    console.log(answers);
  });
