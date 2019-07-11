import React from 'react';
import { EditorBlock } from 'draft-js';
import styled from 'styled-components';

import Speaker from './Speaker';

const BlockWrapper = styled.div`
  margin-bottom: 1em;
  position: relative;
`;

export default props => {
  const { block } = props;
  const key = block.getKey();
  const speaker = block.getData().get('speaker') || '';
  const start = block.getData().get('start') || '';

  return (
    <BlockWrapper className="BlockWrapper" key={`W${key}`} data-start={start}>
      <Speaker contentEditable={false}>
        {speaker}: {start}
      </Speaker>
      <EditorBlock {...props} />
    </BlockWrapper>
  );
};
