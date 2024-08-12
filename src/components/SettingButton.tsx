import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Popover,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { ReactComponent as UserIcon } from "assets/icons/user-icon.svg";
import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react";
import React from "react";
import { useHistory } from "react-router";
import { AppTheme, Colors } from "styles/theme";
import Flex from "./common/Flex";
import Text from "./common/Text";

interface SettingButtonProps {
  isLoggedIn: boolean;
  user: any;
}

const SettingButton = (props: SettingButtonProps) => {
  const theme: AppTheme = useTheme();
  const history = useHistory();
  const styles = useStyles(props);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {} = useDepsContainer();

  const handleClick = (event: any) => {
    // if (props.isLoggedIn) {
    //   setAnchorEl(event.currentTarget);
    // } else {
    //   history.push("/login");
    // }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const isLoggedIn = props.isLoggedIn;

  return (
    <Flex alignSelf="center" width="100%" height="100%">
      <Flex
        width={70}
        justifyContent="center"
        className={styles.headerBtn}
        borderLeft={!isLoggedIn ? `1px solid ${Colors.border}` : undefined}
        ml={!isLoggedIn ? 2 : 0}
      >
        <IconButton onClick={handleClick}>
          <UserIcon style={{ fill: "#767995" }} />
        </IconButton>
      </Flex>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Flex
          column
          py={2}
          px={2}
          minWidth={300}
          bgcolor="#282C44"
          border="1px solid #767995"
          borderRadius="8px"
        >
          {props.isLoggedIn ? (
            <>
              <Text color="gray" style={{ fontSize: 15 }}>
                Admin
              </Text>

              <Button
                fullWidth
                variant={"text"}
                type="submit"
                style={{
                  padding: "10px 0",
                }}
              >
                <Text color="down">Sign Out</Text>
              </Button>
            </>
          ) : null}
        </Flex>
      </Popover>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    iconBtn: {
      cursor: "pointer",
      "&:hover": {
        fill: "white",
      },
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    muiListRoot: {
      backgroundColor: Colors.blue,
    },
    headerBtn: {
      height: 70,
      alignItems: "center",
      cursor: "pointer",
      "&:hover": {
        borderBottom: "2px solid #556df6",
      },
    },
  })
);

export default observer(SettingButton);
