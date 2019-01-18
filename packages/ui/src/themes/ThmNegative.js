import Palette from './ofThemes/Palette';
import Thm from './Thm';

const ThmNegative = {
  ...Thm,

  color: {
    ...Palette,

    // body:
    body: Palette.base400,
    bodyDecor: Palette.flare400,
    bodyBackg: Palette.primary900,

    // action:
    action: Palette.base300,
    actionHover: 'white',
    actionDecor: 'transparent',
    actionDecorHover: 'transparent',

    title: Palette.base300
  }
};

export default ThmNegative;
