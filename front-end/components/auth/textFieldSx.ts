export const textFieldSx = {
  mb: 2.5,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: "rgba(148, 163, 184, 0.25)",
      borderWidth: 1,
    },
    "&:hover fieldset": {
      borderColor: "rgba(148, 163, 184, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#10b981",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    "&.Mui-focused": {
      color: "#10b981",
    },
  },
  "& .MuiInputBase-input": {
    color: "#f1f5f9",
  },
};