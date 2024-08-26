import {
  createStyles,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import AssessmentIcon from "@material-ui/icons/Assessment";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react";
import React from "react";
import { useHistory, useLocation } from "react-router";
import { AppTheme, Colors } from "styles/theme";
import Flex from "./common/Flex";
import Text from "./common/Text";
import { ReactComponent as UserIcon } from "assets/icons/user-icon.svg";
import { ReactComponent as TradingIcon } from "assets/icons/trading-icon.svg";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";
import Statistic from "@material-ui/icons/AlignVerticalBottom";

interface AppDrawerProps {
  isCollapse: boolean;
  onMenuBtnClicked: any;
  isShowRightDrawerMobile?: boolean;
}

const AppDrawer = (props: AppDrawerProps) => {
  const styles = useStyles(props);
  const location = useLocation();
  const history = useHistory();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  const { uiStore } = useDepsContainer();

  const MENU_LIST = [
    // {
    //   name: "Statistic",
    //   Icon: AssessmentIcon,
    //   isActive: location.pathname === "/",
    //   path: "/",
    // },
    // {
    //   name: "User Management",
    //   Icon: UserIcon,
    //   isActive: location.pathname.includes("/user"),
    //   path: "/user",
    // },
    {
      name: "Strategy",
      Icon: AssessmentIcon,
      isActive: location.pathname.includes("/strategy"),
      path: "/strategy",
    },
    // {
    //   name: "mintSpecialEggHistory",
    //   Icon: GroupWorkIcon,
    //   isActive: location.pathname.includes("/mintSpecialEggHistory"),
    //   path: "/mintSpecialEggHistory",
    // },
    // {
    //   name: "Amb statistic",
    //   Icon: Statistic,
    //   isActive: location.pathname.includes("/ambStatistic"),
    //   path: "/ambStatistic",
    // },
    // {
    //   name: "Trades",
    //   Icon: TradingIcon,
    //   isActive: location.pathname.includes("/trade"),
    //   path: "/trade",
    // },
  ];

  const container =
    window !== undefined ? () => window.document.body : undefined;

  const drawer = (
    <div className={styles.toolbar}>
      <Flex
        px={2}
        height={70}
        centerY
        justifyContent={props.isCollapse ? "center" : "space-between"}
      >
        <Flex center>
          {/* <AppLogo /> */}
          {!props.isCollapse ? (
            <Text
              ml={1}
              color="white"
              style={{ fontSize: 25, fontWeight: "bold" }}
            ></Text>
          ) : null}
        </Flex>
      </Flex>
      <Divider />
      <List style={{ paddingTop: 0 }}>
        {MENU_LIST.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => {
              history.push(item.path);
              if (mdDown) {
                uiStore.toggleIsShowRightDrawer();
              }
            }}
            style={{
              padding: "20px 18px",
              backgroundColor: item.isActive ? "#0F111D" : undefined,
            }}
          >
            <ListItemIcon>
              <item.Icon
                style={{
                  fill: item.isActive ? "white" : "#767995",
                  filter: item.isActive
                    ? "drop-shadow(0px 0px 5px #0ACF97)"
                    : undefined,
                  marginLeft: item.name === "Profile" ? 5 : 0,
                }}
              />
            </ListItemIcon>
            {props.isCollapse ? null : (
              <Text
                color={item.isActive ? "white" : "#767995"}
                style={{
                  fontSize: 16,
                  textShadow: item.isActive ? "0px 0px 5px #0ACF97" : undefined,
                }}
              >
                {item.name}
              </Text>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={styles.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={"left"}
          open={uiStore.isShowRightDrawer}
          onClose={uiStore.toggleIsShowRightDrawer}
          classes={{
            paper: styles.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          classes={{
            paper: styles.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

const AppDrawwerWithObserver = observer(AppDrawer);

const DrawerWrapper = () => {
  const theme = useTheme();
  const isSmallSizePC = useMediaQuery(theme.breakpoints.down(1300));
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppDrawwerWithObserver
      isCollapse={isSmallSizePC && !mdDown}
      onMenuBtnClicked={() => {}}
    />
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: (props: any) => {
          return !props.isCollapse ? 150 : 70;
        },
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("md")]: {
        width: (props: any) =>
          !props.isCollapse ? `calc(100% - ${150}px)` : `calc(100% - ${70}px)`,
        marginLeft: (props: any) => (!props.isCollapse ? 150 : 70),
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: {
      backgroundColor: Colors.drawerBg,
    },
    drawerPaper: {
      width: (props: any) => (!props.isCollapse ? 150 : 70),
      backgroundColor: Colors.drawerBg,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

export default observer(DrawerWrapper);
