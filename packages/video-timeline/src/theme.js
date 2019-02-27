import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    // MuiPopover: {
    //   paper: {
    //     pointerEvents: 'none',
    //   },
    // },
  },
});

export default theme;
