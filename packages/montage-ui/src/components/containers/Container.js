import React from "react";
import styled from "styled-components";

const Element = styled.div``;

const Container = props => {
  return <Element {...props} />;
};

Container.propTypes = {};

Container.defaultProps = {};

export default Container;
