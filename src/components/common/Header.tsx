import { Hidden, IconButton, makeStyles } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { createStyles, useTheme } from "@material-ui/styles";
import { ReactComponent as AppLogo } from "assets/icons/app-logo.svg";
import SettingButton from "components/SettingButton";
import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react";
import React from "react";
import { useHistory } from "react-router";
import { AppTheme } from "styles/theme";
// import SelectPairBox from "../SelectPairBox";
import Flex from "./Flex";
import Text from "./Text";

const Header = (props: any) => {
  const styles = useStyles(props);
  const { uiStore } = useDepsContainer();
  const theme: AppTheme = useTheme();
  const history = useHistory();

  return (
    <Flex
      boxShadow={3}
      zIndex={theme.zIndex.appBar}
      height={70}
      pl={2}
      pr={1}
      bgcolor="headerBg"
      alignItems="center"
      justifyContent={"space-between"}
    >
      {/* {isTradingPageActive && isLoggedIn ? (
        <Hidden mdDown>
          <Flex pl={isSmallSizePC && !mdDown ? "70px" : "248px"}>
            <SelectPairBox />
          </Flex>
        </Hidden>
      ) : null} */}

      <Hidden mdDown>
        <Flex></Flex>
      </Hidden>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    headerBtn: {
      height: 70,
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        borderBottom: "2px solid #556df6",
      },
    },
    actionBtn: {
      "&:hover": {
        boxShadow: "0 0 10px 0 #556df6",
      },
    },
  })
);

export default observer(Header);
