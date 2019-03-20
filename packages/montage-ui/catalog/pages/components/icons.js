import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import KeepIcon from "@montage/ui/src/components/icons/KeepIcon";

export default () => markdown`

# Icons

## Material UI Icons

## Custom Icons

${(
  <ReactSpecimen showSource span={2}>
    <KeepIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <KeepIcon color="primary" />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <KeepIcon color="secondary" />
  </ReactSpecimen>
)}

`;
