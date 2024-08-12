import React from "react";
import { AppTheme } from "styles/theme";
import {
  Box,
  createStyles,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { PAIRS } from "config";
import Flex from "./common/Flex";
import CoinIcon from "./common/CoinIcon";
import { observer } from "mobx-react";
import useDepsContainer from "hooks/useDepsContainer";
import Text from "./common/Text";

interface SelectPairBoxProps {}

const SelectPairBox = (props: SelectPairBoxProps) => {
  const styles = useStyles(props);
  const { playStore } = useDepsContainer();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Flex width="100%">
      <FormControl variant="outlined" fullWidth>
        <Select
          value={playStore.selectedPairName}
          onChange={(e) => {
            playStore.changePair(e.target.value);
          }}
        >
          {PAIRS.map((pair) => {
            return (
              <MenuItem key={`${pair.tokenA}-${pair.tokenB}`} value={pair.name}>
                <Flex centerY pr={mdDown ? 0 : 3}>
                  <CoinIcon symbol={pair.tokenA} symbol2={pair.tokenB} />
                  <Text ml={1}>{`${pair.tokenA}/${pair.tokenB}`}</Text>
                </Flex>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) => createStyles({}));

export default observer(SelectPairBox);
