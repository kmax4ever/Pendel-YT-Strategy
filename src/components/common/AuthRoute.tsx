import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import Flex from "./Flex";
import Loading from "./Loading";

const AuthRoute: React.FunctionComponent<RouteProps> = (props) => {
  const {} = useDepsContainer();

  // return userStore.computedIsLoggedIn ? (
  //   <Route {...props} />
  // ) : (
  //   <Redirect to="/login" />
  // );

  return <Route {...props} />;
};

export default observer(AuthRoute);
