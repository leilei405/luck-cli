import inquirer from "inquirer";

const make = ({
  choices,
  defaultValue,
  message = "请选择",
  type = "list",
  require = true,
  mask = "*",
  validate,
  pageSize,
  loop,
}) => {
  const options = {
    name: "name",
    default: defaultValue,
    type,
    message,
    mask,
    validate,
    pageSize,
    loop,
  };

  if (type === "list") {
    options.choices = choices;
  }
  return inquirer.prompt(options).then((answer) => {
    return answer.name;
  });
};

const makeList = (params) => {
  return make({ ...params });
};
const makeInput = (params) => {
  return make({ ...params, type: "input" });
};
const makePassword = (params) => {
  return make({ ...params, type: "password" });
};
export { makeList, makeInput, makePassword };
