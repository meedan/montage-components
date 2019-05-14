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
      },
      {
        content: require("./pages/components/VideoMeta.js"),
        path: "/components/VideoMeta",
        title: "VideoMeta"
      }
    ]
  }
];

export default pages;
