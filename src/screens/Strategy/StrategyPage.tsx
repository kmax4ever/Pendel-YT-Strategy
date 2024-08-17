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
import Plot from "react-plotly.js";
var DateTime = require("datetime-js");
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { title } from "process";

interface BinemonPageProps {}

const StrategyPage = (props: BinemonPageProps) => {
  const styles = useStyles(props);
  const { pendleStore } = useDepsContainer();
  const BASE_TYPE = "YT";
  const state = useLocalStore(() => ({
    network: 1,
    isUseOptionalFrom1: false,
    isUseOptionalFrom2: false,
    // marketAddress: "0x00b321d89a8c36b3929f20b7955080baed706d1b",
    marketAddress: "0x00b321d89a8c36b3929f20b7955080baed706d1b",
    ytAddress: "0x4f0b4e6512630480b868e62a8a1d3451b0e9192d",
    underlyingAmount: 1,
    pointPerHour: 0.04,
    pendelYTMultiplier: 5,
    error: {
      marketAddressError: "",
      ytAddressError: "",
    },
    asset: null,
    startTime: new Date("2023-01-01"),
    endTime: new Date(),
    symbol: "",
    maturityTime: null as any,
    datas: [] as any,
    weightedPointsPerUnderlying: 0,
    MACD: [],
    SignalLine: [],
    RSI: [],
    config: {
      volatility_window: 48,
      ma1: 24,
      ma2: 72,
      ma3: 216,
      rsi_window: 72,
      ema1: 12,
      ema2: 26,
      macd_signal: 9,
    },
    chart1Loading: false,
    ytPurchaseTime: "2024-08-12",
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

  const handleGetAsset = (assets = [], baseType = "YT", ytAddress: string) => {
    console.log("handleGetAsset");

    const asset = assets.filter(
      (i: any) => i.address == ytAddress && i.baseType == baseType
    ) as any;
    if (asset[0]) {
      console.log("xxx asset", asset[0]);
      state.symbol = asset[0].symbol;
      state.maturityTime = new Date(asset[0].expiry);
      console.log("xxx maturityTime ", state.maturityTime);
    }
    return asset[0];
  };

  useEffect(async () => {
    if (state.network) {
      await pendleStore.getAssets(state.network);
    }
    if (pendleStore.pendleAssets.length > 0 && state.ytAddress) {
      handleGetAsset(pendleStore.pendleAssets, BASE_TYPE, state.ytAddress);
    }
  }, [state.network]);

  const processData = async () => {
    state.datas = pendleStore.apy;

    for (let i = 0; i < state.datas.length; i++) {
      const volume = pendleStore.volume[i];
      const { timestamp, impliedApy, underlyingApy } = state.datas[i];

      const timestampSeconds = new Date(timestamp).getTime() / 1000;
      const maturityTimeSeconds = new Date(state.maturityTime).getTime() / 1000;

      const hourToMaturity = (maturityTimeSeconds - timestampSeconds) / 3600;

      state.datas[i][`Time`] = new Date(timestamp).toUTCString();

      state.datas[i]["hourToMaturity"] = hourToMaturity;

      state.datas[i]["ytUnderlying"];

      const ytUnderlying = impliedApy + 1 ** (hourToMaturity / 8760) - 1;
      const longYieldApy =
        ((1 + underlyingApy - impliedApy) / impliedApy) **
          (8760 / hourToMaturity) -
        1;

      state.datas[i]["longYieldApy"] = longYieldApy;
      console.log("xxx longYieldApy", longYieldApy);

      state.datas[i]["ytUnderlying"] = ytUnderlying;

      const price = ytUnderlying;
      const timeDiffHours = hourToMaturity; // recheck with python code
      const points =
        (1 / price) *
        timeDiffHours *
        state.pointPerHour *
        state.underlyingAmount *
        state.pendelYTMultiplier;
      state.datas[i][`points`] = points;

      if (hourToMaturity < 0) {
        console.log("timestamp", timestamp);
        console.log("maturityTime", state.maturityTime);
        process.exit();
      }

      console.log({
        price,
        timeDiffHours,
        pointPerHour: state.pointPerHour,
        underlyingAmount: state.underlyingAmount,
        pendelYTMultiplier: state.pendelYTMultiplier,
      });

      const hourRange = hourToMaturity; //recheck

      const impliedApyAverage = (impliedApy * volume) / pendleStore.sumVolume;
      const fairValueCurve =
        1 - 1 / (1 + impliedApyAverage) ** (hourRange / 8760);
      state.datas[i][`fair`] = fairValueCurve; // recheck

      const weightedPoints = (points * volume) / pendleStore.sumVolume;
      state.weightedPointsPerUnderlying += weightedPoints;
    }

    const ema12 = bfill(
      movingAverage(
        state.datas.map((i) => i.impliedApy),
        state.config.ema1
      )
    );
    const ema26 = bfill(
      movingAverage(
        state.datas.map((i) => i.impliedApy),
        state.config.ema2
      )
    );

    const MACD = [] as any;
    for (let i = 0; i < ema12.length; i++) {
      MACD.push(+ema12[i] - +ema26[i]);
    }

    const sinalLine = bfill(movingAverage(MACD, 9));

    state.MACD = MACD;
    state.SignalLine = sinalLine;

    // const delta = diff(state.datas.map((i) => i.ytUnderlying));

    // const gain = bfill(
    //   movingAverage(
    //     delta.map((i) => {
    //       if (i < 0) return 0;
    //     }),
    //     state.config.ma2
    //   )
    // );

    // const lost = bfill(
    //   movingAverage(
    //     delta.map((i) => {
    //       i = -i;
    //       if (-i > 0) return 0;
    //     }),
    //     72
    //   )
    // );

    // console.log({ gain, lost });

    // const rs = [] as any;
    // for (let i = 0; i < gain.length; i++) {
    //   rs.push(+gain[i] / +lost[i]);
    // }

    console.log(
      `poins`,
      state.datas.map((i) => i.points)
    );

    state.chart1Loading = true;
  };

  useEffect(async () => {
    if (state.ytAddress && !state.error.ytAddressError) {
      await pendleStore.getOHLCV(
        state.network.toString(),
        state.ytAddress,
        "hour",
        state.startTime.toString(),
        state.endTime.toString()
      );
      if (!state.maturityTime) {
        if (state.network) {
          await pendleStore.getAssets(state.network);
        }
        if (pendleStore.pendleAssets.length > 0 && state.ytAddress) {
          handleGetAsset(pendleStore.pendleAssets, BASE_TYPE, state.ytAddress);
        }
      }
      await processData();
    }
  }, [state.network, state.ytAddress]);

  useEffect(async () => {
    if (state.marketAddress && !state.error.marketAddressError) {
      await pendleStore.getApy(
        state.network.toString(),
        state.marketAddress,
        "hour",
        new Date(state.startTime).toString(),
        new Date().toString()
      );
    }
  }, [state.network, state.marketAddress]);

  const analyzer = () => {
    console.log(state);
  };

  const movingAverage = (data, window) => {
    const result = new Array(data.length).fill(null);
    for (let i = 0; i < data.length; i++) {
      if (i >= window - 1) {
        const windowData = data.slice(i - window + 1, i + 1);
        result[i] = windowData.reduce((sum, value) => sum + value, 0) / window;
      }
    }
    return result;
  };

  const bfill = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === null && i < arr.length - 1) {
        arr[i] = arr[i + 1];
      }
    }
    return arr;
  };

  const diff = (arr: []) => {
    const delta = arr.map((value, index, array) => {
      if (index === 0) return 0; // or any other value to represent the first diff
      return value - array[index - 1];
    });
    return delta;
  };

  return (
    <div>
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
      {state.chart1Loading ? (
        <Plot
          data={[
            {
              x: state.datas.map((i) => i.Time),
              y: pendleStore.apy.map((i: any) => i.ytUnderlying),
              mode: "lines",
              name: "YT price",
            },

            {
              x: state.datas.map((i) => i.Time),
              y: bfill(
                movingAverage(
                  state.datas.map((i) => i.impliedApy),
                  state.config.volatility_window
                )
              ),
              mode: "lines",
              name: "Volatility",
              yaxis: "y2",
            },
            {
              x: state.datas.map((i) => i.Time),
              y: bfill(
                movingAverage(
                  state.datas.map((i) => i.ytUnderlying),
                  state.config.ma1
                )
              ),
              mode: "lines",
              name: "20-day MA",
            },
            {
              x: state.datas.map((i) => i.Time),
              y: bfill(
                movingAverage(
                  state.datas.map((i) => i.ytUnderlying),
                  state.config.ma2
                )
              ),
              mode: "lines",
              name: "50-day MA",
            },

            {
              x: state.datas.map((i) => i.Time),
              y: bfill(
                movingAverage(
                  state.datas.map((i) => i.ytUnderlying),
                  state.config.ma3
                )
              ),
              mode: "lines",
              marker: { color: "#e4aa7d" },
              name: "200-day MA",
            },
            true
              ? {
                  x: state.datas.map((i) => i.Time),
                  y: state.MACD,
                  mode: "lines",
                  name: "MACD",
                  yaxis: "y4",
                }
              : null,
            true
              ? {
                  x: state.datas.map((i) => i.Time),
                  y: state.SignalLine,
                  mode: "lines",
                  name: "SignalLine",
                  yaxis: "y4",
                }
              : null,

            {
              mode: `lines`,
              x: [
                new Date(state.ytPurchaseTime).toUTCString(),
                new Date(state.ytPurchaseTime).toUTCString(),
              ],
              y: [0.1, 0.25],
              line: {
                color: "green",
                width: 3,
                dash: "dashdot",
              },
              name: "YT Purchase time",
              text: "YT Purchase time",
            },
          ]}
          layout={{
            width: 1500,
            height: 1000,
            title: `${state.symbol} on ${state.network} YT/Underlying Asset`,
            XAxis: { title: "Time" },
            YAxis: { title: "YT Price (per Underlying)" },
            yaxis2: { overlaying: "y", position: 0.85, side: "right" },
            yaxis4: { overlaying: "y", position: 0.95, side: "right" },
          }}
        />
      ) : (
        <Skeleton />
      )}

      <Plot
        data={[
          {
            x: state.datas.map((i) => i.Time),
            y: state.datas.map((i) => i.points),
            mode: "lines",
            name: "Points",
          },
          // {
          //   x: new Date("2024-08-10").toUTCString(),
          //   mode: "dash",
          //   color: "green",
          //   width: 3,
          //   name: "xx",
          //   type: "scatter",
          //   height: 1000,
          // },
          {
            mode: `lines`,
            x: [
              new Date(state.ytPurchaseTime).toUTCString(),
              new Date(state.ytPurchaseTime).toUTCString(),
            ],
            y: [1500, 4000],
            line: {
              color: "green",
              width: 3,
              dash: "dashdot",
            },
            name: "YT Purchase time",
            text: "YT Purchase time",
          },
        ]}
        layout={{
          width: 1500,
          height: 1000,
          title: ` ${state.symbol} on ${state.network} <br />|Total number of points earned from ${state.underlyingAmount} underlying investment in YT at a certain time`,
          XAxis: { title: "Time" },
          YAxis: { title: "Points" },
        }}
      />

      <Plot
        data={[
          {
            x: state.datas.map((i) => i.Time),
            y: state.datas.map((i) => i.longYieldApy),
            mode: "lines",
            name: "Long Yield APY",
            yaxis: "y1",
          },
          {
            x: state.datas.map((i) => i.Time),
            y: state.datas.map((i) => i.impliedApy),
            mode: "lines",
            name: "Implied APY",
            yaxis: "y2",
          },
          // {
          //   mode: `lines`,
          //   x: [
          //     new Date(state.ytPurchaseTime).toUTCString(),
          //     new Date(state.ytPurchaseTime).toUTCString(),
          //   ],
          //   y: [1500, 4000],
          //   line: {
          //     color: "green",
          //     width: 3,
          //     dash: "dashdot",
          //   },
          //   name: "YT Purchase time",
          //   text: "YT Purchase time",
          // },
        ]}
        layout={{
          width: 1500,
          height: 1000,
          title: `${state.symbol} on ${state.network} <br />|Long Yield APY V.S. Implied APY`,
          XAxis: { title: "Time" },
          YAxis: { title: "Long Yield APY" },
          yaxis1: { title: "Long Yield APY", side: "left" },
          yaxis2: { title: "Implied APY", side: "right", overlaying: "y" },
        }}
      />
    </div>
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
