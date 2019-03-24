import React from 'react';
import { parseISO, format } from 'date-fns';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PublishIcon from '@material-ui/icons/Publish';

const PublishedDateListItem = props => {
  const { data } = props;
  return (
    <ListItem component="div">
      <ListItemIcon>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText>
        <Typography>
          Published{' '}
          {format(
            parseISO(data.ytVideoData.snippet.publishedAt),
            'd MMMM YYYY',
            { awareOfUnicodeTokens: true }
          )}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

export default PublishedDateListItem;
