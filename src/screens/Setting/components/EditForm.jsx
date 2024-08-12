import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ConfirmModalInstance } from "App";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { getErrorMessageFromServer } from "utils/helper";
import Text from "components/common/Text";
import { setSystemParams } from "api/cms";
import useDepsContainer from "hooks/useDepsContainer";

export default function EditForm(props: any) {
  const { cmsStore } = useDepsContainer();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);

  const onConfirm = async () => {
    setIsLoading(true);
    try {
      let _value;
      if (!props.isString && typeof +value === "number") {
        _value = +value;
      } else if (props.isString) {
        _value = value;
      }
      let key = props.paramKey;
      if (props.subParamKey) {
        key += `.${props.subParamKey}`;
      }
      if (props.subParamKey2) {
        key += `.${props.subParamKey2}`;
      }
      if (key.includes("PAUSE") && ["true", "false"].includes(_value)) {
        _value = _value === "true" ? true : false;
      }

      await setSystemParams(key, _value);
      await cmsStore.getSystemParams();
      ConfirmModalInstance.addMessage({
        children: "Update Param success!",
        isSuccessErrorAlert: "SUCCESS",
      });
      props.handleClose();
    } catch (err) {
      ConfirmModalInstance.addMessage({
        children: getErrorMessageFromServer(err),
        isSuccessErrorAlert: "ERROR",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setValue(props.initValue);
  }, []);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      style={{ overflowX: "hidden" }}
    >
      <DialogTitle id="form-dialog-title">
        <Text variant="h5">Edit System Param</Text>
      </DialogTitle>
      <DialogContent style={{ width: 300 }}>
        <DialogContentText style={{ color: "white" }}>
          Enter new value
        </DialogContentText>
        <TextField
          type={!props.isString ? "number" : undefined}
          autoFocus
          margin="dense"
          label="Value"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <LoadingButton pending={isLoading} onClick={onConfirm} color="primary">
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
