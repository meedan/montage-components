import {
  bindHover,
  bindMenu,
  bindTrigger,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import * as React from 'react';

import ChevronRight from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from 'material-ui-popup-state/HoverMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

const ParentPopupState = React.createContext(null);

const MoreMenu = () => {
  const popupState = usePopupState({ popupId: 'MoreMenu', variant: 'popover' });
  return (
    <>
      <IconButton {...bindTrigger(popupState)}>
        <Tooltip title="More options…" aria-label="More options…">
          <MoreVertIcon />
        </Tooltip>
      </IconButton>
      <ParentPopupState.Provider value={popupState}>
        <Menu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          getContentAnchorEl={null}
        >
          <Submenu popupId="CollectionOptions" title="Add to collection">
            <MenuItem onClick={popupState.close}>Cheesecake</MenuItem>
            <MenuItem onClick={popupState.close}>Cheesedeath</MenuItem>
          </Submenu>
          <MenuItem onClick={popupState.close}>Manage duplicates</MenuItem>
          <Divider />
          <MenuItem onClick={popupState.close}>Remove from Montage</MenuItem>
        </Menu>
      </ParentPopupState.Provider>
    </>
  );
};

export default MoreMenu;

const submenuStyles = theme => ({
  menu: {
    top: -theme.spacing.unit,
  },
  title: {
    flexGrow: 1,
  },
  moreArrow: {
    marginRight: theme.spacing.unit * -1,
  },
});

const Submenu = withStyles(submenuStyles)(
  ({ classes, title, popupId, children, ...props }) => {
    const parentPopupState = React.useContext(ParentPopupState);
    const popupState = usePopupState({
      popupId,
      variant: 'popover',
      parentPopupState,
    });
    return (
      <ParentPopupState.Provider value={popupState}>
        <MenuItem {...bindHover(popupState)} selected={popupState.isOpen} dense>
          <ListItemText>{title}</ListItemText>
          <ChevronRight className={classes.moreArrow} />
        </MenuItem>
        <Menu
          {...bindMenu(popupState)}
          className={classes.menu}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          getContentAnchorEl={null}
          {...props}
        >
          {children}
        </Menu>
      </ParentPopupState.Provider>
    );
  }
);
