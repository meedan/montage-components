import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { array, node, oneOfType, object, string } from "prop-types";
import grey from "@material-ui/core/colors/grey";
import React from "react";

import { color } from "@montage/ui/src/config";

const theme = createMuiTheme();

const customTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  overrides: {
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
    MuiMenuItem: {
      root: {
        fontSize: theme.typography.pxToRem(14)
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: grey[900],
        fontSize: theme.typography.pxToRem(13)
      }
    },
    MuiListItem: {
      gutters: {
        paddingTop: 6,
        paddingBottom: 6
      },
      dense: {
        fontSize: theme.typography.pxToRem(13)
      }
    },
    MuiListItemIcon: {
      root: {
        marginRight: 6
      }
    },
    MuiListItemText: {
      root: {
        fontSize: theme.typography.pxToRem(14),
        padding: "0 6px"
      },
      dense: {
        fontSize: theme.typography.pxToRem(13)
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
  }
});

const CustomMUIThemeProvider = ({ children }) => {
  return <MuiThemeProvider theme={customTheme}>{children}</MuiThemeProvider>;
};

CustomMUIThemeProvider.propTypes = {
  children: oneOfType([array, node, object, string]).isRequired
};

export default CustomMUIThemeProvider;
