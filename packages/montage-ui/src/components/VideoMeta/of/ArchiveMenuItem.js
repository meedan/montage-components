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

class ArchiveMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { processing: null };
    this.onArchiveClick = this.onArchiveClick.bind(this);
  }

  onArchiveClick() {
    this.setState({ processing: true });
    this.props.onArchiveClick(!this.props.isArchived, () =>
      this.setState({ processing: false })
    );
  }

  render() {
    const { processing } = this.state;
    const { classes, isArchived } = this.props;
    return (
      <Tooltip
        title={isArchived ? "Unarchive" : "Archive"}
        aria-label={isArchived ? "Unarchive" : "Archive"}
      >
        <IconicButton onClick={this.onArchiveClick}>
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

export default withStyles(styles)(ArchiveMenuItem);

ArchiveMenuItem.propTypes = {
  handleArchive: func.isRequired,
  classes: object,
  isArchived: bool
};
ArchiveMenuItem.defaultProps = {
  classes: {},
  isArchived: null
};
