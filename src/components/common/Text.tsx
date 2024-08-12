import Box, { BoxProps } from "@material-ui/core/Box";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { AppTheme, PropType } from "styles/theme";

const defaultColors = [
  "initial",
  "inherit",
  "primary",
  "secondary",
  "textPrimary",
  "textSecondary",
] as const;

type HexColor = string & { hexish?: any };

type TextProps = Omit<BoxProps, "color" | "display" | "style"> &
  Omit<TypographyProps, "color"> & {
    color?:
      | (typeof defaultColors[number] | keyof PropType<AppTheme, "colors">)
      | HexColor;
  };

const Text = (props: TextProps) => {
  const { color, style: styleProps = {}, textAlign, ...rest } = props;
  const theme: AppTheme = useTheme();
  //@ts-ignore
  const isDefaultColors = defaultColors.includes(color);
  const colorProps = isDefaultColors
    ? {
        color: color,
      }
    : undefined;
  const style = {
    ...styleProps,
    //@ts-ignore
    color: !isDefaultColors ? theme.colors[color] || color : undefined,
    textAlign: textAlign || styleProps.textAlign,
  };

  const boxProps = {
    ...rest,
    textAlign: undefined,
  };

  const typoProps = {
    ...rest,
    maxWidth: undefined,
    onClick: undefined,
  };

  //@ts-ignore
  return (
    <Box style={style} {...boxProps}>
      {/* @ts-ignore */}
      <Typography
        component="div"
        style={style}
        {...colorProps}
        {...typoProps}
      ></Typography>
    </Box>
  );
};

export default Text;
