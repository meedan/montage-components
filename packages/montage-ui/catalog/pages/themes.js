import { markdown, ReactSpecimen } from "@catalog/core";
import { ThemeProvider } from "styled-components";
import React from "react";

import { Action, Thm } from "src";

export default () => markdown`
# Working with themes

Each styled component requires a theme prop object defining colour scheme of the component (among other things). You can easily write over styles of that particular component by passing a theme prop to it (discouraged) or wrapping it with **ThemeProvider** cascading another already created theme (preferred):

## ThemeProvider (preferred)

${(
  <ReactSpecimen span={3} showSource>
    <Action block primary>
      Primary Action
    </Action>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={3} showSource>
    <ThemeProvider
      theme={{ ...Thm, color: { action: "pink", bodyBackg: "blue" } }}
    >
      <Action block primary>
        Primary Action with a custom theme supplied
      </Action>
    </ThemeProvider>
  </ReactSpecimen>
)}

## Prop overrides (discouraged)

${(
  <ReactSpecimen span={3} showSource>
    <Action block primary>
      Primary Action
    </Action>
  </ReactSpecimen>
)}

${(
  <ReactSpecimen span={3} showSource>
    <Action
      block
      primary
      theme={{ ...Thm, color: { action: "pink", bodyBackg: "blue" } }}
    >
      Primary Action with a custom theme supplied
    </Action>
  </ReactSpecimen>
)}

`;
