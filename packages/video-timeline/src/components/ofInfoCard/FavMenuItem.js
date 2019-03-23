import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import IconicButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -11,
    marginLeft: -11,
  },
});

const FavMenuItem = props => {
  const { favourited } = props.data.gdVideoData;
  const { classes } = props;
  const [isProcessing, setProcessingStatus] = useState(false);

  const handleFavStatusChange = () => {
    setProcessingStatus(true);
    console.group('handleFavStatusChange()');
    console.log(`new fav status: ${!favourited}`); // TODO: wire in API callbacks
    console.groupEnd();
    setTimeout(() => setProcessingStatus(false), 1000);
  };

  const displayFavStatusGraphic = () => {
    return favourited ? <StarIcon color="primary" /> : <StarBorderIcon />;
  };

  return (
    <Tooltip title="Add to Favorites" aria-label="Add to Favorites">
      <IconicButton onClick={handleFavStatusChange}>
        <Fade in={!isProcessing}>{displayFavStatusGraphic()}</Fade>
        {isProcessing && (
          <Fade in={isProcessing}>
            <CircularProgress size={22} className={classes.buttonProgress} />
          </Fade>
        )}
      </IconicButton>
    </Tooltip>
  );
};

export default withStyles(styles)(FavMenuItem);
