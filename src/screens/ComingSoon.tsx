import { ButtonBase } from "@material-ui/core";
import { ReactComponent as GoBackIcon } from "assets/icons/goback-icon.svg";
import Flex from "components/common/Flex";
import Text from "components/common/Text";
import React from "react";
import { useHistory } from "react-router";
import BgImage from "../assets/images/comingsoon.png";

interface ComingSoonPageProps {}

const ComingSoonPage = (props: ComingSoonPageProps) => {
  const history = useHistory();
  return (
    <Flex
      column
      center
      width="100%"
      height="100%"
      bgcolor="bg"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Text
        color="#325F65"
        style={{
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        COMING SOON
      </Text>
      <ButtonBase
        onClick={() => {
          history.goBack();
        }}
      >
        <Flex center>
          <GoBackIcon />
          <Text color="#325F65" fontSize={16} ml={1}>
            Go back
          </Text>
        </Flex>
      </ButtonBase>
    </Flex>
  );
};

export default ComingSoonPage;
