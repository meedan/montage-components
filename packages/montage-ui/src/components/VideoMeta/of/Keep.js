import {
  array,
  bool,
  func,
  number,
  oneOfType,
  shape,
  string
} from "prop-types";
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
    this.state = { error: null, processing: null };
    this.onTriggerKeep = this.onTriggerKeep.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { videoBackups, videoId } = props;
    const { backups, backupIds } = videoBackups;
    const backupsObj = backups[backupIds.indexOf(videoId)];
    const isError =
      backupsObj && some(backupsObj.locations, { status: "ERROR" });
    return { ...state, error: isError };
  }

  onTriggerKeep() {
    if (this.props.isArchived) return null;
    this.setState({ processing: true });
    this.props.onTriggerKeep(() => this.setState({ processing: false }));
    return null;
  }

  render() {
    const { error, processing } = this.state;
    const { isArchived, videoBackups, videoId } = this.props;
    const { backups, backupIds } = videoBackups;
    const backupsObj = backups[backupIds.indexOf(videoId)];
    const backupsCount = backupsObj
      ? filter(backupsObj.locations, o => {
          return o.status === "OK";
        }).length
      : 0;

    const isKept = backupsObj && backupsObj.locations.length > 0;
    const isVanilla = !isKept && !isArchived && !error && !processing;

    // console.group("KeepStatus");
    // console.log(this.state);
    // console.groupEnd();

    const renderStatus = () => {
      if (!isArchived && processing) {
        return `Synronizing video with Keep…`;
      }
      if (!isArchived && error) {
        return (
          <>
            Sending to Keep failed.{" "}
            <Typography component="span" inline color="primary">
              Retry?
            </Typography>
          </>
        );
      }
      if (backupsCount === 0) {
        return isArchived
          ? `Not synced with Keep`
          : `Save video to Keep locations`;
      }
      return `Saved in ${backupsCount} Keep locations`;
    };

    return (
      <PopupState variant="popover" popupId="keepPopover">
        {popupState => (
          <>
            <ListItem
              component="div"
              button={!isArchived}
              onClick={
                !isArchived && backupsCount > 0 && !processing && !error
                  ? popupState.open
                  : this.onTriggerKeep
              }
              dense
            >
              <ListItemIcon>
                <KeepIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography
                  color={isVanilla ? "primary" : "initial"}
                  variant="body2"
                >
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
  onTriggerKeep: func.isRequired,
  videoId: oneOfType([string, number]).isRequired
};

KeepStatus.defaultProps = {
  isArchived: null,
  videoBackups: {
    videoBackupIds: [],
    videoBackups: []
  }
};
