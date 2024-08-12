import { createStyles, IconButton, makeStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import { getStatisticsUser, getUserDetailByWalletAddress } from "api/cms";
import Flex from "components/common/Flex";
import Loading from "components/common/Loading";
import Text from "components/common/Text";
import { observer, useLocalStore } from "mobx-react";
import React, { useEffect } from "react";
import { AppTheme, Colors } from "styles/theme";

function UserDetailModal(props: { address: string; handleClose: any }) {
  const state = useLocalStore(() => ({
    user: {
      walletAddress: props.address,
    },
    statistic: {
      totalBinemon: 0,
      totalFused: 0,
      totalBuy: 0,
      totalSell: 0,
      totalBuyAmbs: 0,
      ambsBalance: 0,
    },
  }));
  const styles = useStyles(props);
  //@ts-ignore

  useEffect(() => {
    const funcGetStatistic = async () => {
      try {
        const response = await getStatisticsUser({ address: props.address });
        state.statistic = {
          ...state.statistic,
          ...response.data,
        };
      } catch (err) {
        console.log(err);
      }
    };
    funcGetStatistic();

    const funcGetDetail = async () => {
      try {
        const response = await getUserDetailByWalletAddress(props.address);
        state.user = {
          ...state.user,
          ...response.data.response.user,
        };
      } catch (err) {
        console.log(err);
      }
    };
    funcGetDetail();
  }, []);

  return (
    <Dialog
      open={true}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      style={{ overflowX: "hidden" }}
      maxWidth={"lg"}
    >
      <DialogTitle id="form-dialog-title">
        <Text textAlign="center" variant="h4" color="primary">
          {"Address Detail"}
        </Text>
        <IconButton
          aria-label="close"
          className={styles.closeButton}
          onClick={props.handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!state.user ? (
          <Flex>
            <Loading />
          </Flex>
        ) : (
          <Flex column>
            {state.user.userName ? (
              <Flex>
                <Text variant="h5" color="columnHeader">
                  Username:{" "}
                </Text>
                <Text ml={2} variant="h5">
                  {state.user.userName}
                </Text>
              </Flex>
            ) : null}
            {state.user.email ? (
              <Flex mt={1}>
                <Text variant="h5" color="columnHeader">
                  Email:{" "}
                </Text>
                <Text ml={2} variant="h5">
                  {state.user.email}
                </Text>
              </Flex>
            ) : null}
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Wallet Address:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.user.walletAddress}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Total Binemon:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.totalBinemon}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Total Fused Binemon:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.totalFused}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Total Buy Binemon:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.totalBuy}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Total Sell Binemon:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.totalSell}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Total Buy Ambrosia:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.totalBuyAmbs}
              </Text>
            </Flex>
            <Flex mt={1}>
              <Text variant="h5" color="columnHeader">
                Current Ambrosia:{" "}
              </Text>
              <Text ml={2} variant="h5">
                {state.statistic.ambsBalance}
              </Text>
            </Flex>
          </Flex>
        )}

        <Text variant="dialogHeader" my={2}>
          List Binemon
        </Text>
      </DialogContent>
    </Dialog>
  );
}

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    block: {
      backgroundColor: Colors.drawerBg,
      borderRadius: "6px",
      border: "1px solid #1F233C",
      padding: 16,
    },
    subBlock: {
      width: 64,
      height: 64,
      borderRadius: 16,
      filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1))",
    },
    row: {
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      position: "absolute",
      right: -5,
      top: -5,
      color: theme.palette.grey[500],
    },
  })
);

export default observer(UserDetailModal);
