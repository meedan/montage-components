import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';
import ArchiveIcon from '@material-ui/icons/Archive';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import IconicButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import UnarchiveIcon from '@material-ui/icons/Unarchive';

const styles = theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -11,
    marginLeft: -11,
  },
});

const ArchiveMenuItem = props => {
  const { archived_at } = props.data.gdVideoData;

  const { classes } = props;
  const [isProcessing, setProcessingStatus] = useState(false);

  const handleArchiveStatusChange = () => {
    setProcessingStatus(true);
    console.group('handleArchiveStatusChange()');
    console.log(`new archive status: ${!archived_at}`); // TODO: wire in API callbacks
    console.groupEnd();
    setTimeout(() => setProcessingStatus(false), 1000);
  };

  return (
    <Tooltip
      title={archived_at ? 'Unarchive' : 'Archive'}
      aria-label={archived_at ? 'Unarchive' : 'Archive'}
    >
      <IconicButton onClick={handleArchiveStatusChange}>
        <Fade in={!isProcessing}>
          {archived_at ? <UnarchiveIcon color="primary" /> : <ArchiveIcon />}
        </Fade>
        {isProcessing && (
          <CircularProgress size={22} className={classes.buttonProgress} />
        )}
      </IconicButton>
    </Tooltip>
  );
};

export default withStyles(styles)(ArchiveMenuItem);