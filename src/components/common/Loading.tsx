import React from "react";
import { AppTheme, Colors } from "styles/theme";
import { CircularProgress, createStyles, makeStyles } from "@material-ui/core";
import Flex from "./Flex";

interface LoadingProps {}

const Loading = (props: LoadingProps) => {
  const styles = useStyles(props);

  return (
    <Flex center width="100%" height="100%">
      <div className={styles.root}>
        <CircularProgress
          variant="determinate"
          className={styles.bottom}
          size={40}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          className={styles.top}
          classes={{
            circle: styles.circle,
          }}
          size={40}
          thickness={4}
          {...props}
        />
      </div>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    root: {
      position: "relative",
    },
    bottom: {
      color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    top: {
      color: Colors.primary,
      animationDuration: "550ms",
      position: "absolute",
      left: 0,
    },
    circle: {
      strokeLinecap: "round",
    },
  })
);

export default Loading;
