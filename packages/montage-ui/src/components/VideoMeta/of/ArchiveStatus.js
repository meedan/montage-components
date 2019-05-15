import React, { Component } from "react";
import { bool, func, object } from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import ArchiveIcon from "@material-ui/icons/Archive";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import IconicButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const styles = () => ({
  buttonProgress: {
    left: "50%",
    marginLeft: -11,
    marginTop: -11,
    position: "absolute",
    top: "50%"
  }
});

class ArchiveStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { processing: null };
    this.onTriggerArchive = this.onTriggerArchive.bind(this);
  }

  onTriggerArchive() {
    if (this.props.isArchived) return null;
    this.setState({ processing: true });
    this.props.onTriggerArchive(!this.props.isArchived, () =>
      this.setState({ processing: false })
    );
    return null;
  }

  render() {
    const { processing } = this.state;
    const { classes, isArchived } = this.props;
    return (
      <Tooltip
        title={isArchived ? "Unarchive" : "Archive"}
        aria-label={isArchived ? "Unarchive" : "Archive"}
      >
        <IconicButton onClick={this.onTriggerArchive}>
          <Fade in={!processing}>
            {isArchived ? (
              <ArchiveIcon color="primary" />
            ) : (
              <ArchiveOutlinedIcon />
            )}
          </Fade>
          {processing && (
            <CircularProgress size={22} className={classes.buttonProgress} />
          )}
        </IconicButton>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(ArchiveStatus);

ArchiveStatus.propTypes = {
  onTriggerArchive: func.isRequired,
  classes: object,
  isArchived: bool
};
ArchiveStatus.defaultProps = {
  classes: {},
  isArchived: null
};
