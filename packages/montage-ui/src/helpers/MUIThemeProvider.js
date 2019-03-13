import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { oneOfType, array, obj, node, string } from "prop-types";
import grey from "@material-ui/core/colors/grey";
import React from "react";

import { color } from "@montage/ui/src/config";

const theme = createMuiTheme({
  overrides: {
    MuiTooltip: {
      tooltip: {
        backgroundColor: grey[900]
        // padding: '4px 8px',
        // fontSize: theme.typography.pxToRem(10)
        // lineHeight: "".concat(theme.typography.round(14 / 10), "em")
      }
    }
  },
  palette: {
    common: {
      black: color.black,
      white: color.white
    },
    primary: {
      light: color.brand,
      main: color.brand,
      dark: color.brand,
      contrastText: color.white
    },
    secondary: {
      light: color.black,
      main: color.black,
      dark: color.black,
      contrastText: color.white
    }
  },
  typography: {
    useNextVariants: true
  }
});

const CustomMUIThemeProvider = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

CustomMUIThemeProvider.propTypes = {
  children: oneOfType([array, obj, node, string]).isRequired
};

export default CustomMUIThemeProvider;
