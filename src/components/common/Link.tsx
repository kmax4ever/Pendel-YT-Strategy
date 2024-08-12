import * as React from "react";
import { Children, isValidElement } from "react";
import { Link as RouterLink } from "react-router-dom";

const Link: React.FC<{ to: string }> = ({ children, to }) => {
  const child = Children.only(children);

  if (!child || !isValidElement(child)) {
    throw "[Link] Error: Invalid child element";
  }

  const Component = child.type;

  return <Component component={RouterLink} {...child.props} to={to} />;
};

export default Link;
