import React from "react";
import { ReactComponent as EmptyIcon } from "assets/icons/empty-state-icon.svg";
import { Box, Typography } from "@material-ui/core";

export interface EmptyProps {
  title: string;
  text?: string;
}

const Empty: React.FC<EmptyProps> = ({ title, text, ...restProps }) => {
  return (
    <Box flexDirection="column" alignItems="center" {...restProps}>
      <EmptyIcon />
      <Typography>{title}</Typography>
      <Typography>{text}</Typography>
    </Box>
  );
};

export default Empty;
