import React, { Component } from "react";
import { bool, func, object } from "prop-types";

import { CircularProgress, Fade, IconButton, Tooltip } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarIcon from "@material-ui/icons/Star";

const styles = () => ({
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -11,
    marginLeft: -11
  }
});

class FavoriteStatus extends Component {
  constructor(props) {
    super(props);
    this.state = { processing: null };
    this.onTriggerFavourite = this.onTriggerFavourite.bind(this);
  }

  onTriggerFavourite() {
    if (this.props.isArchived) return null;
    this.setState({ processing: true });
    this.props.onTriggerFavourite(!this.props.isFavourited, () =>
      this.setState({ processing: false })
    );
    return null;
  }

  render() {
    const { processing } = this.state;
    const { classes, isFavourited } = this.props;
    return (
      <Tooltip
        title={isFavourited ? "Remove from favorites" : "Add to favorites"}
        aria-label={isFavourited ? "Remove from favorites" : "Add to favorites"}
      >
        <IconButton onClick={this.onTriggerFavourite}>
          <Fade in={!processing}>
            {isFavourited ? <StarIcon color="primary" /> : <StarBorderIcon />}
          </Fade>
          {processing && (
            <CircularProgress size={22} className={classes.buttonProgress} />
          )}
        </IconButton>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(FavoriteStatus);

FavoriteStatus.propTypes = {
  classes: object,
  isArchived: bool,
  isFavourited: bool,
  onTriggerFavourite: func.isRequired
};
FavoriteStatus.defaultProps = {
  classes: {},
  isArchived: null,
  isFavourited: null
};
