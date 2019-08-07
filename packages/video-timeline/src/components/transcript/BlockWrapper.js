import React from 'react';
import { EditorBlock } from 'draft-js';
import styled from 'styled-components';
import Timecode from 'react-timecode';

import { formatSeconds } from '@montage/ui';

import Tooltip from '@material-ui/core/Tooltip';
import grey from '@material-ui/core/colors/grey';

const TimeCodeWrapper = styled.div`
  background: ${grey[200]};
  border-radius: 20px;
  height: 10px;
  left: 0;
  position: absolute;
  top: -1em;
  user-select: none;
  width: 10px;
`;

const BlockWrapper = styled.div`
  margin-bottom: 2em;
`;

export default props => {
  const { block } = props;
  const key = block.getKey();
  const start = block.getData().get('start') || '';

  return (
    <BlockWrapper className="BlockWrapper" key={`W${key}`} data-start={start}>
      <Tooltip title={formatSeconds(start)}>
        <TimeCodeWrapper contentEditable={false}>
          <Timecode time={start} />
        </TimeCodeWrapper>
      </Tooltip>
      <EditorBlock {...props} />
    </BlockWrapper>
  );
};
