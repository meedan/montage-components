import styled from 'styled-components';
import grey from '@material-ui/core/colors/grey';

const TranscriptSide = styled.div`
  border-left: ${({ right }) => (right ? `1px solid ${grey[100]}` : 'none')};
  border-right: ${({ left }) => (left ? `1px solid ${grey[100]}` : 'none')};
  flex: 0 0 180px;
  padding-left: ${({ right }) => (right ? '20px' : 0)};
  padding-right: ${({ left }) => (left ? '20px' : 0)};
  position: relative;
`;

export default TranscriptSide;
