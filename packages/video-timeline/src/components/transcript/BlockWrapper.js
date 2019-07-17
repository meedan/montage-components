import React from 'react';
import { EditorBlock } from 'draft-js';
import styled from 'styled-components';
import Timecode from 'react-timecode';

const TimeCodeWrapper = styled.div`
  user-select: none;
  font-family: 'PT Sans Narrow', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

const BlockWrapper = styled.div`
  margin-bottom: 1em;
  position: relative;
`;

export default props => {
  const { block } = props;
  const key = block.getKey();
  const start = block.getData().get('start') || '';

  return (
    <BlockWrapper className="BlockWrapper" key={`W${key}`} data-start={start}>
      <TimeCodeWrapper contentEditable={false}>
        <Timecode time={start} />
      </TimeCodeWrapper>
      <EditorBlock {...props} />
    </BlockWrapper>
  );
};
