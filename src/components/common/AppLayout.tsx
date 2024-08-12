import { Box } from "@material-ui/core";
import AppDrawer from "components/Drawer";
import React from "react";
import { useLocation } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export const isHideDrawerFunc = (location) => {
  const ignorePage = ["/login", "/register", "/resetPassword"];
  for (let page of ignorePage) {
    if (location.pathname.includes(page)) {
      return true;
    }
  }
  return false;
};

const AppLayout = (props: any) => {
  const location = useLocation();

  const isHideDrawer = isHideDrawerFunc(location);

  return (
    <Box
      overflow="hidden"
      display="flex"
      flexDirection="column"
      position="relative"
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      <Header />
      <Box overflow="hidden" display="flex" flexDirection="row" flex={1}>
        {isHideDrawer ? null : <AppDrawer />}
        <Box
          style={{
            overflow: "auto",
          }}
          width="100%"
          height="100%"
        >
          {props.children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
export default AppLayout;
