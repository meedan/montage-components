import {
  usePopupState,
  bindTrigger,
  bindHover,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { withSnackbar } from 'notistack';
import * as React from 'react';
import { includes } from 'lodash';

import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from 'material-ui-popup-state/HoverMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

const ParentPopupState = React.createContext(null);

const MoreMenu = props => {
  const { id } = props.data.gdVideoData;
  const { collections } = props.data.project;
  const { in_collections } = props.data.gdVideoData;

  const addToCollection = (collectionId, collectionName) => {
    console.group('addToCollection()'); // TODO: make the API call here
    console.log(`mediaId: ${id}`);
    console.log(`collectionId: ${collectionId}`);
    console.groupEnd();
    props.enqueueSnackbar(`Video added to ${collectionName}`);
  };
  const removeFromCollection = (collectionId, collectionName) => {
    console.group('removeFromCollection()'); // TODO: make the API call here
    console.log(`mediaId: ${id}`);
    console.log(`collectionId: ${collectionId}`);
    console.groupEnd();
    props.enqueueSnackbar(`Video removed from ${collectionName}`);
  };

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
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          getContentAnchorEl={null}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Submenu popupId="CollectionOptions" title="Add to collection" dense>
            {collections.map(collection => {
              const { name, id } = collection;
              const belongsToCollection = includes(in_collections, id);
              return (
                <MenuItem
                  onClick={() =>
                    belongsToCollection
                      ? removeFromCollection(id, name)
                      : addToCollection(id, name)
                  }
                  key={id}
                >
                  <ListItemIcon>
                    {belongsToCollection ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              );
            })}
            <Divider />
            <MenuItem
            // onClick={popupState.close}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText>New collection…</ListItemText>
            </MenuItem>
          </Submenu>
          <MenuItem onClick={popupState.close}>Manage duplicates</MenuItem>
          <Divider />
          <MenuItem onClick={popupState.close}>Remove from Montage</MenuItem>
        </Menu>
      </ParentPopupState.Provider>
    </>
  );
};

export default withSnackbar(MoreMenu);

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
          MenuListProps={{ dense: true }}
          {...props}
        >
          {children}
        </Menu>
      </ParentPopupState.Provider>
    );
  }
);
