import styled from 'styled-components';

import grey from '@material-ui/core/colors/grey';

const TranscriptText = styled.div`
  flex: 0 0 ${({ stretch }) => (stretch ? '100%' : '50%')};
  padding-bottom: 10px;
  padding-top: 10px;
  &:first-child {
    padding-right: 20px;
  }
  &:last-child {
    border-left: 1px solid ${grey[200]};
    padding-left: 20px;
  }
`;

export default TranscriptText;
