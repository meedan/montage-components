import { array, bool, string, shape } from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { filter, some } from "lodash";
import PopupState, { bindPopover } from "material-ui-popup-state";
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

  static getDerivedStateFromProps(props, state) {
    const { videoBackups, videoId } = props;
    const { backups, backupIds } = videoBackups;
    const backupsObj = backups[backupIds.indexOf(videoId)];
    const isError =
      backupsObj && some(backupsObj.locations, { status: "ERROR" });
    return { ...state, status: isError ? "error" : null };
  }

  render() {
    const { status } = this.state;
    const { isArchived, videoBackups, videoId } = this.props;
    const { backups, backupIds } = videoBackups;
    const backupsObj = backups[backupIds.indexOf(videoId)];
    const backupsCount = backupsObj
      ? filter(backupsObj.locations, o => {
          return o.status === "OK";
        }).length
      : 0;

    const isKept = backupsObj && backupsObj.locations.length > 0;
    const isVanilla = !isKept && !isArchived && !status;

    // console.group("KeepStatus");
    // console.log(this.state);
    // console.groupEnd();

    const onTriggerSave = () => {
      if (isArchived) return null;
      if (status === "error") {
        console.log("onRetry()");
      } else {
        console.log("onSave()");
        this.setState({ status: "processing" });
      }
      return null;
      //   this.setState({ status: "processing" });
      //   setTimeout(() => this.setState({ status: "error" }), 1000);
    };

    const renderStatus = () => {
      if (backupsCount === 0) {
        return isArchived
          ? `This video has not been synced with Keep`
          : `Save video to Keep locations`;
      }
      if (backupsCount > 0) {
        if (isArchived) {
          return `Safely stored in ${backupsCount} Keep locations`;
        }
        if (status) {
          if (status === "processing") {
            return `Synronizing video with Keep…`;
          }
          return (
            <>
              Sending to Keep failed.{" "}
              <Typography component="span" inline color="primary">
                Retry?
              </Typography>
            </>
          );
        }
      }
      return `Safely stored in ${backupsCount} Keep locations`;
    };

    console.log(this.state.status);

    return (
      <PopupState variant="popover" popupId="keepPopover">
        {popupState => (
          <>
            <ListItem
              button={!isArchived}
              dense
              onClick={
                backupsCount > 0 && !status ? popupState.open : onTriggerSave
              }
            >
              <ListItemIcon>
                <KeepIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography color={isVanilla ? "primary" : "default"}>
                  {renderStatus()}
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
                {backupsObj
                  ? backupsObj.locations.map(location => {
                      if (!location || location.status === "ERROR") return null;
                      const { url } = location;
                      return (
                        <CopyToClipboard
                          key={url}
                          onCopy={popupState.close}
                          text={url}
                        >
                          <Tooltip title="Copy to Clipboard">
                            <ListItem button={url !== null || undefined}>
                              <ListItemIcon>
                                <ClipboardIcon />
                              </ListItemIcon>
                              <ListItemText>
                                <Typography
                                  noWrap
                                  style={{ maxWidth: "160px" }}
                                  variant="body2"
                                >
                                  {url.replace(/https:\/\//g, "")}
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          </Tooltip>
                        </CopyToClipboard>
                      );
                    })
                  : null}
              </List>
            </Popover>
          </>
        )}
      </PopupState>
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
