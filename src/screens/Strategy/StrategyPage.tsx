import {
  Button,
  createStyles,
  makeStyles,
  Select,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import Flex from "components/common/Flex";
import InputWrapper from "components/common/InputWrapper";
import Text from "components/common/Text";
import { observer, useLocalStore } from "mobx-react";
import React, { useEffect, useState } from "react";
import { AppTheme, Colors } from "styles/theme";
import UsersTable from "./components/BinemonTable";
import { isAddress } from "web3-utils";
import useDepsContainer from "hooks/useDepsContainer";

interface BinemonPageProps {}

const StrategyPage = (props: BinemonPageProps) => {
  const styles = useStyles(props);
  const { cmsStore } = useDepsContainer();
  const BASE_TYPE = "YT";
  const state = useLocalStore(() => ({
    network: 1,
    isUseOptionalFrom1: false,
    isUseOptionalFrom2: false,
    marketAddress: "",
    ytAddress: "",
    underlyingAmount: 0,
    pointPerHour: 0,
    pendelYTMultiplier: 0,
    error: {
      marketAddressError: "",
      ytAddressError: "",
    },
    asset: null,
    startTime: new Date("2023-01-01"),
  }));

  const handleSetMarketAddress = (value: string) => {
    state.marketAddress = value;
    if (isAddress(value)) {
      state.error.marketAddressError = "";
    } else {
      state.error.marketAddressError = "invalid address!";
    }
  };

  const handleSetTYAddress = (value: string) => {
    state.ytAddress = value;
    if (isAddress(value)) {
      state.error.ytAddressError = "";
    } else {
      state.error.ytAddressError = "invalid address!";
    }
  };

  const handleGetAsset = (
    assets = [],
    baseType = "YT",
    marketContract: string
  ) => {
    const asset = assets.filter(
      (i: any) => i.address == marketContract || i.baseType == baseType
    );
    console.log(asset[0]);

    return asset[0];
  };

  useEffect(() => {
    if (state.network) {
      cmsStore.getAssets(state.network);
      if (
        cmsStore.pendleAssets.length > 0 &&
        state.ytAddress &&
        !state.error.ytAddressError
      ) {
        handleGetAsset(cmsStore.pendleAssets, BASE_TYPE, state.ytAddress);
      }
    }
  }, [state.network, state.ytAddress]);

  const analyzer = () => {
    console.log(state);
  };

  return (
    <Flex flex={1} left>
      <Flex
        column
        width={{
          xs: "100vw",
          md: 700,
        }}
        paddingLeft={10}
      >
        <Text variant="formHeader">STRATEGY</Text>

        <Flex>
          <Text width={150}> Network:</Text>
          <Select
            color="primary"
            value={1}
            //style={{ marginTop: -25 }}
            onChange={(e) => {
              state.network = e.target.value;
            }}
          >
            <MenuItem value={1}>ethereum</MenuItem>
            <MenuItem value={42161}>arbitrum</MenuItem>
            <MenuItem value={5000}>mantle</MenuItem>
          </Select>
        </Flex>

        <Flex mt={2}>
          <Text width={200}> market contract: </Text>
          <InputWrapper
            column
            value={state.marketAddress}
            error={state.marketAddress && state.error.marketAddressError}
            onChange={(e: any) => {
              handleSetMarketAddress(e.target.value);
            }}
            width={500}
            style={{ marginLeft: 10 }}
            placeholder="Enter address!"
          />
        </Flex>
        <Flex mt={3}>
          <Text width={200}> YT contract:</Text>
          <InputWrapper
            column
            value={state.ytAddress}
            width={150}
            error={state.ytAddress && state.error.ytAddressError}
            style={{ marginLeft: 10 }}
            onChange={(e: any) => {
              handleSetTYAddress(e.target.value);
            }}
            placeholder="Enter address!"
          />
        </Flex>

        <Flex mt={3}>
          <Text width={200}> underlying_amount: </Text>
          <InputWrapper
            column
            type="text"
            value={1}
            width={150}
            //error={}
            style={{ marginLeft: 10 }}
            onChange={(e: any) => {
              state.underlyingAmount = e.target.value;
            }}
            isNumber
            placeholder="Enter amount"
          />
        </Flex>

        <Flex mt={3}>
          <Text> points_per_hour_per_underlying:</Text>
          <InputWrapper
            column
            type="text"
            value={1}
            width={150}
            style={{ marginLeft: 10 }}
            //error={}
            onChange={(e: any) => {
              state.pointPerHour = e.target.value;
            }}
            placeholder="Enter amount"
            isNumber
          />
        </Flex>

        <Flex mt={3}>
          <Text width={200}> pendle_yt_multiplier:</Text>
          <InputWrapper
            column
            type="text"
            value={1}
            width={150}
            style={{ marginLeft: 10 }}
            //error={}
            onChange={(e: any) => {
              state.pendelYTMultiplier = e.target.value;
            }}
            placeholder="Enter Amount"
            isNumber
          />
        </Flex>

        <Flex mt={3}>
          <Text variant="dialogHeader" width={200}>
            Optional Form #1
          </Text>
          <Checkbox
            color="primary"
            onChange={(e) => {
              if (e.target.checked) {
                state.isUseOptionalFrom1 = true;
              } else {
                state.isUseOptionalFrom1 = false;
              }
            }}
            style={{ backgroundColor: "none", color: "white" }}
          ></Checkbox>
        </Flex>
        {/* ----- Optional Form #1 ------  */}
        {state.isUseOptionalFrom1 ? (
          <>
            {" "}
            <Flex mt={3}>
              <Text> yt_purchase_time:</Text>
              <InputWrapper
                column
                type="password"
                value={1}
                width={160}
                style={{ marginLeft: 10 }}
                //error={}

                onChange={(e: any) => {}}
                placeholder="Enter password"
              />
            </Flex>
            <Flex mt={3}>
              <Text width={200}> underlying_invest_amount:</Text>
              <InputWrapper
                column
                type="password"
                value={1}
                width={150}
                style={{ marginLeft: 10 }}
                //error={}
                onChange={(e: any) => {}}
                placeholder="Enter password"
              />
            </Flex>
          </>
        ) : null}

        <Flex mt={3}>
          <Text variant="dialogHeader" width={200}>
            Optional Form #2
          </Text>
          <Checkbox
            color="primary"
            onChange={(e) => {
              if (e.target.checked) {
                state.isUseOptionalFrom2 = true;
              } else {
                state.isUseOptionalFrom2 = false;
              }
            }}
            style={{ backgroundColor: "none", color: "white" }}
          ></Checkbox>
        </Flex>
        {/* ----- Optional Form #2 ------  */}
        {state.isUseOptionalFrom2 ? (
          <>
            {" "}
            <Flex mt={3}>
              <Text> limmit_order_yt_estimated_purchase_time:</Text>
              <InputWrapper
                column
                type="password"
                value={1}
                width={150}
                //error={}
                style={{ marginLeft: 10 }}
                onChange={(e: any) => {}}
                placeholder="Enter password"
              />
            </Flex>
            <Flex mt={3}>
              <Text width={200}> limmit_order_implied_apy_0_to_1:</Text>
              <InputWrapper
                column
                type="password"
                value={1}
                width={150}
                //error={}
                style={{ marginLeft: 10 }}
                onChange={(e: any) => {}}
                placeholder="Enter password"
              />
            </Flex>
            <Flex mt={3}>
              <Text width={200}> limmit_order_underlying_invest_amount:</Text>
              <InputWrapper
                column
                type="password"
                value={1}
                width={150}
                //error={}
                style={{ marginLeft: 10 }}
                onChange={(e: any) => {}}
                placeholder="Enter password"
              />
            </Flex>
          </>
        ) : null}

        {
          <Flex mt={3}>
            <Text width={200}>dark_mode</Text>
            <Checkbox
              color="primary"
              onChange={(e) => {
                if (e.target.checked) {
                  state.query = {};
                } else {
                  state.query = { rank: 1, breed: 1 };
                }
              }}
              style={{ backgroundColor: "none", color: "white" }}
            ></Checkbox>
          </Flex>
        }

        <Flex center justifyContent="space-between" mt={5}>
          <Flex flex={1} height="100%" column center>
            <Button
              fullWidth
              onClick={() => {
                analyzer();
              }}
              variant="contained"
              color="secondary"
              style={{ padding: "10px 0", height: "auto", flex: 1 }}
            >
              ANALYZER
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    container: {
      backgroundColor: Colors.pageBg,
      minHeight: "calc(var(--vh, 1vh) * 100 - 70px)",
      width: "100%",
      color: "white",
    },
    block: {
      backgroundColor: Colors.drawerBg,
      borderRadius: "6px",
      border: "1px solid #1F233C",
      padding: 3,
      margin: 8,
    },
  })
);

export default observer(StrategyPage);
