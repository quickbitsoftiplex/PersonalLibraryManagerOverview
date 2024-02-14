import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

interface ISnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor | undefined;
}

interface CustomSnackbarProps {
  snackbar: ISnackbarProps;
  setSnackbar: React.Dispatch<React.SetStateAction<ISnackbarProps>>;
}

const CustomSnackbar = ({ snackbar, setSnackbar }: CustomSnackbarProps) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={1200}
      onClose={handleClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={snackbar.severity}
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {snackbar.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackbar;
