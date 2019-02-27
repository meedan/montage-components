import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { setSize, setSpace, setType } from "../../mixins";
import { Thm } from "../../themes";
import { time } from "../../settings";

const Element = styled.a``;

const StyledElement = styled(
  ({ isDisabled, theme, iconic, block, size, plain, ...props }) => (
    <Element {...props} />
  )
)`
  align-items: center;
  background: ${({ primary, theme }) =>
    primary ? theme.color.action : "transparent"};
  border-color: ${({ theme }) => theme.color.action};
  border-radius: ${({ iconic, theme }) =>
    iconic ? theme.feature.roundness.a : theme.feature.roundness.action};
  border-style: solid;
  border-width: ${({ theme, plain }) => (plain ? "0" : theme.box.border)};
  box-shadow: ${({ isDisabled, plain, theme }) =>
    isDisabled || plain ? "none" : `0 1px 3px ${theme.color.shadow400}`};
  color: ${({ primary, theme }) =>
    primary ? theme.color.bodyBackg : theme.color.action};
  cursor: ${({ isDisabled }) => (isDisabled ? "default" : "pointer")};
  display: ${({ block }) => (block ? "block" : "inline-flex")};
  font-family: ${({ theme }) => theme.fstack.primary};
  font-weight: 500;
  justify-content: center;
  opacity: ${({ isDisabled }) => (isDisabled ? ".5" : "1")};
  outline: none;
  text-align: ${({ block }) => (block ? "center" : "inherit")};
  user-select: none;
  width: ${({ block }) => (block ? "100%" : "auto")};
  transition: transform ${time.s}, box-shadow ${time.s}, color ${time.s};

  /* Variations */
  ${({ iconic, size }) =>
    iconic
      ? `
    ${setSize(size)};
  `
      : ""};

  /* States */
  ${({ isDisabled, primary, theme }) =>
    !isDisabled
      ? `
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px ${theme.color.shadow400};
      color: ${primary ? theme.color.bodyBackg : theme.color.actionHover};
    }
    &:active {
      box-shadow: 0 1px 3px ${theme.color.shadow400};
      transform: translateY(0);
    }
  `
      : ""};

  /* Size variations */
  ${({ size, plain }) => {
    if (size === "l") {
      return `
        ${plain ? setSpace("pax") : setSpace("phm")};
        ${plain ? setSpace("pax") : setSpace("pvs")};
        ${setType("l")};
      `;
    }
    if (size === "s") {
      return `
        ${plain ? setSpace("pax") : setSpace("phs")};
        ${plain ? setSpace("pax") : setSpace("pvx")};
        ${setType("x")};
      `;
    }
    return `
      ${plain ? setSpace("pax") : setSpace("phm")};
      ${plain ? setSpace("pax") : setSpace("pvx")};
      ${setType("m")};
    `;
  }};
`;

const Action = props => <StyledElement {...props} />;

Action.propTypes = {
  block: PropTypes.bool,
  iconic: PropTypes.bool,
  isDisabled: PropTypes.bool,
  primary: PropTypes.bool,
  size: PropTypes.string
};

Action.defaultProps = {
  block: false,
  iconic: false,
  isDisabled: false,
  primary: false,
  size: "m",
  theme: Thm
};

export default Action;
