import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

import Typography from '@material-ui/core/Typography';



const PreviewCard = props => {
  const { data } = props;

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          style={{
            width: data.ytVideoData.snippet.thumbnails.medium.width,
            height: data.ytVideoData.snippet.thumbnails.medium.height,
          }}
          image={data.ytVideoData.snippet.thumbnails.default.url}
        />
        <CardContent>
          <Typography component="p" variant="body2">
            Previous video description
            { /* data.ytVideoData.snippet.description */ }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};


export default withTheme()(PreviewCard);
