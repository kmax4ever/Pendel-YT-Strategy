import React from "react";
import Flex from "components/common/Flex";
import Text from "components/common/Text";
import { ReactComponent as GoBackIcon } from "assets/icons/goback-icon.svg";
import { ButtonBase } from "@material-ui/core";
import { useHistory } from "react-router";
import { Colors } from "styles/theme";

interface NotFoundPageProps {}

const NotFoundPage = (props: NotFoundPageProps) => {
  const history = useHistory();
  return (
    <Flex column center width="100%" height="100%" bgcolor="pageBg">
      <Text
        color="gray"
        style={{
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        404
      </Text>
      <ButtonBase
        onClick={() => {
          history.goBack();
        }}
      >
        <Flex center>
          <GoBackIcon fill={Colors.gray} />
          <Text color="gray" fontSize={16} ml={1}>
            PAGE NOT FOUND
          </Text>
        </Flex>
      </ButtonBase>
    </Flex>
  );
};

export default NotFoundPage;
