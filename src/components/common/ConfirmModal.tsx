import {
  Button,
  createStyles,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import LoadingButton from "@material-ui/lab/LoadingButton";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/styles";
import { Observer, useLocalStore } from "mobx-react";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AppTheme } from "styles/theme";
import Flex from "./Flex";
import Text from "./Text";
import { ReactComponent as GreenTickIcon } from "assets/icons/greenTick-icon.svg";
import { ReactComponent as RedCrossIcon } from "assets/icons/redCross-icon.svg";

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const styles = useStyles(props);
  const { children, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography {...other}>
      <Flex>
        <IconButton
          aria-label="close"
          className={styles.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Flex centerY justifyContent="space-between" mt={2}>
          <Text variant="dialogHeader">{children}</Text>
        </Flex>
      </Flex>
    </MuiDialogTitle>
  );
};

interface ConfirmModalProps {}

export interface ConfirmModalMessage {
  children: string | (() => React.ReactNode);
  isSuccessErrorAlert?: "SUCCESS" | "ERROR";
  isAlertMessageOnly?: boolean;
  title?: string;
  actionText?: string;
  cancelText?: string;
  actionBtnVariant?: string;
  action?: () => void;
}

const DialogContent = withStyles((theme: AppTheme) => ({
  root: {
    borderTop: "none",
    borderBottom: "none",
  },
}))(MuiDialogContent);

const ConfirmModal: ForwardRefRenderFunction<any, any> = (
  props: ConfirmModalProps,
  ref: any
) => {
  const { t } = useTranslation();
  const state = useLocalStore(() => ({
    isLoading: false,
  }));
  const [messages, setMessages] = useState<ConfirmModalMessage[]>([]);

  useImperativeHandle(ref, () => ({
    addMessage: (msg: ConfirmModalMessage) => {
      setMessages((messages) => {
        return [...messages, msg];
      });
    },
  }));

  const onDismiss = (index: number) => {
    // eslint-disable-next-line prefer-const
    let newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      return newMessages;
    });
  };

  if (messages.length === 0) {
    return <div />;
  }

  const onActionbtnClicked = async (
    index: number,
    msg: ConfirmModalMessage
  ) => {
    const action = msg.action ? msg.action : () => {};
    state.isLoading = true;
    try {
      await action();
      onDismiss(index);
    } catch (err) {
      console.log(err);
    }
    state.isLoading = false;
  };

  return (
    <Fragment>
      {messages.map((item, index) => {
        let title = item.title ? item.title : t("alert", "Alert");
        const {
          actionBtnVariant,
          isAlertMessageOnly,
          actionText,
          cancelText,
          isSuccessErrorAlert,
        } = item;
        if (isSuccessErrorAlert !== undefined) {
          title = "";
        }

        return (
          <Dialog
            key={index}
            onClose={() => {
              onDismiss(index);
            }}
            aria-labelledby="customized-dialog-title"
            open={true}
            fullWidth
            maxWidth={"xs"}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={() => {
                onDismiss(index);
              }}
            >
              {title}
            </DialogTitle>
            <DialogContent dividers>
              <Flex
                column
                center={isSuccessErrorAlert ? true : false}
                pb={isSuccessErrorAlert ? 5 : 0}
              >
                {isSuccessErrorAlert !== undefined ? (
                  isSuccessErrorAlert === "SUCCESS" ? (
                    <Flex mb={1}>
                      <GreenTickIcon />
                    </Flex>
                  ) : (
                    <Flex mb={1}>
                      <RedCrossIcon />
                    </Flex>
                  )
                ) : null}
                {typeof item.children === "string" ? (
                  <Text
                    style={{
                      wordBreak: "break-all",
                    }}
                    color={
                      isSuccessErrorAlert !== undefined
                        ? isSuccessErrorAlert === "SUCCESS"
                          ? "success"
                          : "error"
                        : undefined
                    }
                    textAlign={
                      isSuccessErrorAlert !== undefined ? "center" : "left"
                    }
                  >
                    {item.children}
                  </Text>
                ) : (
                  item.children()
                )}
              </Flex>
            </DialogContent>
            {isSuccessErrorAlert === undefined ? (
              <DialogActions>
                {isAlertMessageOnly ? null : (
                  <Button
                    onClick={() => {
                      onDismiss(index);
                    }}
                  >
                    {cancelText || t("no", "NO")}
                  </Button>
                )}
                <Observer>
                  {() => (
                    <LoadingButton
                      variant={
                        state.isLoading
                          ? "contained"
                          : actionBtnVariant || "contained"
                      }
                      onClick={() => {
                        onActionbtnClicked(index, item);
                      }}
                      autoFocus
                      pending={state.isLoading}
                    >
                      {actionText ||
                        (isAlertMessageOnly ? t("ok", "OK") : t("yes", "YES"))}
                    </LoadingButton>
                  )}
                </Observer>
              </DialogActions>
            ) : null}
          </Dialog>
        );
      })}
    </Fragment>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      right: -5,
      top: -5,
      color: theme.palette.grey[500],
    },
  })
);

export default forwardRef(ConfirmModal);
