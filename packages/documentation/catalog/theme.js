import { Thm } from '..';

export default {
  // Colors
  background: 'white',
  textColor: Thm.color.base700,
  codeColor: '#17388d',
  linkColor: Thm.color.primary900,

  // NavigationBar background color, but also sometimes used as a foreground
  // or border color.
  lightColor: Thm.color.base300,

  // Used in PageHeader
  pageHeadingBackground: Thm.color.primary900,
  pageHeadingTextColor: 'white',

  // Used in Menu and PageHeader to make sure the top parts have
  // the same height.
  pageHeadingHeight: 160,

  // Used for navigation bar
  navBarBackground: Thm.color.primary300,
  navBarTextColor: Thm.color.primary900,

  // Used in ResponsiveTabs (tab text), Download specimen (title text).
  // Typography: headings.
  brandColor: Thm.color.primary900,

  sidebarColor: 'white',
  sidebarColorActive: '#f6f6f6',
  sidebarColorText: Thm.color.primary900,
  sidebarColorTextActive: Thm.color.base900,
  sidebarColorLine: Thm.color.bodyDecor,
  sidebarColorHeading: Thm.color.primary900,

  // Used in the html, react, and image specimens.
  bgLight: '#f6f6f6',
  bgDark: '#333',

  // Keys appear to be PrismJS token types.
  codeStyles: {
    tag: { color: '#FF5555' },
    punctuation: { color: '#535353' },
    script: { color: '#3F7397' },
    function: { color: '#FF5555' },
    keyword: { color: '#3F7397' },
    string: { color: '#00263E' }
  },

  // Patterns
  checkerboardPatternLight:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAAAAACoWZBhAAAAF0lEQVQI12P4BAI/QICBFCaYBPNJYQIAkUZftTbC4sIAAAAASUVORK5CYII=',
  checkerboardPatternDark:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAAAAACoWZBhAAAAFklEQVQI12NQBQF2EGAghQkmwXxSmADZJQiZ2ZZ46gAAAABJRU5ErkJggg==',

  // Fonts
  fontFamily: Thm.fstack.primary,
  fontHeading: Thm.fstack.primary,
  fontMono: '\'Roboto Mono\', monospace',

  // Base font size in pixels.
  baseFontSize: 16,

  // Modular scale ratio that is used to figure out all the different font sizes
  msRatio: 1.2
};
