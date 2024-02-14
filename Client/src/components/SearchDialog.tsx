import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchDialog = ({
  open,
  onClose,
  searchTerm,
  setSearchTerm,
  onSearch,
  isLoading,
}: SearchDialogProps) => {
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Search for a Book</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label="Book Name"
            type="text"
            fullWidth
            variant="standard"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          {isLoading ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Button type="submit" color="primary">
              Search
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
