import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/Typography/Typography" {
  interface TypographyPropsVariantOverrides {
    link: true;
    inputLabel: true;
    formHeader: true;
    tableHeader: true;
    bold: true;
    columnHeader: true;
    dialogHeader: true;
  }
}

declare module "@material-ui/core/Button/Button" {
  interface ButtonPropsVariantOverrides {
    depositMetamask: true;
    success: true;
    danger: true;
    lighterPrimary: true;
  }
}

export const Colors = {
  headerBg: "#1F233C",
  headerBg2: "#2D2F3D",
  pageBg: "#0F111D",
  modalBg: "#1e2024",
  balanceText: "#fb9701",
  metamask: "#f7931a",
  primary: "#297DFF",
  secondary: "#22D291",
  success: "#22D291",
  error: "#EB5757",
  bgButton: "#F9F7F4",
  blockHeader: "#325F65",
  columnHeader: "#BA9168",
  errorTransparent: "rgba(228, 21, 21, 0.2)",
  gray: "#767995",
  textGray: "#C1CBCF",
  bg: "#EBEBEB",
  border: "#1F233C",
  white: "#ffffff",
  lighterPrimary: "#5BA5AF",
  swapBg: "#1D2728",
  swapSectionBg: "#EDF5F5",
  blueText: "#3F6FD9",
  blue: "#577AAB",
  text: "white",
  up: "#22D291",
  down: "#EB5757",
  draw: "white",
  inputBg: "#282C44",
  drawerBg: "#16192A",
  tableHeaderBg: "#1C1F35",
  tableRowBg1: "#1D1E2F",
  tableRowBg2: "#1A1A29",
};

export const createAppTheme = () => {
  const muiTheme = createMuiTheme({
    typography: {
      fontFamily:
        'Play, Open Sans, Roboto, -apple-system, "BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", Helvetica, sans-serif',
      caption: {
        fontSize: "13px",
        color: Colors.text,
      },
      h5: {
        color: Colors.text,
        fontSize: "18px",
      },
      h6: {
        color: Colors.text,
        fontSize: "15px",
      },
      body1: {
        color: Colors.text,
        fontSize: "15px",
      },
    },
    components: {
      MuiTypography: {
        variants: [
          {
            props: { variant: "formHeader" },
            style: {
              fontWeight: 600,
              fontSize: "30px",
              color: "white",
              marginBottom: "10px",
            },
          },
          {
            props: { variant: "link" },
            style: {
              color: "#297DFF",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "13px",
              cursor: "pointer",
            },
          },
          {
            props: { variant: "tableHeader" },
            style: {
              fontWeight: 500,
              fontSize: "16px",
              color: "#77818b",
              marginTop: "40px",
              marginNottom: "20px",
            },
          },
          {
            props: { variant: "bold" },
            style: {
              fontWeight: "bold",
            },
          },
          {
            props: { variant: "inputLabel" },
            style: {
              fontWeight: "bold",
              color: "white",
            },
          },
          {
            props: { variant: "columnHeader" },
            style: {
              fontSize: "13px",
              color: Colors.columnHeader,
              fontWeight: "bold",
            },
          },
          {
            props: { variant: "dialogHeader" },
            style: {
              fontWeight: 600,
              fontSize: "21px",
              lineHeight: "29px",
              color: Colors.primary,
            },
          },
        ],
      },
      MuiButton: {
        variants: [
          {
            props: { variant: "depositMetamask" },
            style: {
              backgroundColor: Colors.metamask,
              color: Colors.white,

              "&:hover": {
                backgroundColor: Colors.metamask,
              },
            },
          },
          {
            props: { variant: "success" },
            style: {
              backgroundColor: Colors.success,
              color: Colors.white,
            },
          },
          {
            props: { variant: "danger" },
            style: {
              backgroundColor: Colors.error,
              color: Colors.white,

              "&:hover": {
                backgroundColor: Colors.error,
              },
              "&.Mui-disabled": {
                backgroundColor: "#77818b !important",
              },
            },
          },
          {
            props: { variant: "lighterPrimary" },
            style: {
              backgroundColor: Colors.lighterPrimary,
              borderRadius: 3,
              color: Colors.white,
              fontWeight: "bold",
              fontSize: 14,
              "&:hover": {
                background: Colors.lighterPrimary,
                opacity: 0.9,
              },
            },
          },
        ],

        styleOverrides: {
          root: {
            fontWeight: "bold",
            fontSize: 16,
            color: "white !important",
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: false,
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            backgroundColor: Colors.inputBg,

            "&:hover": {
              backgroundColor: Colors.inputBg,
            },
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          disableUnderline: true,
        },
        styleOverrides: {
          icon: {
            fill: Colors.primary,
          },
          root: {
            "& div:first-child": {
              overflow: "hidden",
            },
          },
          outlined: {
            padding: "15px",
            borderRadius: "5px",

            "&:focus": {
              backgroundColor: Colors.inputBg,
              borderRadius: "5px",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          inputProps: {
            style: {
              background: Colors.inputBg,
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 8px 8px 15px",
              color: "white",
            },
          },
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: Colors.border,
              },
              "&:hover fieldset": {
                borderColor: "none",
              },
            },
            "& .MuiOutlinedInput-multiline": {
              padding: 0,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "white",
          },
          input: {
            height: "35px",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            padding: "8px 10px",
            backgroundColor: Colors.inputBg,

            "&::placeholder": {
              fontSize: 16,
              color: "#4D5072",
            },
          },
          notchedOutline: {
            display: "none",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          stickyHeader: {
            backgroundColor: "transparent",
          },
          root: {
            borderBottom: "none",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          contained: {
            marginLeft: 0,
            marginRight: 0,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          root: {
            "& .MuiDialog-paperFullWidth": {
              width: "calc(100% - 24px)",
            },
            "& .MuiDialog-paper": {
              margin: 0,
              backgroundColor: Colors.drawerBg,
              overflowX: "hidden",
            },
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paperAnchorDockedLeft: {
            borderRight: "none",
            backgroundColor: Colors.drawerBg,
          },
          paper: {
            overflowX: "hidden",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: Colors.drawerBg,
            borderRadius: "4px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "unset",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: Colors.border,
          },
        },
      },
    },
    palette: {
      primary: {
        main: Colors.primary,
      },
      secondary: {
        main: Colors.secondary,
      },
      success: {
        main: Colors.success,
      },
      error: {
        main: Colors.error,
      },
    },
  });
  return {
    ...muiTheme,
    colors: {
      ...Colors,
    },
    metrics: {
      drawerWidth: 60,
    },
  };
};

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
export type AppTheme = ReturnType<typeof createAppTheme>;
