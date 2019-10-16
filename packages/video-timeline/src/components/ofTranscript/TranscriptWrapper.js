import styled from 'styled-components';

import { color } from '@montage/ui';

const TranscriptWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ stretch }) => (stretch ? '1400px' : '1050px')};

  span[class*='C-']:before {
    position: absolute;
    top: -0.8em;
    left: -1.1em;
    color: ${color.brand};

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    content: '';
    display: block;
    font-family: 'iconfont' !important;
    font-size: 16px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    speak: none;
    text-align: center;
    transition: all 0.35s;
    width: 20px;
  }
`;

export default TranscriptWrapper;
