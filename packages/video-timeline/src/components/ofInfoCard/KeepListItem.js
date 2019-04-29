import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import KeepIcon from '@montage/ui/src/components/icons/KeepIcon';
import CopyToClipboardIcon from '@montage/ui/src/components/icons/CopyToClipboardIcon';

class KeepListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { status: null };
  }

  render() {
    const { status } = this.state;
    const { data } = this.props;

    const { id } = data.gdVideoData;
    const { archived_at } = data.gdVideoData;
    const { services, serviceIds } = data.keep.settings;
    const { media, mediaIds } = data.keep.backups;
    const currentMedia = media[mediaIds.indexOf(id)];
    const isArchived = archived_at !== null && archived_at !== undefined;

    const handleClipboardCopy = popupState => {
      popupState.close();
      this.props.enqueueSnackbar('URL copied to clipboard');
    };

    const triggerSave = () => {
      this.setState({ status: 'processing' });
      setTimeout(() => this.setState({ status: 'error' }), 1000);
    };

    if (status === 'processing') {
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
    } else if (status === 'error') {
      return (
        <ListItem
          button={!isArchived ? true : false}
          onClick={
            !isArchived ? () => this.setState({ status: 'success' }) : null
          }
          dense
        >
          <ListItemIcon>
            <KeepIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>
              Sending to Keep failed.{' '}
              {!isArchived ? (
                <Typography component="span" inline color="primary">
                  Retry?
                </Typography>
              ) : null}
            </Typography>
          </ListItemText>
        </ListItem>
      );
    } else if (status === 'success') {
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
                            onCopy={() => handleClipboardCopy(popupState)}
                          >
                            <ListItem button={url !== null || undefined}>
                              <ListItemIcon>
                                <Tooltip title="Copy to Clipboard">
                                  <CopyToClipboardIcon />
                                </Tooltip>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  services[serviceIds.indexOf(serviceId)].name
                                }
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
            )}
          </PopupState>
        </>
      );
    } else {
      return (
        <ListItem
          button={!isArchived ? true : false}
          onClick={!isArchived ? triggerSave : null}
          dense
        >
          <ListItemIcon>
            <KeepIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography inline color={!isArchived ? 'primary' : 'default'}>
              {!isArchived
                ? 'Save video to Keep locations'
                : 'This video has not been saved to Keep'}
            </Typography>
          </ListItemText>
        </ListItem>
      );
    }
  }
}

export default withSnackbar(KeepListItem);
