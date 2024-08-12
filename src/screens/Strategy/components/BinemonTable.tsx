import { createStyles, makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { getListBinemon } from "api/cms";
import { ConfirmModalInstance, UserDetailModalInstance } from "App";
import Flex from "components/common/Flex";
import TableWrapper, {
  TableWrapperColumn,
} from "components/common/TableWrapper";
import Text from "components/common/Text";
import { SETTINGS } from "config";
import { BREED, MONCLASS, RANK } from "config/constants";
import getLodash from "lodash/get";
import { observer, useLocalStore } from "mobx-react";
import React, { useEffect } from "react";
import { AppTheme, Colors } from "styles/theme";
import { clipAddressText, getErrorMessageFromServer } from "utils/helper";

interface BinemonTableProps {
  query: any;
  trigger: number;
}

const BinemonTable = (props: BinemonTableProps) => {
  const PAGE_LIMIT = 10;
  const styles = useStyles(props);
  const state = useLocalStore(() => ({
    isChangingPage: false,
    data: [1, 2, 3, 4, 5],
    total: 0,
    isShowUserDetailModal: false,
    currentSelectUsername: "",
  }));

  const totalPage = Math.ceil(state.total / PAGE_LIMIT);
  const data: any = state.data.map((item: any) => {
    return {
      thumbnail: item.thumbnail,
      tokenID: item.tokenID,
      isEgg: item.isEgg,
      breed: item.breed,
      class: item.class,
      rank: item.rank,
      level: item.level,
      owner: item.walletAddress,
    };
  });

  useEffect(() => {
    handleChangePage(null, 1);
  }, [props.trigger]);

  const columns: TableWrapperColumn[] = [
    {
      cellRenderer: (value, row) => (
        <Flex
          centerY
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (row.isEgg) {
              window.open(
                `https://explorer.draken.tech/tokens/${SETTINGS.BINEMON_ADDRESS}/instance/${value}`
              );
            } else {
              window.open(`https://binemon.io/Binemon/${value}`);
            }
          }}
        >
          <img
            src={
              row.isEgg
                ? "https://api-bsc.binemon.io/client/egg.jpeg"
                : row.thumbnail
            }
            style={{ width: 80, height: 80, marginRight: 16 }}
            alt="img"
          />
          <Text variant="link">{value}</Text>
        </Flex>
      ),
      dataKey: "tokenID",
      label: "tokenID",
    },
    {
      cellRenderer: (value) => (
        <Text color="white">{BREED[value] && BREED[value].label}</Text>
      ),
      dataKey: "breed",
      label: "breed",
    },
    {
      cellRenderer: (value) => (
        <Text color="white">{MONCLASS[value] && MONCLASS[value].label}</Text>
      ),
      dataKey: "class",
      label: "class",
    },

    {
      cellRenderer: (value) => (
        <Text color="white">{RANK[value] && RANK[value].label}</Text>
      ),
      dataKey: "rank",
      label: "rank",
    },
    {
      cellRenderer: (value) => <Text color="white">{value}</Text>,
      dataKey: "level",
      label: "level",
    },

    {
      cellRenderer: (value) => (
        <Text
          variant="link"
          onClick={() => {
            UserDetailModalInstance.addModal({ address: value });
          }}
        >
          {clipAddressText(value)}
        </Text>
      ),
      dataKey: "owner",
      label: "owner",
    },
  ];

  const handleChangePage = async (e: any, page: number) => {
    try {
      state.isChangingPage = true;
      const response = await getListBinemon({
        ...props.query,
        // skip: (page - 1) * PAGE_LIMIT,
        page: page,
        limit: PAGE_LIMIT,
      });
      state.data = getLodash(response, "data.response", []);
      state.total = getLodash(response, "data.meta.count", 0);
    } catch (err) {
      ConfirmModalInstance.addMessage({
        children: getErrorMessageFromServer(err),
        isSuccessErrorAlert: "ERROR",
      });
    }
    state.isChangingPage = false;
  };

  return (
    <>
      <Text style={{fontSize:20, marginBottom:10}}> Total : {state.total}</Text>
      <TableWrapper data={data} columns={columns} />

      {totalPage > 1 ? (
        <Flex center my={2} pt={2} borderTop={`1px solid ${Colors.border}`}>
   

          <Pagination
            style={{ color: "white" }}
            size={"large"}
            count={totalPage}
            color="primary"
            onChange={handleChangePage}
            disabled={state.isChangingPage}
            shape="rounded"
          />
        </Flex>
      ) : null}
    </>
  );
};

const useStyles = makeStyles((theme: AppTheme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    hideLastBorder: {
      "&:last-child td, &:last-child th": {
        border: 0,
      },
    },
  })
);

export default observer(BinemonTable);
