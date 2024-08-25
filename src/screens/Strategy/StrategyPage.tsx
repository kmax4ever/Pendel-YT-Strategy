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
import DateTimePicker from "react-datetime-picker";
import DatePicker from "react-datepicker";
const _ = require("lodash");

import "react-datepicker/dist/react-datepicker.css";
interface BinemonPageProps {}
const CONFIG_NETWORK = {
  1: `Ethereum`,
  42161: "Arbitrum",
  5000: `Mantle`,
};

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
    FAIRS: [] as any,
    fairHourRange: [] as any,
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
    hRange: 0,
    impliedApyAvgSum: 0,
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

  const selectTime = (e) => {
    if (e) {
      state.ytPurchaseTime = e;
      console.log(` state.ytPurchaseTime`, state.ytPurchaseTime);
    }
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

      state.datas[i][`Time`] = new Date(timestamp).toJSON();

      state.datas[i]["hourToMaturity"] = hourToMaturity;

      const longYieldApy =
        (1 + (underlyingApy - impliedApy / impliedApy)) **
          (8760 / hourToMaturity) -
        1;

      state.datas[i]["longYieldApy"] = longYieldApy;
      console.log("xxx longYieldApy", {
        underlyingApy,
        impliedApy,
        hourToMaturity,
        longYieldApy,
      });
      const ytUnderlying = (impliedApy + 1) ** (hourToMaturity / 8760) - 1;
      //const ytUnderlying = impliedApy + 1 ** (hourToMaturity / 8760) - 1;

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

      state.impliedApyAvgSum += impliedApyAverage;
      // console.log("impliedApyAverage", impliedApyAverage);
      // console.log("  state.impliedApyAvgSum", state.impliedApyAvgSum);

      const weightedPoints = (points * volume) / pendleStore.sumVolume;
      state.datas[i].weightedPoints = weightedPoints;
      state.weightedPointsPerUnderlying += weightedPoints;
    }
    //CACULATE FAIR
    // for (let i = 0; i < state.datas.length; i++) {
    //   const { timestamp } = state.datas[i];

    //   const secondsRange =
    //     new Date(state.maturityTime).getTime() / 1000 -
    //     new Date(timestamp).getTime() / 1000;

    //   console.log("seconds range", secondsRange);
    //   const hourRange = secondsRange / 3600;
    //   console.log("xxx hourRange", hourRange);

    //   const fairValueCurve =
    //     1 - 1 / (1 + state.impliedApyAvgSum) ** (hourRange / 8670);

    //   console.log("fairValueCurve", fairValueCurve);
    //   state.datas[i][`fair`] = fairValueCurve; // recheck
    // }

    const maxTimestampOfDatas =
      new Date(state.datas[state.datas.length - 1].timestamp).getTime() / 1000;

    const index = 2056 - state.datas.length;
    const range = index * 3600;
    const end = new Date((maxTimestampOfDatas + range) * 1000);
    const length = state.datas.length;
    console.log(end.toJSON());

    for (let i = 0; i < 2056; i++) {
      let timestamp = state.datas[i]
        ? new Date(state.datas[i].timestamp).getTime() / 1000
        : 0;

      if (!timestamp) {
        const range = (i - length) * 3600;
        timestamp = maxTimestampOfDatas + range;
      }

      const secondsRange = new Date(end).getTime() / 1000 - timestamp;

      const hourRange = secondsRange / 3600;
      console.log("i", i);

      console.log("xxx hourRange", hourRange);

      const fairValueCurve =
        1 - 1 / (1 + state.impliedApyAvgSum) ** (hourRange / 8670);

      console.log("fairValueCurve", i, fairValueCurve);
      //state.datas[i][`fair`] = fairValueCurve; // recheck
      state.FAIRS.push(fairValueCurve);
      const date = new Date(timestamp * 1000);
      console.log(date.toJSON());

      state.fairHourRange.push(date.toJSON());
    }

    console.log("state hourrange", state.fairHourRange);

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

    //TODO missing fair, difference

    console.log(
      "fair",
      state.datas.map((i) => i.fair)
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

  const rolingStdBfillArr = (arr = [], windowNumber = 0) => {
    return arr
      .map((_, index, array) => {
        if (index < windowNumber - 1) return null;
        const window = array.slice(index - windowNumber + 1, index + 1);
        const mean =
          window.reduce((sum, value) => sum + value, 0) / window.length;
        const variance =
          window.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
          window.length;
        return Math.sqrt(variance);
      })
      .map((value) => (value === null ? undefined : value));
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
              value={state.underlyingAmount}
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
              value={state.pointPerHour}
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
              value={state.pendelYTMultiplier}
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
            <Text width={200}> purchase time:</Text>
            <DatePicker
              onChange={(e: any) => {
                selectTime(e);
              }}
              selected={new Date(state.ytPurchaseTime)}
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
        </Flex>
      </Flex>

      {!state.chart1Loading ? (
        <Skeleton count={10} />
      ) : (
        <>
          <Plot
            data={[
              {
                x: state.datas.map((i) => i.Time),
                y: pendleStore.apy.map((i: any) => i.ytUnderlying),
                mode: "lines",
                name: "YT price",
                yaxis: "y3",
              },

              {
                x: state.datas.map((i) => i.Time),
                y: rolingStdBfillArr(
                  state.datas.map((i) => i.ytUnderlying),
                  state.config.volatility_window
                ),
                mode: "lines",
                name: "Volatility",
                yaxis: "y5",
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
                yaxis: "y3",
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
                yaxis: "y3",
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
                yaxis: "y3",
              },
              {
                x: state.datas.map((i) => i.Time),
                y: state.MACD,
                mode: "lines",
                name: "MACD",
                yaxis: "y4",
              },
              {
                x: state.datas.map((i) => i.Time),
                y: state.SignalLine,
                mode: "lines",
                name: "SignalLine",
                yaxis: "y4",
              },
              {
                mode: `lines`,
                x: [
                  new Date(state.ytPurchaseTime).toJSON(),
                  new Date(state.ytPurchaseTime).toJSON(),
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
              title: `${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } YT/Underlying Asset`,
              XAxis: { title: "Time" },
              YAxis: { title: "YT Price (per Underlying)" },
              yaxis2: { overlaying: "y", position: 0.85, side: "right" },
              yaxis3: { overlaying: "y", position: 0.85, side: "right" },
              yaxis4: { overlaying: "y", position: 0.95, side: "right" },
              yaxis5: { overlaying: "y", position: 0.95, side: "right" },
            }}
          />

          <Plot
            data={[
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.points),
                mode: "lines",
                name: "Points",
              },
              {
                mode: `lines`,
                x: [
                  new Date(state.ytPurchaseTime).toJSON(),
                  new Date(state.ytPurchaseTime).toJSON(),
                ],
                y: [
                  _.min(state.datas.map((i) => i.points)),
                  _.max(state.datas.map((i) => i.points)),
                ],
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
              title: ` ${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } <br />|Total number of points earned from ${
                state.underlyingAmount
              } underlying investment in YT at a certain time`,
              XAxis: { title: "Time" },
              YAxis: { title: "Points" },
            }}
          />

          <Plot
            data={[
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.ytUnderlying),
                mode: "lines",
                name: "YT Price",
                yaxis: "y1",
              },
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.points),
                mode: "lines",
                name: "Points Earned",
                yaxis: "y2",
              },
              {
                x: state.fairHourRange,
                y: state.FAIRS,
                mode: "lines",
                name: "Fair Value Curve of YT",
                line: {
                  color: "yellow",
                  width: 3,
                  dash: "dashdot",
                },
              },
              {
                mode: `lines`,
                x: [
                  new Date(state.ytPurchaseTime).toJSON(),
                  new Date(state.ytPurchaseTime).toJSON(),
                ],
                y: [
                  _.min(state.datas.map((i) => i.ytUnderlying)),
                  _.max(state.datas.map((i) => i.ytUnderlying)),
                ],
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
              title: `${state.symbol} on ${CONFIG_NETWORK[state.network]} [${
                state.underlyingAmount
              } underlying coin]<br />|BUY YT WHEN THE yt Price IS UNDER THE FAIR VALUE CURVE TO MAXIMIZE POINTS EARNED`,
              XAxis: { title: "Certain Time of Purchasing YT" },
              yaxis1: { title: "YT Price", side: "left" },
              yaxis2: {
                title: "Points Earned",
                side: "right",
                overlaying: "y",
              },
            }}
          />

          <Plot
            data={[
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.longYieldApy), //TODO fix
                mode: "lines",
                name: "Long Yield APY",
                text: "Long Yield APY",
              },
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.impliedApy),
                mode: "lines",
                name: "Implied APY",
                yaxis: "y3",
              },
              {
                mode: `lines`,
                x: [
                  new Date(state.ytPurchaseTime).toJSON(),
                  new Date(state.ytPurchaseTime).toJSON(),
                ],
                y: [
                  _.min(state.datas.map((i) => i.impliedApy)),
                  _.max(state.datas.map((i) => i.impliedApy)),
                ],
                line: {
                  color: "green",
                  width: 3,
                  dash: "dashdot",
                },
                name: "YT Purchase time",
                text: "YT Purchase time",
                yaxis: "y4",
              },
            ]}
            layout={{
              width: 1500,
              height: 1000,
              title: `${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } <br />|Long Yield APY V.S. Implied APY`,
              XAxis: { title: "Time" },
              yaxis3: { title: "Implied APY", side: "right", overlaying: "y" },
              yaxis4: { title: "YT Purchase time", overlaying: "y" },
            }}
          />

          <Plot
            data={[
              {
                x: state.datas.map((i) => i.Time),
                y: state.datas.map((i) => i.weightedPoints),
                mode: "lines",
                name: "Weighted Points ",
              },

              {
                mode: `lines`,
                x: [
                  new Date(state.ytPurchaseTime).toJSON(),
                  new Date(state.ytPurchaseTime).toJSON(),
                ],
                y: [
                  _.min(state.datas.map((i) => i.weightedPoints)),
                  _.max(state.datas.map((i) => i.weightedPoints)),
                ],
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
              title: `${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } <br /> |Weighted Points (by Volume) Over Time`,
              XAxis: { title: "Time" },
              YAxis: { title: "Weighted Points" },
            }}
          />

          <Plot
            data={[
              {
                //x: state.datas.map((i) => i.time),
                y: state.datas.map((i) => i.points),
                type: "bar",
                name: "Weighted Points",
                nBinsx: 300,
              },
            ]}
            layout={{
              width: 1500,
              height: 1000,
              title: `${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } <br />|Distribution of Hours per Points Interval Before Weighting`,
              XAxis: { title: "Time" },
              YAxis: { title: "Weighted Points" },
            }}
          />

          <Plot
            data={[
              {
                // x: state.datas.map((i) => i.time),
                y: state.datas.map((i) => i.weightedPoints),
                type: "bar",
                name: "Number of Hours",
                nBinsx: 300,
              },
            ]}
            layout={{
              width: 1500,
              height: 1000,
              title: `${state.symbol} on ${
                CONFIG_NETWORK[state.network]
              } <br />|Distribution of Hours per Points Interval After Volume Weighting|`,
              XAxis: { title: "Weighted Points" },
              YAxis: { title: "Number of Hours" },
            }}
          />
        </>
      )}
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
