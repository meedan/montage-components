import React from 'react';
import { EditorBlock } from 'draft-js';
import styled from 'styled-components';

import { formatSeconds } from '@montage/ui';

import Tooltip from '@material-ui/core/Tooltip';
import grey from '@material-ui/core/colors/grey';

const TimestampMarker = styled.div`
  background: ${grey[200]};
  border-radius: 20px;
  height: 10px;
  left: -20px;
  position: absolute;
  top: 0;
  transform: translate(-50%, 50%);
  user-select: none;
  width: 10px;
`;

const BlockWrapper = styled.div`
  margin-bottom: 2em;
  position: relative;
`;

export default props => {
  const { block } = props;
  const key = block.getKey();
  const start = block.getData().get('start') || '';

  return (
    <BlockWrapper className="BlockWrapper" key={`W${key}`} data-start={start}>
      <Tooltip title={formatSeconds(start / 1000)}>
        <TimestampMarker contentEditable={false}></TimestampMarker>
      </Tooltip>
      <EditorBlock {...props} />
    </BlockWrapper>
  );
};
