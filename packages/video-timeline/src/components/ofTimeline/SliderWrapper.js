import styled from 'styled-components';

const SliderWrapper = styled.div`
  .rc-slider {
    height: 28px;
    z-index: 1;
  }
  .rc-slider-rail {
    background: transparent;
    height: 28px;
  }
  .rc-slider-track {
    background: rgba(71, 123, 181, 0.4);
    border-radius: 0;
    height: 28px;
    position: absolute;
    top: 0;
  }
  .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
    border-radius: 1px;
    border: none;
    height: 28px;
    margin: 0;
    position: absolute;
    top: 0;
    transform: translateX(-2px);
    transition: background 0.1s;
    width: 4px;
  }
  .rc-slider:hover .rc-slider-handle {
    background: rgba(71, 123, 181, 1);
  }
  .rc-slider:hover .rc-slider-handle,
  .rc-slider-handle:focus {
    box-shadow: none;
  }
  .rc-slider-mark-text {
  }
  .rc-slider-mark-text:hover {
    z-index: 50;
  }
`;

export default SliderWrapper;
