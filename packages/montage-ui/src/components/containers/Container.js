import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { setSpace } from '../../mixins';

const Child = styled.div`
  ${({ flexDirection, justifyContent }) => (flexDirection
    ? `
    display: flex;
    flex-direction: ${flexDirection};
    justify-content: ${justifyContent};
  `
    : '')};
`;

const Element = styled.div`
  display: ${({ flexDirection }) => (flexDirection ? 'flex' : 'block')};
  flex-basis: ${({ flexBasis }) => flexBasis};
  min-height: ${({ cover }) => (cover ? '100vh' : 'auto')};
  ${({ ft }) => (ft
    ? `
      align-content: stretch;
  `
    : '')};
  ${({ flexDirection }) => (flexDirection
    ? `
    flex-direction: ${flexDirection};
    justify-content: space-between;
  `
    : '')};
  ${({ flexGrow }) => (flexGrow
    ? `
    flex-grow: ${flexGrow};
  `
    : '')};
  ${({ hasSpace }) => {
    if (hasSpace) {
      return Array.isArray(hasSpace) ? hasSpace.map(space => setSpace(space)) : setSpace(hasSpace);
    }
    return '';
  }};
`;

const Container = (props) => {
  const {
    children, ft, hd, flexDirection
  } = props;
  return (
    <Element {...props}>
      {ft ? (
        <Fragment>
          <Child flexDirection={flexDirection}>
            {hd || null}
            {children}
          </Child>
          {ft}
        </Fragment>
      ) : (
        <Fragment>
          {hd || null}
          {children}
        </Fragment>
      )}
    </Element>
  );
};

Container.propTypes = {
  cover: PropTypes.bool,
  flexBasis: PropTypes.string,
  flexDirection: PropTypes.string,
  flexGrow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ft: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.node]),
  hasSpace: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  hd: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.node]),
  justifyContent: PropTypes.string
};

Container.defaultProps = {
  cover: false,
  flexBasis: 'auto',
  flexDirection: null,
  flexGrow: 'auto',
  ft: null,
  hasSpace: null,
  hd: null,
  justifyContent: 'space-between'
};

export default Container;
