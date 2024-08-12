import { yupResolver } from "@hookform/resolvers";
import { createStyles, Hidden, makeStyles } from "@material-ui/core";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { ConfirmModalInstance } from "App";
import Flex from "components/common/Flex";
import InputWrapper from "components/common/InputWrapper";
import Text from "components/common/Text";
import useDepsContainer from "hooks/useDepsContainer";
import { useLocalStore } from "mobx-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { AppTheme } from "styles/theme";
import { getErrorMessageFromServer } from "utils/helper";
import * as yup from "yup";

interface LoginPageProps {}

export interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage = (props: LoginPageProps) => {
  const { userStore } = useDepsContainer();
  const styles = useStyles(props);
  const history = useHistory();
  const state = useLocalStore(() => ({
    isLogging: false,
  }));

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const { register, handleSubmit, setValue, errors, watch } = useForm<
    LoginFormValues
  >({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    register("username");
    register("password");
  }, []);

  const watchValues = watch();

  const onBtnClicked = async (values: LoginFormValues) => {
    state.isLogging = true;
    try {
      await userStore.login(values);
      history.push("/");
    } catch (err) {
      let errStr = getErrorMessageFromServer(err);

      ConfirmModalInstance.addMessage({
        title: "Error",
        children: errStr,
        isAlertMessageOnly: true,
      });
    }
    state.isLogging = false;
  };

  return (
    <Flex className={styles.bg}>
      <Flex flex={1} center>
        <Flex
          className={styles.form}
          column
          width={{
            xs: "90vw",
            md: 500,
          }}
        >
          <Text variant="formHeader">Login</Text>

          <Flex mt={3}>
            <InputWrapper
              column
              value={watchValues.username}
              error={errors.username && errors.username.message}
              onChange={(e: any) => {
                setValue("username", e.target.value);
              }}
              placeholder="Enter username"
            />
          </Flex>
          <Flex mt={3}>
            <InputWrapper
              column
              type="password"
              value={watchValues.password}
              error={errors.password && errors.password.message}
              onChange={(e: any) => {
                setValue("password", e.target.value);
              }}
              placeholder="Enter password"
            />
          </Flex>

          <Flex center justifyContent="space-between" mt={5}>
            <Flex flex={1} height="100%" column center>
              <LoadingButton
                fullWidth
                pending={state.isLogging}
                onClick={handleSubmit(onBtnClicked)}
                variant="contained"
                color="secondary"
                style={{ padding: "10px 0", height: "auto", flex: 1 }}
              >
                LOG IN
              </LoadingButton>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    bg: {
      backgroundSize: "cover",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100%",
      height: "auto",
    },
    form: {
      backdropFilter: "blur(5px)",
      borderRadius: "10px",
      padding: "40px 45px",
      background: "#161929",
    },
  })
);

export default LoginPage;
