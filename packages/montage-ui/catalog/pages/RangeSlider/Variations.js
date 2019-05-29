import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { CheckIcon, CutIcon, RangeSlider } from "@montage/ui/src/components";

export default () => markdown`

# Variations

## Clips range slider

${(
  <ReactSpecimen>
    <RangeSlider
      duration={100}
      deleteInstance={() => console.log("deleteInstance")}
      extendInstance={() => console.log("extendInstance")}
      instancePopoverChildren={(
        <>
          <Tooltip title="Open in Check">
            <IconButton>
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
)}
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
          id: 24100,
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
          id: 24101,
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
          id: 24105,
          start_seconds: 70
        }
      ]}
    />
  </ReactSpecimen>
)}

## Tags/Places range slider

${(
  <ReactSpecimen>
    <RangeSlider
      duration={2645}
      deleteInstance={() => console.log("deleteInstance")}
      extendInstance={() => console.log("extendInstance")}
      instancePopoverChildren={(
        <>
          <Tooltip title="Copy to Clips">
            <IconButton>
              <CutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
)}
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
          end_seconds: 1963,
          id: 24100,
          start_seconds: 1043.23066109155
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
          end_seconds: 45,
          id: 24101,
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
          end_seconds: 126,
          id: 24105,
          start_seconds: 120
        }
      ]}
    />
  </ReactSpecimen>
)}

`;
