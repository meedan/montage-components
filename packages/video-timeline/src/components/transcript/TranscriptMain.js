import styled from 'styled-components';

const TranscriptMain = styled.div`
  display: flex;
  flex: 1 1 100%;
  justify-content: center;
  position: relative;
  & > * {
    flex: 0 0 50%;
  }
`;

export default TranscriptMain;
