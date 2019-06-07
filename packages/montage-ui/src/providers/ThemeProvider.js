import { array, node, oneOfType, object, string } from "prop-types";
import React from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import grey from "@material-ui/core/colors/grey";

const mui = createMuiTheme();

const theme = createMuiTheme({
  // Overrides
  overrides: {
    MuiTooltip: {
      tooltip: {
        backgroundColor: grey[700],
        fontSize: mui.typography.pxToRem(13)
      }
    }
  },

  // Props
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },

  // Palette
  palette: {
    common: {
      black: "#212121",
      white: "#fff"
    },
    primary: {
      light: "#ff6d01",
      main: "#ff6d01",
      dark: "#ff6d01",
      contrastText: "#fff"
    },
    secondary: {
      light: "#212121",
      main: "#212121",
      dark: "#212121",
      contrastText: "#fff"
    }
  },

  // Shape
  shape: {
    borderRadius: 2
  },

  // Typography
  typography: {
    h6: {
      fontWeight: mui.typography.fontWeightRegular
    }
  }
});

const CustomThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

CustomThemeProvider.propTypes = {
  children: oneOfType([array, node, object, string]).isRequired
};

export default CustomThemeProvider;
