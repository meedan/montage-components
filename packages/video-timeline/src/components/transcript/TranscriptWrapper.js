import styled from 'styled-components';

const TranscriptWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ stretch }) => (stretch ? '1400px' : '1050px')};
`;

export default TranscriptWrapper;
