import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { RangeSlider } from "@montage/ui/src/components";

export default () => markdown`

# Variations

## Clips range slider

${(
  <ReactSpecimen>
    <RangeSlider
      checkInstance={i => console.log("checkInstance: ", i)}
      deleteInstance={i => console.log("deleteInstance: ", i)}
      duration={100}
      instances={[
        {
          // created: "2019-04-24T10:11:24+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:13:44+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 5,
          id: 1,
          start_seconds: 0
        },
        {
          // created: "2019-04-24T10:14:05+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:14:05+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 50,
          id: 2,
          start_seconds: 30
        },
        {
          // created: "2019-04-24T10:14:05+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:14:05+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 90,
          id: 3,
          start_seconds: 70
        }
      ]}
      updateInstances={instances => console.log("updateInstances: ", instances)}
    />
  </ReactSpecimen>
)}

## Tags/Places range slider

${(
  <ReactSpecimen>
    <RangeSlider
      clipInstance={i => console.log("clipInstance: ", i)}
      deleteInstance={i => console.log("deleteInstance: ", i)}
      duration={100}
      instances={[
        {
          // created: "2019-04-24T10:11:24+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:13:44+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 5,
          id: 1,
          start_seconds: 0
        },
        {
          // created: "2019-04-24T10:14:05+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:14:05+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 50,
          id: 2,
          start_seconds: 30
        },
        {
          // created: "2019-04-24T10:14:05+00:00",
          // global_tag_id: 3972,
          // modified: "2019-04-24T10:14:05+00:00",
          // project_id: 1254,
          // project_tag_id: 3994,
          // video_id: 11503,
          // video_tag_id: 20674,
          // youtube_id: "9G8dmsnFjL4"
          end_seconds: 90,
          id: 3,
          start_seconds: 70
        }
      ]}
      updateInstances={instances => console.log("updateInstances: ", instances)}
    />
  </ReactSpecimen>
)}

`;
