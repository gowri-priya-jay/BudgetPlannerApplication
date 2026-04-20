// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { MonthCalendar, PickersOutlinedInput } from "@mui/x-date-pickers";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#375462",
    },
    secondary: {
      main: "#617E8C",
    },
    error: {
      main: "#e9666e",
    },
    background: {
      default: "#f2f2f2",
    },
    text: {
      primary: "#4e4e4e",
      secondary: "#5b7480",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontSize: 12,
    h6: {
      lineHeight: 1,
    },
  },
  components: {
    //--------------Form Label-----------------------------
    MuiFormLabel: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontSize: "small",
        },
      },
    },
    // -------------TextField -------------------------------
    MuiTextField: {
      styleOverrides: {
        root: {
          marginTop: "8px",
          "& .MuiInputBase-root": {
            fontSize: "0.85rem",
            paddingRight: 4,
            height: "30px",
          },
          "& .MuiInputBase-input": {
            padding: "4px 8px",
          },
          "& .MuiInputBase-input.Mui-readOnly": {
            backgroundColor: "#f2f2f2",
            cursor: "default",
            borderRadius: 6,
          },
        },
      },
    },
    //------------- Button--------------------------------
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontSize: "12px",
          textTransform: "none",
          "&:focus": {
            outline: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
          "&:hover": {
            backgroundColor: "#658c9f",
            color: "white",
            boxShadow: "none",
          },
        },
        startIcon: {
          marginRight: "4px",
          "& > *:first-of-type": {
            fontSize: "15px",
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:focus": { outline: "none" },
          "&:focus-visible": { outline: "none" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: 25,
          height: 25,
          color: "#375462",
          "&:focus": { outline: "none" },
          "&:focus-visible": { outline: "none" },
        },
      },
    },
    // ----------ALERT-----------------------------
    MuiAlert: {
      styleOverrides: {
        root: {
          padding: "4px 10px",
          minHeight: "30px",
          alignItems: "center",
        },
        message: {
          fontSize: "0.75rem",
          padding: 0,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "center",
        },
        icon: {
          fontSize: "1rem",
          marginRight: "4px",
        },
        action: {
          padding: 0,
        },
        closeButton: {
          padding: "2px",
        },
        closeIcon: {
          fontSize: "0.9rem",
        },
      },
    },
    //-------------Sidebar Icon--------------------
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 30,
          "&.Mui-selected, .MuiListItemButton-root.Mui-selected &": {
            color: "white",
          },
        },
      },
    },
    //---------Sidebar Button ---------------------
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#617E8C",
            color: "white",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#8ac0de",
            color: "white",
          },
          ":hover": {
            backgroundColor: "#8ac0de",
            color: "white",
          },
        },
      },
    },
    //-------------Tabs-----------------------------------
    MuiTabs: {
      styleOverrides: {
        root: {
          tabSize: "small",
          minHeight: "25px",
        },
        scrollButtons: {
          opacity: 1,
          width: 20,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          minWidth: "35px",
          minHeight: "30px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "12px",
          color: "#375462",
          backgroundColor: "#cde1ea",
          "&.Mui-selected": {
            color: "white",
            backgroundColor: "#375462",
          },
          "&:hover": {
            backgroundColor: "#8ac0de",
            color: "white",
          },
        },
      },
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          opacity: 1,
          width: 20,
          "&.Mui-disabled": {
            opacity: 0.3,
            pointerEvents: "none",
          },
          "&:focus-visible": {
            outline: "none",
          },
        },
      },
    },
    //----------Tables-----------------
    MuiTable: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          border: "1px solid #cde1ea",
          overflow: "hidden",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          borderBottom: "1px solid #cde1ea",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            backgroundColor: "#cde1ea",
          },
          "& .MuiTableCell-head": {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          minHeight: "30px !important",
          padding: 0,
        },
      },
    },
    //-------Dialog-----------
    MuiDialog: {
      defaultProps: {
        maxWidth: "sm",
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "#cde1ea",
          padding: "8px",
          color: "#375462",
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "8px !important",
        },
      },
    },
    //--------------Card------------------------------
    MuiCard: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          minWidth: "240px",
          borderRadius: "8px",
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          padding: "4px",
          backgroundColor: "#cde1ea",
          color: "#375462",
        },
        action: {
          margin: 0,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "8px",
          paddingBottom: "8px !important",
        },
      },
    },
    //-----------Select---------------
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          marginTop: "8px",
          height: "30px",
        },
      },
    },
    //--------InputBase---------------------
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "small",
        },
      },
    },
    //-------------DateField---------------------
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          textField: {
            size: "small",
            sx: { width: 180 },
          },
          openPickerButton: {
            sx: {
              "&:focus": { outline: "none" },
              "&:focus-visible": { outline: "none" },
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "&.MuiPickersTextField-root": {
            "& .MuiPickersOutlinedInput-root": {
              padding: "16px",
              height: 30,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
            "& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline":
              {
                borderColor: "#cde1ea",
              },
          },
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          maxHeight: 250,
          height: 250,
          width: 300,
          padding: 0,
        },
        viewTransitionContainer: {
          maxHeight: 250,
        },
      },
    },
    // YEAR GRID
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          maxHeight: 200,
          height: 240,
          width: 300,
          padding: 0,
        },
        button: {
          fontSize: "0.75rem",
          padding: "2px 4px",
          minWidth: 40,
          height: 30,
          width: 65,
          borderRadius: 15,
          "&.Mui-selected": {
            outline: "none",
            boxShadow: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
    // MONTH GRID
    MuiMonthCalendar: {
      styleOverrides: {
        root: {
          maxHeight: 240,
          height: 180,
          width: 300,
          padding: 0,
          rowGap: 8,
          ColumnGap: 8,
        },
        button: {
          fontSize: "0.75rem",
          padding: "2px 4px",
          minWidth: 40,
          width: 65,
          height: 30,
          borderRadius: 15,
          "&.Mui-selected": {
            outline: "none",
            boxShadow: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },

    //------------------Outlined Input-------------------------------
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 34,
          fontSize: "12px",
          paddingRight: "4px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cde1ea",
          },
        },
        input: {
          padding: "6px 4px",
        },
        notchedOutline: {
          borderColor: "#ccc",
        },
      },
    },
    //-----------------Accordion------------------------------------
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          marginBottom: 8,
          boxShadow: "none",
          backgroundColor: "transparent",
          "&:before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "32px !important",
          padding: "0 10px",
          backgroundColor: "#375462",
          color: "white",
          "&.Mui-expanded": {
            minHeight: "32px !important",
          },
          "&:focus": {
            outline: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
        },
        content: {
          margin: "6px 0 !important",
          fontSize: "10px",
          fontWeight: 600,
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: "8px",
          borderRadius: "0 0 6px 6px",
          backgroundColor: "transparent",
        },
      },
    },
    //--------------------Chip---------------
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          color: "#375462",
          border: "1px solid #cde1ea",
          backgroundColor: "#cde1ea",
        },
        label: {
          paddingRight: "10px",
          paddingLeft: "10px",
          fontWeight: "500",
        },
      },
    },
    // ---------------scrollbar ------------------------
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#b0b0b0",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#909090",
          },
        },
      },
    },
  },
});

export default theme;
