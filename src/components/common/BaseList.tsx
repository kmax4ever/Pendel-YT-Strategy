import React, { useEffect, Fragment } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import Loading from "./Loading";
import Empty from "./Empty";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import queryString from "query-string";
import Pagination from "@material-ui/lab/Pagination";
import { Box } from "@material-ui/core";

const PAGE_SIZE = 20;

export interface BaseListProps {
  data: any[];
  renderItem: (item: any, index?: number) => JSX.Element;
  isScrollToBottom: boolean;
  getDataFn: Function;
  getDataParams: object;
  emptyText?: string;
  paginationOptions?: {
    total: number;
    pageSize?: number;
  };
}

const BaseList: React.FC<BaseListProps> = ({
  data = [],
  renderItem,
  isScrollToBottom,
  getDataFn = () => {},
  getDataParams = {},
  emptyText = "",
  paginationOptions,
}: BaseListProps) => {
  const location = useLocation();
  const searchparams = queryString.parse(location.search);
  const { t } = useTranslation();
  // ======== datas =========
  const state = useLocalStore(() => ({
    isLoadingData: false,
    isInitialized: false,
    isSyncing: false,
    page: 1,
  }));
  const pageSize =
    (paginationOptions && paginationOptions.pageSize) || PAGE_SIZE;

  // ======== functions =========
  const loadData = async (isLoadingMore?: boolean, customSkip?: number) => {
    if (!isLoadingMore) {
      state.isInitialized = false;
    }
    if (state.isLoadingData) {
      return;
    }

    state.isLoadingData = true;
    try {
      await getDataFn({
        ...getDataParams,
        skip: isLoadingMore
          ? customSkip !== undefined
            ? customSkip
            : data.length
          : 0,
        limit: paginationOptions?.pageSize,
        isReplaceAll: paginationOptions ? true : false,
      });
    } catch (err) {
      console.log(err);
    }
    state.isLoadingData = false;
    state.isInitialized = true;
  };

  const onPaginationChange = (event: any, page: number) => {
    const skip = (page - 1) * pageSize;
    loadData(true, skip);
  };

  // ======== effects =========
  useEffect(() => {
    loadData();
  }, [getDataParams]);

  useEffect(() => {
    if (isScrollToBottom) {
      loadData(true);
    }
  }, [isScrollToBottom]);

  useEffect(() => {
    let timeout: any;
    if (searchparams.sync) {
      state.isSyncing = true;
      timeout = setTimeout(() => {
        loadData();
        state.isSyncing = false;
      }, 6000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [searchparams.sync]);

  // ======== renders =========

  return useObserver(() => {
    if (!state.isInitialized) {
      return (
        <Box justifyContent="center" alignItems="center">
          <Loading />
        </Box>
      );
    }

    if (data.length === 0) {
      return (
        <Fragment>
          {state.isSyncing ? (
            <Box mb={2} justifyContent="center">
              <Loading
                iconStyle={{ width: 50, height: 50 }}
                textColor="#215AA7"
                text={t(
                  "sync_blockchain",
                  `Your action need take some seconds to get sync with blockchain...`
                )}
              />
            </Box>
          ) : null}
          <Empty title="" text={emptyText || t("empty_data", "Empty Data")} />
        </Fragment>
      );
    }

    return (
      <Fragment>
        {state.isSyncing ? (
          <Box mb={2} justifyContent="center">
            <Loading
              iconStyle={{ width: 50, height: 50 }}
              textColor="#215AA7"
              text={t(
                "sync_blockchain",
                `Your action need take some seconds to get sync with blockchain...`
              )}
            />
          </Box>
        ) : null}
        {data.map((item) => {
          return renderItem(item);
        })}
        {paginationOptions ? (
          <Box justifyContent="center" alignItems="center" mt={3}>
            <Pagination
              disabled={state.isLoadingData}
              defaultPage={1}
              count={paginationOptions.total / pageSize}
              onChange={onPaginationChange}
            />
          </Box>
        ) : null}
      </Fragment>
    );
  });
};

export default BaseList;
