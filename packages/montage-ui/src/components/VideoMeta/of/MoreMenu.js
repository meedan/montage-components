import { array, bool, func, number, oneOfType, string } from "prop-types";
import { includes } from "lodash";
import Menu from "material-ui-popup-state/HoverMenu";
import PopupState, { bindHover, bindMenu } from "material-ui-popup-state";
import React, { Component } from "react";

import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import withStyles from "@material-ui/core/styles/withStyles";

const ParentPopupState = React.createContext(null);

const submenuStyles = theme => ({
  menu: {
    top: -theme.spacing.unit
  },
  moreArrow: {
    marginRight: theme.spacing.unit * -1
  }
});

const Submenu = withStyles(submenuStyles)(
  ({ classes, title, popupId, children, ...props }) => (
    <ParentPopupState.Consumer>
      {parentPopupState => (
        <PopupState
          variant="popover"
          popupId={popupId}
          parentPopupState={parentPopupState}
        >
          {popupState => (
            <ParentPopupState.Provider value={popupState}>
              <MenuItem
                {...bindHover(popupState)}
                dense
                selected={popupState.isOpen}
              >
                <ListItemText>{title}</ListItemText>
                <ChevronRight className={classes.moreArrow} />
              </MenuItem>
              <Menu
                {...bindMenu(popupState)}
                {...props}
                // disableAutoFocusItem
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                className={classes.menu}
                getContentAnchorEl={null}
                MenuListProps={{ dense: true }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {children}
              </Menu>
            </ParentPopupState.Provider>
          )}
        </PopupState>
      )}
    </ParentPopupState.Consumer>
  )
);

class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { status: null };
    this.addTo = this.addTo.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onManageDupes = this.onManageDupes.bind(this);
    this.removeFrom = this.removeFrom.bind(this);
  }

  onManageDupes() {
    console.log("onManageDupes()");
  }

  onDelete() {
    console.log("onDelete()");
  }

  removeFrom(id) {
    console.log("onDelete()");
    const { inCollections } = this.props;
    const i = inCollections.indexOf(id);
    if (i > -1) {
      inCollections.splice(i, 1);
      this.props.onUpdateCollections(inCollections);
    }
  }

  addTo(id) {
    console.log("onDelete()");
    const { inCollections } = this.props;
    const newArr = [...inCollections, id];
    this.props.onUpdateCollections(newArr);
  }

  render() {
    const { isArchived, collections, inCollections } = this.props;
    const { status } = this.state;

    return (
      <PopupState variant="popover" popupId="moreMenu">
        {popupState => (
          <>
            <IconButton {...bindHover(popupState)}>
              <MoreVertIcon />
            </IconButton>
            <ParentPopupState.Provider value={popupState}>
              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                disableAutoFocusItem
                getContentAnchorEl={null}
                open={status === "adding" ? true : popupState.isOpen}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                {!isArchived
                  ? [
                    <Submenu
                      dense
                      disableAutoFocusItem
                      open={
                          status === "adding"
                            ? true
                            : popupState._childPopupState
                        }
                      popupId="addToCollection"
                      title="Add to collection…"
                    >
                      {collections && collections.length > 0
                          ? collections.map(collection => {
                              const { name, id } = collection;
                              const isCollected = includes(inCollections, id);
                              return (
                                <MenuItem
                                  key={id}
                                  onClick={() =>
                                    isCollected
                                      ? this.removeFrom(id)
                                      : this.addTo(id)
                                  }
                                >
                                  <ListItemIcon>
                                    {isCollected ? (
                                      <CheckBoxIcon fontSize="small" />
                                    ) : (
                                      <CheckBoxOutlineBlankIcon fontSize="small" />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText>{name}</ListItemText>
                                </MenuItem>
                              );
                            })
                          : null}
                      {collections && collections.length > 0 ? (
                        <Divider />
                        ) : null}
                      <MenuItem>
                        <ListItemText>New Collection</ListItemText>
                      </MenuItem>
                    </Submenu>,
                    <MenuItem onClick={this.onManageDupes} dense>
                      <ListItemText>Manage duplicates</ListItemText>
                    </MenuItem>,
                    <Divider />
                    ]
                  : null}
                <MenuItem onClick={this.onDelete} dense>
                  <ListItemText>Remove from Library</ListItemText>
                </MenuItem>
              </Menu>
            </ParentPopupState.Provider>
          </>
        )}
      </PopupState>
    );
  }
}
export default MoreMenu;

MoreMenu.propTypes = {
  // videoId: oneOfType([number, string]).isRequired
  collections: array,
  inCollections: array,
  isArchived: bool,
  onTriggerDelete: func.isRequired,
  onTriggerDuplicates: func.isRequired,
  onUpdateCollections: func.isRequired
};

MoreMenu.defaultProps = {
  collections: [],
  inCollections: [],
  isArchived: false
};
