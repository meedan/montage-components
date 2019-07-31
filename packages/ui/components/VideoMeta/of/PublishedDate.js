import { parseISO, format } from 'date-fns';
import { string } from 'prop-types';
import React from 'react';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';

import PublishIcon from '@material-ui/icons/Publish';

const PublishedDateListItem = props => {
  const { pubDate } = props;
  return (
    <ListItem component="div" dense>
      <ListItemIcon>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText>
        <Typography variant="body2">
          Published{' '}
          {format(parseISO(pubDate), 'd MMMM YYYY', {
            awareOfUnicodeTokens: true,
          })}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

export default PublishedDateListItem;

PublishedDateListItem.propTypes = {
  pubDate: string.isRequired,
};
