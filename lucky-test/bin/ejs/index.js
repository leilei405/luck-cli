const ejs = require("ejs");
const path = require("path");

// const html = "<div><%= user.name %></div>";
const html = `
 
`;
const options = {};
const data = {
  data: {
    selected: 1,
  },
};

const template = ejs.render(html, data, options);
console.log(template, "template");
