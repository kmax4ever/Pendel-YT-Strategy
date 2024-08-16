import React, { useEffect } from "react";
import { AppTheme, Colors } from "styles/theme";
import { Box, Button, createStyles, makeStyles } from "@material-ui/core";
import Flex from "components/common/Flex";
import useDepsContainer from "hooks/useDepsContainer";
import EditForm from "./components/EditForm";
import { observer, useLocalStore } from "mobx-react";

interface SystemParamPageProps {}

const SystemParamPage = (props: SystemParamPageProps) => {
  const styles = useStyles(props);
  const state = useLocalStore(() => ({
    isOpenEditForm: false,
    key: "",
    subKey: "",
    initValue: 0,
    isString: false,
  }));
  const { pendelStore: cmsStore } = useDepsContainer();
  const { systemParams } = cmsStore;

  useEffect(() => {
    cmsStore.getSystemParams();
  }, []);

  const onEditBtnClicked = (
    key: string,
    initValue: number,
    subKey?: string
  ) => {
    state.isOpenEditForm = true;
    state.key = key;
    state.initValue = initValue;
    state.subKey = subKey || "";
    if (key.includes("PAUSE")) {
      state.isString = true;
    } else {
      state.isString = false;
    }
  };

  return (
    <Flex className={styles.block} p={2} m={2} column>
      {Object.keys(systemParams).map((key) => {
        if (key === "STAT_CONFIG" || key === "BUY_ITEMS_PRICE") {
          return null;
        }
        return (
          <Flex
            style={{ color: "white" }}
            key={key}
            py={1}
            borderBottom={`1px dashed ${Colors.border}`}
          >
            <Flex style={{ color: Colors.primary }} flex={1}>
              {key}
            </Flex>
            {typeof systemParams[key] !== "object" ? (
              <Flex flex={2} justifyContent="space-between">
                <Flex>{cmsStore.systemParams[key].toString()}</Flex>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onEditBtnClicked(key, cmsStore.systemParams[key]);
                  }}
                >
                  Edit
                </Button>
              </Flex>
            ) : (
              <Flex flex={2} column>
                {Object.keys(cmsStore.systemParams[key]).map((subkey) => {
                  if (subkey === "BP") {
                    return null;
                  }
                  return (
                    <Flex
                      flex={1}
                      key={subkey}
                      borderBottom={`1px dashed ${Colors.border}`}
                      center
                      pb={"5px"}
                    >
                      <Flex flex={1} style={{ color: Colors.up }}>
                        {subkey}
                      </Flex>
                      <Flex center flex={1} justifyContent="space-between">
                        <Flex>{cmsStore.systemParams[key][subkey]}</Flex>
                        <Button
                          onClick={() => {
                            onEditBtnClicked(
                              key,
                              cmsStore.systemParams[key][subkey],
                              subkey
                            );
                          }}
                          variant="contained"
                          color="primary"
                        >
                          Edit
                        </Button>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Flex>
        );
      })}

      {state.isOpenEditForm ? (
        <EditForm
          open={state.isOpenEditForm}
          handleClose={() => {
            state.isOpenEditForm = false;
          }}
          paramKey={state.key}
          subParamKey={state.subKey}
          initValue={state.initValue}
          isString={state.isString}
        />
      ) : null}
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

export default observer(SystemParamPage);
