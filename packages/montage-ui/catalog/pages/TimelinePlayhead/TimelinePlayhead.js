import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import { TimelinePlayhead } from "@montage/ui/src/components";

export default () => markdown`

# Variations

## Clips range slider

${(
  <ReactSpecimen>
    <TimelinePlayhead
      currentTime={50}
      duration={100}
      onChange={time => console.log("onChange", time)}
    />
  </ReactSpecimen>
)}

${(
  <ReactSpecimen>
    <TimelinePlayhead
      currentTime={50}
      duration={100}
      onChange={time => console.log("onChange", time)}
    />
  </ReactSpecimen>
)}
`;
