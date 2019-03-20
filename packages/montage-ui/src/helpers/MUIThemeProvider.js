import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { array, node, oneOfType, object, string } from "prop-types";
import grey from "@material-ui/core/colors/grey";
import React from "react";

import { color } from "@montage/ui/src/config";

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        backgroundColor: grey[900],
        fontSize: 13
        // lineHeight: "".concat(theme.typography.round(14 / 10), "em")
      }
    },
    MuiIconButton: {
      root: {
        padding: 8,
        "&:hover": {
          backgroundColor: "transparent",
          "@media (hover: none)": {
            backgroundColor: "transparent"
          },
          "&$disabled": {
            backgroundColor: "transparent"
          }
        }
      },
      colorPrimary: {
        "&:hover": {
          backgroundColor: "transparent",
          "@media (hover: none)": {
            backgroundColor: "transparent"
          },
          "&$disabled": {
            backgroundColor: "transparent"
          }
        }
      },
      colorSecondary: {
        "&:hover": {
          backgroundColor: "transparent",
          "@media (hover: none)": {
            backgroundColor: "transparent"
          },
          "&$disabled": {
            backgroundColor: "transparent"
          }
        }
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
  children: oneOfType([array, node, object, string]).isRequired
};

export default CustomMUIThemeProvider;
