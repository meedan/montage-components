import { array, bool, string, shape } from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import React, { Component } from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import { KeepIcon, ClipboardIcon } from "@montage/ui/src/components";

class KeepStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { status: null };
  }

  render() {
    const { status } = this.state;
    const {
      isArchived,
      videoBackups,
      videoBackupSettings,
      videoId
    } = this.props;

    // console.group("KeepStatus");
    // console.log(videoBackupSettings);
    // console.groupEnd();

    const { backups, backupIds } = videoBackups;
    const { backupServices, backupServiceIds } = videoBackupSettings;
    const currentMedia = backups[backupIds.indexOf(videoId)];

    const handleClipboardCopy = popupState => {
      popupState.close();
    };

    const triggerSave = () => {
      this.setState({ status: "processing" });
      setTimeout(() => this.setState({ status: "error" }), 1000);
    };

    if (status === "processing") {
      return (
        <ListItem dense>
          <ListItemIcon>
            <KeepIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography inline>Sending video to Keep locations…</Typography>
          </ListItemText>
        </ListItem>
      );
    }
    if (status === "error") {
      return (
        <ListItem
          button={!isArchived}
          onClick={
            !isArchived ? () => this.setState({ status: "success" }) : null
          }
          dense
        >
          <ListItemIcon>
            <KeepIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>
              Sending to Keep failed.{" "}
              {!isArchived ? (
                <Typography component="span" inline color="primary">
                  Retry?
                </Typography>
              ) : null}
            </Typography>
          </ListItemText>
        </ListItem>
      );
    }
    if (status === "success") {
      return (
        <>
          <PopupState variant="popover" popupId="demoPopover">
            {popupState => (
              <>
                <ListItem button {...bindTrigger(popupState)} dense>
                  <ListItemIcon>
                    <KeepIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography>
                      Safely stored in {currentMedia.locations.length} Keep
                      locations
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                  }}
                >
                  <List dense>
                    {currentMedia.locations.map(location => {
                      const { serviceId, url } = location;
                      if (location) {
                        return (
                          <CopyToClipboard
                            text={location.url}
                            key={url}
                            onCopy={() => handleClipboardCopy(popupState)}
                          >
                            <Tooltip title="Copy to Clipboard">
                              <ListItem button={url !== null || undefined}>
                                <ListItemIcon>
                                  <ClipboardIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    backupServices[
                                      backupServiceIds.indexOf(serviceId)
                                    ].name
                                  }
                                />
                              </ListItem>
                            </Tooltip>
                          </CopyToClipboard>
                        );
                      }
                      return null;
                    })}
                  </List>
                </Popover>
              </>
            )}
          </PopupState>
        </>
      );
    }
    return (
      <ListItem
        button={!isArchived}
        onClick={!isArchived ? triggerSave : null}
        dense
      >
        <ListItemIcon>
          <KeepIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography inline color={!isArchived ? "primary" : "default"}>
            {!isArchived
              ? "Save video to Keep locations"
              : "This video has not been saved to Keep"}
          </Typography>
        </ListItemText>
      </ListItem>
    );
  }
}

export default KeepStatus;

KeepStatus.propTypes = {
  isArchived: bool,
  videoBackups: shape({
    videoBackupIds: array,
    videoBackups: array
  }),
  videoBackupSettings: shape({
    backupServices: array.isRequired,
    backupServiceIds: array.isRequired
  }).isRequired,
  videoId: string.isRequired
};

KeepStatus.defaultProps = {
  isArchived: null,
  videoBackups: {
    videoBackupIds: [],
    videoBackups: []
  }
};
