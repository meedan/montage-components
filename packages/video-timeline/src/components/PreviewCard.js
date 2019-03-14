import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import grey from '@material-ui/core/colors/grey';

import Typography from '@material-ui/core/Typography';

const PreviewCard = props => {
  const { data } = props;
  console.log(data);

  console.log({ props });

  return (
    <Card square>
      <CardActionArea>
        <CardMedia
          style={{
            width: 400,
            height: 200,
          }}
          image={`http:${data.c_thumbnail_url}`}
        />
        <CardContent>
          <Typography component="p" variant="body2" gutterBottom>
            {data.name}{' '}
            <Typography
              component="span"
              variant="caption"
              style={{ color: grey[500] }}
            >
              {`by ${data.channel_name}`}
            </Typography>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withTheme()(PreviewCard);
