import Palette from './ofThemes/Palette';

const Thm = {
  color: {
    ...Palette,

    // body:
    body: Palette.base700,
    bodyDecor: Palette.base300,
    bodyBackg: 'white',

    // action:
    action: Palette.primary900,
    actionHover: Palette.primary900,
    actionDecor: 'transparent',
    actionDecorHover: Palette.primary300,

    title: Palette.base900
  },

  fstack: {
    primary: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif'
  },

  feature: {
    roundness: {
      a: '100px',
      h: '12px',
      l: '8px',
      m: '6px',
      s: '4px',
      x: '2px',

      // action
      action: '2px'
    }
  },

  box: {
    border: '2px'
  }
};

export default Thm;
