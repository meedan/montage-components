import styled from 'styled-components';

const TranscriptText = styled.div`
  flex: 0 0 ${({ stretch }) => (stretch ? '100%' : '50%')};
  &:first-child {
    padding-right: 20px;
  }
  &:last-child {
    padding-left: 20px;
  }
`;

export default TranscriptText;
