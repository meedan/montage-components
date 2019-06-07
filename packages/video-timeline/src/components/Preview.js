import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import Popover from 'material-ui-popup-state/HoverPopover';
import React from 'react';
import styled from 'styled-components';

import { withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import grey from '@material-ui/core/colors/grey';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Typography from '@material-ui/core/Typography';

const CardMediaDetail = styled.div`
  background: ${grey[900]};
  bottom: 0;
  color: ${grey[200]};
  font-size: 12px;
  padding: 4px 6px;
  position: absolute;
  ${({ isNext }) =>
    isNext
      ? `
    right: 0;
  `
      : ''};
  ${({ isPrev }) =>
    isPrev
      ? `
    left: 0;
  `
      : ''};
`;

function Preview(props) {
  const { data, isNext, isPrev } = props;

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'PreviewPopover',
  });

  const changeTheatre = () => {
    console.log(`Navigate to the video: ${data.theatre_url}`); // TODO: Wire routing
  };

  return (
    <>
      <IconButton
        {...bindHover(popupState)}
        color="secondary"
        onClick={changeTheatre}
      >
        {isPrev ? (
          <KeyboardArrowLeftIcon fontSize="large" />
        ) : (
          <KeyboardArrowRightIcon fontSize="large" />
        )}
      </IconButton>
      <Popover
        PaperProps={{ square: true }}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: isPrev ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: isPrev ? 'left' : 'right',
        }}
        disableRestoreFocus
      >
        <Card square style={{ maxWidth: 240 }}>
          <CardActionArea onClick={changeTheatre}>
            <CardMedia
              style={{
                width: 240,
                height: 135,
              }}
              image={`http:${data.c_thumbnail_url}`}
            />
            <CardMediaDetail isNext={isNext} isPrev={isPrev}>
              {data.pretty_duration}
            </CardMediaDetail>
          </CardActionArea>
          <CardContent>
            <Typography component="p" variant="body2">
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
        </Card>
      </Popover>
    </>
  );
}

export default withTheme(Preview);
