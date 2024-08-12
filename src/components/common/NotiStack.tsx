import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { AppTheme } from "styles/theme";
import { createStyles, makeStyles, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

interface NotiStackProps {}

const Alert = React.forwardRef(function Alert(props: AlertProps, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface NotiMessage {
  children: React.ReactNode;
  variant: "success" | "error" | "info" | "warning";
  key?: number | string;
  timeout?: number;
}

var count = 0;
var setTimeouts: any = [];
const NotiStack: ForwardRefRenderFunction<any, any> = (
  props: NotiStackProps,
  ref
) => {
  const [messages, setMessages] = useState<NotiMessage[]>([]);
  const [keyExists, setKeyExists] = useState<{ [key: string]: boolean }>({});
  const styles = useStyles();

  const onDismiss = (key?: number | string) => {
    setMessages((messages) => {
      let newMessages = messages.filter((msg) => msg.key !== key);
      return newMessages;
    });
    setKeyExists((keyExists) => {
      const newState = { ...keyExists };
      delete newState[key];
      return newState;
    });
  };

  useImperativeHandle(ref, () => ({
    push: (msg: NotiMessage) => {
      count++;
      let _count = count;
      if (msg.timeout === undefined || msg.timeout > 0) {
        setTimeouts.push(
          setTimeout(
            (key) => {
              onDismiss(key);
            },
            msg.timeout || 6000,
            _count
          )
        );
      }
      //@ts-ignore
      const key = msg.key || count;
      if (!keyExists[key]) {
        setMessages((messages) => {
          return [...messages, { ...msg, key: msg.key || count }];
        });
        setKeyExists((keyExists) => {
          const newState = { ...keyExists };
          newState[key] = true;
          return newState;
        });
      }
    },
  }));

  useEffect(() => {
    return () => {
      for (let timeout of setTimeouts) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Fragment>
      {messages.map((msg, index) => {
        return (
          <Snackbar
            key={msg.key}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={true}
            style={{
              marginTop: index * 60,
            }}
          >
            <Alert
              onClose={() => {
                onDismiss(msg.key);
              }}
              severity={msg.variant}
              className={styles.alert}
            >
              {msg.children}
            </Alert>
          </Snackbar>
        );
      })}
    </Fragment>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    alert: {
      width: "100%",
    },
  })
);

export default forwardRef(NotiStack);
