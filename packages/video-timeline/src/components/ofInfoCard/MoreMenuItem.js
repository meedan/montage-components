import {
  usePopupState,
  bindHover,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { includes } from 'lodash';

import Button from '@material-ui/core/Button';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from 'material-ui-popup-state/HoverMenu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

const ParentPopupState = React.createContext(null);

const MoreMenuItem = props => {
  const { id } = props.data.gdVideoData;
  const { collections } = props.data.project;
  const { in_collections } = props.data.gdVideoData;

  const [isAddingCollection, setIsAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const popupState = usePopupState({
    popupId: 'MoreMenuItem',
    variant: 'popover',
  });

  const handleCollectionDrop = () => {
    setIsAddingCollection(false);
  };
  const handleCreateCollection = () => {
    setIsAddingCollection(false);
    console.group('handleCreateCollection()'); // TODO: make the API call here
    console.log(`collectionName: ${newCollectionName}`);
    console.groupEnd();
    props.enqueueSnackbar(`${newCollectionName} collection created`);
  };

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

  return (
    <>
      <IconButton {...bindHover(popupState)}>
        <MoreVertIcon />
      </IconButton>
      <ParentPopupState.Provider value={popupState}>
        <Menu
          {...bindMenu(popupState)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          disableAutoFocusItem
          getContentAnchorEl={null}
          open={isAddingCollection ? true : popupState.isOpen}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Submenu
            dense
            popupId="CollectionOptions"
            title="Add to collection"
            open={isAddingCollection ? true : popupState._childPopupState}
          >
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
                      <CheckBoxIcon fontSize="small" />
                    ) : (
                      <CheckBoxOutlineBlankIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              );
            })}
            <Divider />
            <ListItem
              button={!isAddingCollection}
              onClick={
                !isAddingCollection ? () => setIsAddingCollection(true) : null
              }
              style={{ height: 'auto' }}
            >
              <ListItemText>
                {isAddingCollection ? (
                  <Grid container direction="column" spacing={8} wrap="nowrap">
                    <Grid item>
                      <TextField
                        autoFocus
                        fullWidth
                        id="newCollectionName"
                        inputProps={{
                          autocomplete: 'off',
                        }}
                        label="New collection…"
                        placeholder="Enter name"
                        required
                        type="text"
                        onChange={e =>
                          setNewCollectionName(e.currentTarget.value)
                        }
                      />
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        direction="row-reverse"
                        justify="space-between"
                      >
                        <Button
                          color="primary"
                          disabled={newCollectionName.length === 0}
                          mini
                          onClick={handleCreateCollection}
                          size="small"
                        >
                          Create
                        </Button>
                        <Button
                          mini
                          onClick={handleCollectionDrop}
                          size="small"
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  'New collection…'
                )}
              </ListItemText>
            </ListItem>
          </Submenu>
          <MenuItem onClick={popupState.close}>Manage duplicates</MenuItem>
          <Divider />
          <MenuItem onClick={popupState.close}>Remove from Montage</MenuItem>
        </Menu>
      </ParentPopupState.Provider>
    </>
  );
};

export default withSnackbar(MoreMenuItem);

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
          {...props}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          className={classes.menu}
          disableAutoFocusItem
          getContentAnchorEl={null}
          MenuListProps={{ dense: true }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {console.log('— FURTHER DOWN —')}
          {console.log({ popupState })}
          {children}
        </Menu>
      </ParentPopupState.Provider>
    );
  }
);
