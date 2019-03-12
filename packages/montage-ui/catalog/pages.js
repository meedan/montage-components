/* eslint global-require: off */
const pages = [
  {
    content: require("../README.md"),
    path: "/",
    title: "Welcome"
  },
  {
    content: require("../CHANGELOG.md"),
    path: "/changelog",
    title: "Changelog"
  },
  {
    content: require("./pages/containers.js"),
    path: "/containers",
    title: "Containers"
  }
];

export default pages;
