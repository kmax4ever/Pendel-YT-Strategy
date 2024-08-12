import React, { useState } from "react";
import { AppTheme } from "styles/theme";
import { Box, ButtonBase, createStyles, makeStyles } from "@material-ui/core";
import Flex from "./Flex";
import Text from "./Text";

interface ToggleButtonProps {}

const ToggleButton = (props: ToggleButtonProps) => {
  const styles = useStyles(props);
  const [isOn, setIsOn] = useState(false);
  const selectedStyle = {
    backgroundColor: "#5BA5AF",
    borderRadius: 12,
  };

  const onToggle = (value: boolean) => {
    setIsOn(value);
  };

  return (
    <Flex borderRadius="12px" bgcolor="#EFF6F6" height="24px">
      <ButtonBase
        onClick={() => onToggle(true)}
        style={{ flex: 1, padding: "0 8px", ...(isOn ? selectedStyle : {}) }}
      >
        <Text variant="button" color={isOn ? "white" : "#5BA5AF"}>
          ON
        </Text>
      </ButtonBase>
      <ButtonBase
        onClick={() => onToggle(false)}
        style={{ flex: 1, padding: "0 8px", ...(!isOn ? selectedStyle : {}) }}
      >
        <Text variant="button" color={!isOn ? "white" : "#5BA5AF"}>
          OFF
        </Text>
      </ButtonBase>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) => createStyles({}));

export default ToggleButton;
