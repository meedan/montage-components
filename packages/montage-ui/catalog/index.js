import React from "react";
import ReactDOM from "react-dom";
import { Catalog } from "@catalog/core";

import { ThemeProvider } from "@montage/ui";

import pages from "./pages";
import theme from "./theme";

import { version } from "../package.json";

ReactDOM.render(
  <>
    <ThemeProvider>
      <Catalog
        pages={[
          // {
          //   path: "/md",
          //   title: "MD",
          //   component: require("./WELCOME.md")
          // },
          {
            path: "/mdx",
            title: "MDX",
            component: require("./WELCOME.mdx")
          },
          ...pages
        ]}
        responsiveSizes={[
          { name: "tablet", width: 1024, height: 768 },
          { name: "desktop", width: 1440, height: 900 }
        ]}
        theme={theme}
        title={`Montage UI v.${version}`}
      />
    </ThemeProvider>
  </>,
  document.getElementById("catalog")
);
