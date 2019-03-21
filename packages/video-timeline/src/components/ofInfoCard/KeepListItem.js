import React, { useState } from 'react';
import { withSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import KeepIcon from '@montage/ui/src/components/icons/KeepIcon';
import CopyToClipboardIcon from '@montage/ui/src/components/icons/CopyToClipboardIcon';

const KeepListItem = props => {
  const { data } = props;
  const { id } = data.gdVideoData;
  const { services, serviceIds } = data.newData.keep.settings;
  const { media, mediaIds } = data.newData.keep.backups;
  const currentMedia = media[mediaIds.indexOf(id)];

  const [status, setStatus] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleShowDetails = event => setAnchorEl(event.currentTarget);
  const handleHideDetails = () => setAnchorEl(null);
  const handleClipboardCopy = () => {
    handleHideDetails();
    props.enqueueSnackbar('URL copied to clipboard');
  };

  const triggerSave = () => {
    setStatus('processing');
    setTimeout(() => setStatus('error'), 1000);
  };

  if (status === 'processing') {
    return (
      <ListItem>
        <ListItemIcon>
          <KeepIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography inline>Sending video to Keep locations…</Typography>
        </ListItemText>
      </ListItem>
    );
  } else if (status === 'error') {
    return (
      <ListItem button onClick={() => setStatus('success')}>
        <ListItemIcon>
          <KeepIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography>
            Sending to Keep failed.{' '}
            <Typography inline color="primary">
              Retry?
            </Typography>
          </Typography>
        </ListItemText>
      </ListItem>
    );
  } else if (status === 'success') {
    return (
      <>
        <ListItem button onClick={handleShowDetails}>
          <ListItemIcon>
            <KeepIcon />
          </ListItemIcon>
          <ListItemText>
            Safely stored in {currentMedia.locations.length} Keep locations
          </ListItemText>
        </ListItem>
        <Popover
          anchorEl={anchorEl}
          id="KeepLocationsPopover"
          onClose={handleHideDetails}
          open={open}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
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
                    onCopy={handleClipboardCopy}
                  >
                    <ListItem button={url !== null || undefined}>
                      <ListItemIcon>
                        <Tooltip title="Copy to Clipboard">
                          <CopyToClipboardIcon />
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText
                        primary={services[serviceIds.indexOf(serviceId)].name}
                      />
                    </ListItem>
                  </CopyToClipboard>
                );
              }
              return null;
            })}
          </List>
        </Popover>
      </>
    );
  } else {
    return (
      <ListItem button onClick={triggerSave}>
        <ListItemIcon>
          <KeepIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography inline color="primary">
            Save video to Keep locations
          </Typography>
        </ListItemText>
      </ListItem>
    );
  }
};

export default withSnackbar(KeepListItem);
