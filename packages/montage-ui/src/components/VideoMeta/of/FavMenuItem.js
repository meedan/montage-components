import React, { Component } from "react";
import { bool, object } from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import IconicButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";
import Tooltip from "@material-ui/core/Tooltip";

const styles = () => ({
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -11,
    marginLeft: -11
  }
});

class FavMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false
    };
  }

  render() {
    const { classes, favourited } = this.props;
    const { isProcessing } = this.state;

    const handleFavStatusChange = () => {
      this.setState({ isProcessing: true });
      console.group("handleFavStatusChange()");
      console.log(`new fav status: ${!favourited}`); // TODO: wire in API callbacks
      console.groupEnd();
      setTimeout(() => this.setState({ isProcessing: false }), 1000);
    };

    return (
      <Tooltip
        title={favourited ? "Remove from favorites" : "Add to favorites"}
        aria-label={favourited ? "Remove from favorites" : "Add to favorites"}
      >
        <IconicButton onClick={handleFavStatusChange}>
          <Fade in={!isProcessing}>
            {favourited ? <StarIcon color="primary" /> : <StarBorderIcon />}
          </Fade>
          {isProcessing && (
            <CircularProgress size={22} className={classes.buttonProgress} />
          )}
        </IconicButton>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(FavMenuItem);

FavMenuItem.propTypes = {
  favourited: bool,
  classes: object
};
FavMenuItem.defaultProps = {
  favourited: null,
  classes: {}
};
