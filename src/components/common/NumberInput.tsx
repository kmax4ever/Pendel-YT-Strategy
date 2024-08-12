import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import { countDecimals } from "utils/math";

export type NumberInputProps = Omit<TextFieldProps, "ref"> &
  NumberFormatProps & {
    keyboardStep?: number;
  };

const NumberInput = ({
  decimalScale,
  prefix,
  value,
  defaultValue,
  onValueChange,
  onChange,
  keyboardStep = 0,
  ...restProps
}: NumberInputProps) => {
  return (
    <NumberFormat
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") {
          if (value !== undefined) {
            const newValue = (+value + keyboardStep).toFixed(7);
            //@FIXME: fix for other field in params
            //@ts-ignore
            onValueChange({
              value: newValue.toString(),
              skipUpdateKeyboardStep: true,
            });
          }
        } else if (e.key === "ArrowDown") {
          if (value !== undefined) {
            const newValue = (+value - keyboardStep).toFixed(7);
            //@FIXME: fix for other field in params
            //@ts-ignore
            onValueChange({
              value: newValue.toString(),
              skipUpdateKeyboardStep: true,
            });
          }
        }
      }}
      thousandSeparator={true}
      prefix={prefix}
      decimalScale={decimalScale ? decimalScale : 0}
      allowNegative={false}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      onChange={onChange}
      customInput={TextField}
      {...restProps}
    />
  );
};

export default NumberInput;
