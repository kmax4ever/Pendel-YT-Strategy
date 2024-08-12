import { ButtonBase, createStyles, makeStyles } from "@material-ui/core";
import { ReactComponent as HelpCircle } from "assets/icons/help-circle-icon.svg";
import React, { Fragment } from "react";
import ReactTooltip from "react-tooltip";
import { AppTheme } from "styles/theme";

interface HelpIconWithTooltipProps {
  message?: string;
}

const HelpIconWithTooltip = (props: HelpIconWithTooltipProps) => {
  const styles = useStyles(props);

  return (
    <Fragment>
      <div
        style={{ maxWidth: 300 }}
        data-tip={props.message || "Coming soon..."}
      >
        <ButtonBase>
          <HelpCircle />
        </ButtonBase>
      </div>
      <ReactTooltip
        place="right"
        effect="solid"
        border={true}
        borderColor="#DFEAEA"
        textColor="#444444"
        backgroundColor="white"
      />
    </Fragment>
  );
};

const useStyles = makeStyles((theme: AppTheme) => createStyles({}));

export default HelpIconWithTooltip;
