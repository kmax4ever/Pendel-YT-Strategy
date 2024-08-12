import React from "react";
import Flex from "./Flex";
import Text from "./Text";

interface CoinIconProps {
  symbol: string;
  symbol2?: string;
  text?: string;
  variant?: string;
  textMl?: number;
  textColor?: string;
  size?: number;
  textStyle?: any;
}

const CoinIcon = (props: CoinIconProps) => {
  const {
    symbol,
    symbol2,
    text,
    variant,
    textMl = 1,
    textColor = "text",
    size = 20,
    textStyle,
  } = props;

  const getIconUrl = (symbol: string) => {
    return symbol.toLowerCase();
  };

  const icon1 = getIconUrl(symbol);
  const icon2 = getIconUrl(symbol2 || "");

  if (symbol2) {
    return (
      <Flex centerY>
        <Flex position="relative" width={size * 1.5} height={size}>
          <img
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "white",
              left: size / 2,
            }}
            src={`/images/${icon2}.png`}
            alt=""
          />
          <img
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: "white",
            }}
            src={`/images/${icon1}.png`}
            alt=""
          />
        </Flex>
        {text ? (
          <Text
            color={textColor}
            ml={textMl}
            variant={variant}
            style={textStyle}
          >
            {text}
          </Text>
        ) : null}
      </Flex>
    );
  } else {
    return (
      <Flex centerY>
        <img
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: "white",
          }}
          src={`/images/${icon1}.png`}
          alt=""
        />
        {text ? (
          <Text
            color={textColor}
            ml={textMl}
            variant={variant}
            style={textStyle}
          >
            {text}
          </Text>
        ) : null}
      </Flex>
    );
  }
};

export default CoinIcon;
