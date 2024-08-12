import { CircularProgress } from "@material-ui/core";
import Flex from "components/common/Flex";
import Text from "components/common/Text";
import React from "react";
import { Colors } from "styles/theme";

interface LoadingFallbackProps {}

const LoadingFallback = (props: LoadingFallbackProps) => {
  return (
    <Flex column center width="100%" height="100%" bgcolor="pageBg">
      <CircularProgress color="primary" />
      {/* <Text
        color={Colors.secondary}
        style={{
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        Loading...
      </Text> */}
    </Flex>
  );
};

export default LoadingFallback;
