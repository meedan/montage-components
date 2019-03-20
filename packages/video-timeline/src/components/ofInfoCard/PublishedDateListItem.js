import React from 'react';
import { parseISO, format } from 'date-fns';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PublishIcon from '@material-ui/icons/Publish';

const PublishedDateListItem = props => {
  const { data } = props;
  return (
    <ListItem>
      <ListItemIcon>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText
        primary={`Published ${format(
          parseISO(data.ytVideoData.snippet.publishedAt),
          'd MMMM YYYY',
          { awareOfUnicodeTokens: true }
        )}`}
      />
    </ListItem>
  );
};

export default PublishedDateListItem;
