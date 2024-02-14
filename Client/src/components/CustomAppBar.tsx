import { AppBar, Toolbar, Typography } from "@mui/material";

const CustomAppBar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
          My dummy books library
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
