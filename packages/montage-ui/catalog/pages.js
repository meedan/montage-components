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
        content: require("./pages/VideoMeta/Variations.js"),
        path: "/video-meta",
        title: "Variations"
      },
      {
        content: require("./pages/VideoMeta/Partials.js"),
        path: "/video-meta-partials",
        title: "Partials"
      }
    ]
  },
  {
    title: "Range slider",
    pages: [
      {
        content: require("./pages/RangeSlider/Variations.js"),
        path: "/range-slider",
        title: "Variations"
      }
      // {
      //   content: require("./pages/VideoMeta/Partials.js"),
      //   path: "/video-meta-partials",
      //   title: "Partials"
      // }
    ]
  },
  {
    content: require("./pages/TimelinePlayhead/TimelinePlayhead.js"),
    path: "/timeline-playhead",
    title: "Timeline playhead"
  }
];

export default pages;
