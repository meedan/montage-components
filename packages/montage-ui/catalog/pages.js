/* eslint global-require: off */
import {
  // icons
  CheckIcon,
  ClipboardIcon,
  CutIcon,
  ExpandIcon,
  KeepIcon,
  // components
  TimelinePlayhead,
  VideoMeta
  // partials
} from "@montage/ui";

import Archive from "@montage/ui/src/components/VideoMeta/of/Archive";
import Favourite from "@montage/ui/src/components/VideoMeta/of/Favourite";
import Keep from "@montage/ui/src/components/VideoMeta/of/Keep";
import MoreMenu from "@montage/ui/src/components/VideoMeta/of/MoreMenu";
import PublishedDate from "@montage/ui/src/components/VideoMeta/of/PublishedDate";
import RecordedDate from "@montage/ui/src/components/VideoMeta/of/RecordedDate";

const pages = [
  {
    content: require("./pages/icons.md"),
    path: "/icons",
    title: "Icons",
    imports: {
      CheckIcon: CheckIcon,
      ClipboardIcon: ClipboardIcon,
      CutIcon: CutIcon,
      ExpandIcon: ExpandIcon,
      KeepIcon: KeepIcon
    }
  },
  {
    title: "Video Meta",
    pages: [
      {
        content: require("./pages/video-meta-variations.md"),
        path: "/video-meta-variations",
        title: "Variations",
        imports: {
          VideoMeta: VideoMeta
        }
      },
      {
        content: require("./pages/video-meta-partials.md"),
        path: "/video-meta-partials",
        title: "Partials",
        imports: {
          Archive: Archive,
          Favourite: Favourite,
          Keep: Keep,
          MoreMenu: MoreMenu,
          PublishedDate: PublishedDate,
          RecordedDate: RecordedDate
        }
      }
    ]
  },
  {
    title: "Range slider",
    content: require("./pages/RangeSlider/Variations.js"),
    path: "/range-slider"
  },
  {
    content: require("./pages/timeline-playhead.md"),
    path: "/timeline-playhead",
    title: "Timeline playhead",
    imports: {
      TimelinePlayhead: TimelinePlayhead
    }
  }
];

export default pages;
