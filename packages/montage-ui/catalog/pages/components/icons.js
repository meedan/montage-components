import React from "react";
import { markdown, ReactSpecimen } from "@catalog/core";

import ContentCutIcon from "@montage/ui/src/components/icons/ContentCutIcon";
import CopyToClipboardIcon from "@montage/ui/src/components/icons/CopyToClipboardIcon";
import InstanceExpandIcon from "@montage/ui/src/components/icons/InstanceExpandIcon";
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

## All Custom Icons

${(
  <ReactSpecimen showSource span={2}>
    <KeepIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <CopyToClipboardIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <ContentCutIcon />
  </ReactSpecimen>
)}
${(
  <ReactSpecimen showSource span={2}>
    <InstanceExpandIcon />
  </ReactSpecimen>
)}

`;
