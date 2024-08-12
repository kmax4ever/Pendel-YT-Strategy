import { InputAdornment, TextField, TextFieldProps } from "@material-ui/core";
import React, { Fragment } from "react";
import { NumberFormatProps } from "react-number-format";
import Flex from "./Flex";
import NumberInput from "./NumberInput";
import Text from "./Text";

type InputWithLabelProps = Omit<TextFieldProps, "error"> &
  NumberFormatProps & {
    title?: string;
    suffix?: string;
    error?: string;
    isNumber?: boolean;
    column?: boolean;
    keyboardStep?: number;
    isHideHelperText?: number;
  };

const InputWrapper = (props: InputWithLabelProps) => {
  const {
    column,
    title,
    suffix,
    error,
    isNumber,
    keyboardStep,
    isHideHelperText = false,
    ...rest
  } = props;
  const Component = isNumber ? NumberInput : TextField;
  return (
    <Fragment>
      <Flex
        column={column}
        width="100%"
        alignItems="baseline"
        justifyContent="space-between"
      >
        {title && (
          <Text variant="inputLabel" width={"auto"} mb={column ? 1 : 0}>
            {title}
          </Text>
        )}
        <Flex width="100%" flex={1}>
          <Component
            color="primary"
            keyboardStep={keyboardStep}
            fullWidth
            error={error ? true : false}
            variant="outlined"
            inputProps={
              isNumber
                ? {
                    inputMode: "decimal",
                    step: "any",
                  }
                : undefined
            }
            step={isNumber ? "any" : undefined}
            allowedDecimalSeparators={isNumber ? [",", "."] : undefined}
            helperText={isHideHelperText ? "" : error}
            InputProps={
              suffix
                ? {
                    endAdornment: (
                      <InputAdornment position="start">{suffix}</InputAdornment>
                    ),
                  }
                : {}
            }
            {...rest}
          />
        </Flex>
      </Flex>
    </Fragment>
  );
};

export default InputWrapper;
