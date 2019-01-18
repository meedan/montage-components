import React from "react";
import ReactDOM from "react-dom";
import { Catalog } from "@catalog/core";

import pages from "./pages";
import theme from "./theme";

import { CSSReset } from "..";
import { version } from "../package.json";

ReactDOM.render(
  <>
    <CSSReset />
    <Catalog
      pages={pages}
      responsiveSizes={[
        { name: "phone", width: 360, height: 640 },
        { name: "tablet", width: 1024, height: 768 }
        // { name: 'desktop', width: 1440, height: 900 }
      ]}
      theme={theme}
      title={`Montage UI v.${version}`}
    />
  </>,
  document.getElementById("catalog")
);
