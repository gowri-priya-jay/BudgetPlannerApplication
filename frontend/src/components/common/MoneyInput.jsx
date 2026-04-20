import { TextField, InputAdornment, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const MoneyInput = ({
  value,
  onChange,
  onBlur,
  variant,
  sx = {},
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    const load = async () => {
      setInternalValue(value || "");
    };
    load();
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;

    if (val === "") {
      setInternalValue("");
      onChange("");
      return;
    }

    if (val.startsWith("-")) return;

    if (!/^\d*\.?\d*$/.test(val)) return;

    setInternalValue(val);
    onChange(val);
  };

  const handleBlur = () => {
    if (internalValue === "" || internalValue === null) {
      onBlur?.("");
      return;
    }

    const formatted = Number(internalValue).toFixed(2);
    setInternalValue(formatted);
    onBlur?.(formatted);
  };

  // ⭐ Styles applied ONLY when variant="table"
  const tableStyles =
    variant === "table"
      ? {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f2f6f8",
            height: "28px",
            padding: "0 4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiInputBase-root": {
            fontSize: "0.80rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none !important",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: "none !important",
            },
          "& .MuiInputAdornment-root .MuiTypography-root": {
            fontSize: "12px !important",
            lineHeight: 1,
            color: "#375462",
          },
          "& .MuiInputAdornment-root": {
            marginRight: "2px",
            display: "flex",
            alignItems: "center",
          },
          "& .MuiInputBase-input": {
            padding: "0 4px",
            height: "100%",
          },
        }
      : {};

  return (
    <TextField
      size="small"
      {...props}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      sx={{ 
        ...tableStyles,
        ...sx ,
        "& .MuiInputAdornment-root": {
            marginRight: "4px",
            display: "flex",
            alignItems: "center",
        },
        "& .MuiInputBase-input": {
            padding: 0,
            height: "100%",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Typography>$</Typography>
            </InputAdornment>
          ),
          inputMode: "decimal",
          readOnly: props.readOnly,
        },
      }}
    />
  );
};

export default MoneyInput;
