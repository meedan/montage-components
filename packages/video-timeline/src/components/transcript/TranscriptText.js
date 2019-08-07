import styled from 'styled-components';

const TranscriptText = styled.div`
  flex: 0 0 ${({ stretch }) => (stretch ? '100%' : '50%')};
  margin-bottom: 10px;
  margin-top: 10px;
  &:first-child {
    padding-right: 20px;
  }
  &:last-child {
    padding-left: 20px;
  }
`;

export default TranscriptText;
