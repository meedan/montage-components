import React from "react";
import { markdown, ColorPaletteSpecimen } from "@catalog/core";

import { Thm } from "../../src";

export default () => markdown`

# Color palette

## Base colors

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "base300", value: Thm.color.base300 },
      { name: "base400", value: Thm.color.base400 },
      { name: "base500", value: Thm.color.base500 },
      { name: "base600", value: Thm.color.base600 },
      { name: "base700", value: Thm.color.base700 },
      { name: "base800", value: Thm.color.base800 },
      { name: "base900", value: Thm.color.base900 }
    ]}
    horizontal
  />
)}

## Brand colors

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "primary300", value: Thm.color.primary300 },
      { name: "primary400", value: Thm.color.primary400 },
      { name: "primary500", value: Thm.color.primary500 },
      { name: "primary600", value: Thm.color.primary600 },
      { name: "primary700", value: Thm.color.primary700 },
      { name: "primary800", value: Thm.color.primary800 },
      { name: "primary900", value: Thm.color.primary900 }
    ]}
    horizontal
  />
)}

## Positive colors

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "positive300", value: Thm.color.positive300 },
      { name: "positive400", value: Thm.color.positive400 },
      { name: "positive500", value: Thm.color.positive500 },
      { name: "positive600", value: Thm.color.positive600 },
      { name: "positive700", value: Thm.color.positive700 },
      { name: "positive800", value: Thm.color.positive800 },
      { name: "positive900", value: Thm.color.positive900 }
    ]}
    horizontal
  />
)}

## Negative colors

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "negative300", value: Thm.color.negative300 },
      { name: "negative400", value: Thm.color.negative400 },
      { name: "negative500", value: Thm.color.negative500 },
      { name: "negative600", value: Thm.color.negative600 },
      { name: "negative700", value: Thm.color.negative700 },
      { name: "negative800", value: Thm.color.negative800 },
      { name: "negative900", value: Thm.color.negative900 }
    ]}
    horizontal
  />
)}

## Shadows and Flares

A set of **rgba-based shadow and flare colors** are also available, though the color specimen here displays them all as, well… just white and black.

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "shadow300", value: Thm.color.shadow300 },
      { name: "shadow400", value: Thm.color.shadow400 },
      { name: "shadow500", value: Thm.color.shadow500 },
      { name: "shadow600", value: Thm.color.shadow600 },
      { name: "shadow700", value: Thm.color.shadow700 },
      { name: "shadow800", value: Thm.color.shadow800 },
      { name: "shadow900", value: Thm.color.shadow900 }
    ]}
    span={3}
  />
)}

${(
  <ColorPaletteSpecimen
    colors={[
      { name: "flare300", value: Thm.color.flare300 },
      { name: "flare400", value: Thm.color.flare400 },
      { name: "flare500", value: Thm.color.flare500 },
      { name: "flare600", value: Thm.color.flare600 },
      { name: "flare700", value: Thm.color.flare700 },
      { name: "flare800", value: Thm.color.flare800 },
      { name: "flare900", value: Thm.color.flare900 }
    ]}
    span={3}
  />
)}



`;
