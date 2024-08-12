import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import HttpClientGameBE from "api/HttpClientGameBE";
import HttpClientBlockchainBE from "api/HttpClientBlockchainBE";
import AppLayout from "components/common/AppLayout";
import AuthRoute from "components/common/AuthRoute";
import ConfirmModal, {
  ConfirmModalMessage,
} from "components/common/ConfirmModal";
import NotiStack, { NotiMessage } from "components/common/NotiStack";
import UserDetailInstance, {
  UserDetailInstanceMessage,
} from "components/UserDetailInstance";
import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react";
import React, { lazy, Suspense, useEffect } from "react";
import { Route, Router, Switch } from "react-router";
import LoadingFallback from "screens/LoadingFallback";
import { createAppTheme } from "styles/theme";
import history from "./appBrowserHistory";
import { getSystemParams } from "api/cms";

const SettingPage = lazy(() => import("screens/Setting/SettingPage"));
const BinemonPage = lazy(() => import("screens/Strategy/StrategyPage"));

const LoginPage = lazy(() => import("screens/Auth/Login/LoginPage"));
const NotFoundPage = lazy(() => import("screens/NotFound"));

// eslint-disable-next-line no-var
var _UserDetailInstance: any = {};

export const UserDetailModalInstance = {
  addModal: (message: UserDetailInstanceMessage) => {
    _UserDetailInstance && _UserDetailInstance.addModal(message);
  },
};

// eslint-disable-next-line no-var
var _ConfirmModalInstance: any = {};

export const ConfirmModalInstance = {
  addMessage: (message: ConfirmModalMessage) => {
    _ConfirmModalInstance && _ConfirmModalInstance.addMessage(message);
  },
};

var _NotiStackInstance: any = {};

export const NotiStackInstance = {
  push: (message: NotiMessage) => {
    _NotiStackInstance && _NotiStackInstance.push(message);
  },
};

const RootContainer = observer(() => {
  return (
    <Router history={history}>
      <AppLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Switch>
            <AuthRoute exact path="/strategy">
              <BinemonPage />
            </AuthRoute>

            <AuthRoute exact path="/setting">
              <SettingPage />
            </AuthRoute>

            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>

          <ConfirmModal
            ref={(ref: any) => {
              _ConfirmModalInstance = ref;
            }}
          />
          <NotiStack
            ref={(ref: any) => {
              _NotiStackInstance = ref;
            }}
          />
          <UserDetailInstance
            ref={(ref: any) => {
              _UserDetailInstance = ref;
            }}
          />
        </Suspense>
      </AppLayout>
    </Router>
  );
});

const App = React.memo(() => {
  const theme = createAppTheme();
  const {} = useDepsContainer();

  useEffect(() => {
    const checkLocalJWT = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          HttpClientGameBE.setBearerToken(token);
          HttpClientBlockchainBE.setBearerToken(token);

          const loadUserInfo = async () => {};
          loadUserInfo();
          await getSystemParams();
        } else {
        }
      } catch (err) {}
    };
    checkLocalJWT();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RootContainer />
    </ThemeProvider>
  );
});

export default App;
