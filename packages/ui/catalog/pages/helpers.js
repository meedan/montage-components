import React from "react";
import { markdown, CodeSpecimen } from "@catalog/core";

import {} from "src";

export default () => markdown`
  # Helpers

  ## CSSReset

  Use to reset default browser styles. It’s a direct port of Eric Meyer’s [reset.css](https://meyerweb.com/eric/tools/css/reset/) translated as a React component.

  ${<CodeSpecimen>import CSSReset from "montage-ui";</CodeSpecimen>}
`;
