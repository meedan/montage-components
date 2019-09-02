import styled from 'styled-components';

import { color } from '@montage/ui';

const TranscriptWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ stretch }) => (stretch ? '1400px' : '1050px')};

  span[class*='C-']:before {
    position: absolute;
    top: -1em;
    left: -1.1em;
    color: ${color.brand};

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    content: '';
    font-family: 'iconfont' !important;
    font-size: 16px;
    speak: none;
  }
`;

export default TranscriptWrapper;
