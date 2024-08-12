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
import React from "react";
import { AppTheme, Colors } from "styles/theme";
import UsersTable from "./components/BinemonTable";

interface BinemonPageProps {}

const StrategyPage = (props: BinemonPageProps) => {
  const styles = useStyles(props);
  const state = useLocalStore(() => ({
    query: {
      breed: 1,
      rank: 1,
    } as any,
    searchTrigger: 0,
  }));

  return (
    // <Flex className={styles.container} p={2} column>
    //   <Flex
    //     className={styles.block}
    //     column
    //     mt={5}
    //     p={5}
    //     height="100%"
    //     overflow="auto"
    //     minHeight={500}
    //   >
    //     <Flex mb={2} gridRow>
    //       <Flex mx={2} column>
    //         <Flex mx={2} gridRow>
    //           <Text color="gray">Network:</Text>
    //           <Select
    //             variant="filled"
    //             color="primary"
    //             value={state.query.rank}
    //             onChange={(e) => {
    //               state.query.rank = e.target.value;
    //             }}
    //           >
    //             <MenuItem value={1}>ethereum</MenuItem>
    //             <MenuItem value={42161}>arbitrum</MenuItem>
    //             <MenuItem value={5000}>mantle</MenuItem>
    //           </Select>
    //         </Flex>

    //         <Text color="gray">market contract:</Text>
    //         <InputWrapper
    //           placeholder="TokenId"
    //           value={state.query.tokenID || ""}
    //           onChange={(e) => {
    //             state.query.tokenID = e.target.value;
    //           }}
    //         />
    //       </Flex>
    //       <Flex mx={2} column></Flex>
    //       {/*
    //       <Flex ml={2} column justifyContent="flex-end">
    //         <Text color="gray">Select All</Text>
    //         <Checkbox
    //           color="primary"
    //           onChange={(e) => {
    //             if (e.target.checked) {
    //               state.query = {};
    //             } else {
    //               state.query = { rank: 1, breed: 1 };
    //             }
    //           }}
    //           style={{ backgroundColor: "#16192a", color: "white" }}
    //         ></Checkbox>
    //       </Flex> */}
    //       <Flex ml={2} column justifyContent="flex-end">
    //         <Button
    //           onClick={() => {
    //             state.searchTrigger++;
    //           }}
    //           variant="contained"
    //         >
    //           VIEW
    //         </Button>
    //       </Flex>
    //     </Flex>
    //     {/* <UsersTable query={state.query} trigger={state.searchTrigger} /> */}
    //   </Flex>
    // </Flex>

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
            value={state.query.rank}
            //style={{ marginTop: -25 }}
            onChange={(e) => {
              state.query.rank = e.target.value;
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
            value={1}
            //error={}
            onChange={(e: any) => {}}
            width={500}
            style={{ marginLeft: 10 }}
            placeholder="Enter username"
          />
        </Flex>
        <Flex mt={3}>
          <Text width={200}> YT contract:</Text>
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
          <Text width={200}> underlying_amount: </Text>
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
          <Text> points_per_hour_per_underlying:</Text>
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

        <Flex mt={3}>
          <Text width={200}> pendle_yt_multiplier:</Text>
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

        <Flex mt={3}>
          <Text width={200}>Optional Form #1</Text>
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
        {/* ----- Optional Form #1 ------  */}

        <Flex mt={3}>
          <Text> yt_purchase_time:</Text>
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

        <Flex mt={3}>
          <Text width={200}>Optional Form #2</Text>
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
        {/* ----- Optional Form #2 ------  */}

        <Flex mt={3}>
          <Text> limmit_order_yt_estimated_purchase_time :</Text>
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
              onClick={() => {}}
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
