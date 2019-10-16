import styled from 'styled-components';

const TranscriptMain = styled.div`
  display: flex;
  flex: 0 1 1050px;
  justify-content: center;
  padding: 0 20px;
  position: relative;
  & > * {
    flex: 0 0 50%;
  }
`;

export default TranscriptMain;
