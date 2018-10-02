import { bool } from "prop-types";
import React from "react";
import styled from "styled-components";

const Action = styled.a`
  color: ${({ primary }) => (primary ? `red` : `blue`)};
  display: inline-block;
`;

Action.propTypes = {
  primary: bool
};

Action.defaultProps = {
  primary: null
};

export default Action;
