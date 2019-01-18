/* eslint global-require: off */
const pages = [
  // {
  //   content: require("../README.md"),
  //   path: "/",
  //   title: "Welcome"
  // },
  // {
  //   content: require("../CHANGELOG.md"),
  //   path: "/changelog",
  //   title: "Changelog"
  // },
  {
    content: require("./pages/helpers.js"),
    path: "/helpers",
    title: "Helpers"
  },
  {
    content: require("./pages/colors.js"),
    path: "/colors",
    title: "Colors"
  },
  {
    content: require("./pages/themes.js"),
    path: "/themes",
    title: "Themes"
  },
  {
    content: require("./pages/actions.js"),
    path: "/actions",
    title: "Actions"
  },
  {
    content: require("./pages/containers.js"),
    path: "/containers",
    title: "Containers"
  }
];

export default pages;
