import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import {
  CheckIcon,
  ClipboardIcon,
  CutIcon,
  ExpandIcon,
  KeepIcon
} from "@montage/ui/src/components";

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

## All Custom Icons

${(
  <ReactSpecimen showSource span={2}>
    <KeepIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <ClipboardIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <CutIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <ExpandIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <CheckIcon />
  </ReactSpecimen>
)}

`;
