/* eslint global-require: off */
const pages = [
  {
    content: require("./pages/helpers.js"),
    path: "/helpers",
    title: "Helpers"
  },
  {
    title: "Components",
    pages: [
      {
        content: require("./pages/components/icons.js"),
        path: "/components/icons",
        title: "Icons"
      }
    ]
  }
];

export default pages;
