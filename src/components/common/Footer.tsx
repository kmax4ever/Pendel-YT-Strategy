import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { AppTheme } from "styles/theme";
import Flex from "./Flex";
interface FooterProps {}

const Footer = (props: FooterProps) => {
  const styles = useStyles(props);

  return <Flex></Flex>;
};

const useStyles = makeStyles((theme: AppTheme) => createStyles({}));

export default Footer;
