import styled from 'styled-components';

const SliderWrapper = styled.div`
  .rc-slider {
    height: 28px;
    z-index: 1;
    pointer-events: none;
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
  .rc-slider-handle:focus {
    border: none;
    outline: none;
  }
  .rc-slider-handle,
  .rc-slider-handle:active,
  .rc-slider-handle:focus,
  .rc-slider-handle:hover {
    background: rgba(71, 123, 181, 1);
    border-radius: 0;
    border: none;
    box-shadow: none;
    height: 28px;
    margin: 0;
    pointer-events: auto;
    position: absolute;
    top: 0;
    transform: translateX(-2px);
    transition: background 0.1s, top 0.5s;
    width: 4px;
  }
  .rc-slider-handle:hover {
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
