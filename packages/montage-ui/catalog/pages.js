/* eslint global-require: off */
const pages = [
  {
    content: require("./pages/Helpers/Helpers.js"),
    path: "/helpers",
    title: "Helpers"
  },
  {
    content: require("./pages/Icons/Icons.js"),
    path: "/icons",
    title: "Icons"
  },
  {
    title: "Video Meta",
    pages: [
      {
        content: require("./pages/VideoMeta/VideoMeta.js"),
        path: "/video-meta",
        title: "Standard variations"
      },
      {
        content: require("./pages/VideoMeta/VideoMeta-Archived.js"),
        path: "/video-meta-archived",
        title: "Archived variations"
      },
      {
        content: require("./pages/VideoMeta/Partials.js"),
        path: "/video-meta-partials",
        title: "Partials"
      }
    ]
  }
];

export default pages;
