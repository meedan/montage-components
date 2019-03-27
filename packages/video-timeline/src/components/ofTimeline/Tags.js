import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import TableBlock from './TableBlock';
import TableSection from './TableSection';

function TimelineTags(props) {
  const { data } = props;
  const { videoTags } = data;
  console.log({ data });
  return (
    <TableSection
      plain={videoTags ? videoTags.length > 0 : false}
      title="Tags"
      actions={
        <>
          <Tooltip title="Play Tags">
            <IconButton>
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New Tag">
            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      {videoTags
        ? videoTags.map((tag, i) => {
            const { project_tag } = tag;
            console.log({ tag });
            return (
              <TableBlock
                key={tag.id}
                plain={i < videoTags.length - 1}
                leftColContent={
                  <Typography
                    color="textSecondary"
                    noWrap
                    style={{ width: '160px' }}
                    variant="body2"
                  >
                    {project_tag.name}
                  </Typography>
                }
                rightCol="Tags"
              />
            );
          })
        : null}
    </TableSection>
  );
}

export default TimelineTags;
