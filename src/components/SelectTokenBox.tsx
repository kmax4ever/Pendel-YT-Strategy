import {
  createStyles,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { PAIRS_MAP } from "config";
import useDepsContainer from "hooks/useDepsContainer";
import { observer } from "mobx-react";
import React from "react";
import { AppTheme } from "styles/theme";
import { formatTokenNumber } from "utils/helper";
import CoinIcon from "./common/CoinIcon";
import Flex from "./common/Flex";
import Text from "./common/Text";

interface SelectTokenBoxProps {}

const SelectTokenBox = (props: SelectTokenBoxProps) => {
  const { playStore, userStore } = useDepsContainer();
  const tokens: any = PAIRS_MAP[playStore.selectedPairName].tokenPlays;
  const styles = useStyles(props);
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Flex width="100%">
      <FormControl variant="outlined" fullWidth>
        <Select
          value={playStore.selectedToken}
          onChange={(e) => {
            playStore.selectedToken = e.target.value;
          }}
          classes={{
            outlined: styles.muiSelectOutlined,
          }}
        >
          {tokens.map((token) => {
            return (
              <MenuItem key={token} value={token}>
                <Flex centerY>
                  <CoinIcon symbol={token} size={35} />
                  <Flex ml={2} column pr={mdDown ? 0 : 3}>
                    <Text color={"gray"}>{token}</Text>
                    <Text
                      mt={"-5px"}
                      style={{ fontSize: "16px", fontWeight: 700 }}
                    >
                      {formatTokenNumber(userStore.userBalance[token].balance)}
                    </Text>
                  </Flex>
                </Flex>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    muiSelectOutlined: {
      paddingTop: 5,
      paddingBottom: 5,
    },
  })
);

export default observer(SelectTokenBox);
