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
        backgroundColor: grey[800],
        fontSize: mui.typography.pxToRem(13),
        fontWeight: mui.typography.fontWeightRegular
      }
    },
    MuiIconButton: {
      root: {
        padding: 6,
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
    },
    MuiTableCell: {
      root: {
        borderColor: grey[200]
      },
      paddingDense: {
        paddingBottom: 6,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6
      }
    },
    // MuiMenuItem: {
    //   root: {
    //     fontSize: mui.typography.pxToRem(12)
    //   }
    // },
    MuiListItem: {
      // gutters: {
      //   paddingTop: 6,
      //   paddingBottom: 6
      // },
      dense: {
        fontSize: mui.typography.pxToRem(13)
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 40
      }
    },
    MuiListItemText: {
      root: {
        fontSize: mui.typography.pxToRem(14)
        // padding: "0 6px"
      },
      dense: {
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
