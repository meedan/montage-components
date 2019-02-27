import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';

import Typography from '@material-ui/core/Typography';

const PreviewCard = props => {
  const { data } = props;
  console.log(data);

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          style={{
            width: 400,
            height: 200,
          }}
          image={`http:${data.c_thumbnail_url}`}
        />
        <CardContent>
          <Typography component="p" variant="body2">
            {data.name}
            <br />
            {`by ${data.channel_name}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withTheme()(PreviewCard);
