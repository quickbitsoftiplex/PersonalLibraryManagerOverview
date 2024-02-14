import axios from "../apis/books";
import useAxiosFunction, { IBooksProps } from "../hooks/useAxiosFunction";
import useSWR, { mutate } from "swr";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ReusableBookForm from "./ReusableBookForm";
import { Modal } from "@mui/material";
import { FormikHelpers } from "formik";
import { Search } from "@mui/icons-material";

const BOOKS_MUTATION_KEY = "/books";
const getBooks = (url: string) => axios.get(url).then((res) => res.data);

interface ISnackbarStateProps {
  open: boolean;
  message: string;
  severity: AlertColor | undefined;
}

export interface IFormValuesProps {
  title: string;
  author: string;
  genre: string;
  description: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

const BooksList = () => {
  const [snackbar, setSnackbar] = useState<ISnackbarStateProps>({
    open: false,
    message: "",
    severity: undefined,
  });
  const [, error, loading, axiosFetch] = useAxiosFunction();
  const [isFormOpen, setFormOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<IBooksProps | undefined>(
    undefined
  );
  const [loadingBookId, setLoadingBookId] = useState<number | undefined>(
    undefined
  );
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: booksData, error: swrError } = useSWR(
    BOOKS_MUTATION_KEY,
    getBooks
  );

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    }
  }, [error]);

  if (swrError && !snackbar.open) {
    setSnackbar({
      open: true,
      message: "Error fetching books",
      severity: "error",
    });
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSubmit = async (
    values: IFormValuesProps,
    actions: FormikHelpers<IFormValuesProps>
  ) => {
    const { title, author, genre, description } = values;
    console.log("submit pressed");
    await axiosFetch({
      axiosInstance: axios,
      method: "POST",
      url: "/books",
      requestConfig: {
        title,
        author,
        genre,
        description,
      },
    });

    mutate(BOOKS_MUTATION_KEY);
    setSnackbar({
      open: true,
      message: "Book added successfully!",
      severity: "success",
    });

    actions.setSubmitting(false);
    handleCloseForm();
  };

  const handleUpdate = async (
    actions: FormikHelpers<IFormValuesProps>,
    values: IFormValuesProps,
    bookId: string
  ) => {
    console.log("handle update fired");
    // const { title, author, genre, description } = values;
    await axiosFetch({
      axiosInstance: axios,
      method: "PUT",
      url: `/books/${bookId}`,
      requestConfig: values,
    });
    mutate(BOOKS_MUTATION_KEY);
    setSnackbar({
      open: true,
      message: "Book updated successfully!",
      severity: "success",
    });

    actions.setSubmitting(false);
    handleCloseForm();
    setSelectedBook(undefined);
  };

  const handleDelete = async (bookId: number) => {
    setLoadingBookId(bookId);
    await axiosFetch({
      axiosInstance: axios,
      method: "DELETE",
      url: `/books/${bookId}`,
    });
    mutate(BOOKS_MUTATION_KEY);
    setSnackbar({
      open: true,
      message: "Book deleted successfully!",
      severity: "success",
    });
    setLoadingBookId(undefined);
  };

  const handleAddBookClick = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedBook(undefined);
  };

  const handleEditBook = (book: IBooksProps) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchDialogClose = () => {
    setSearchDialogOpen(false);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <Grid container gap={{ xs: 2, lg: 3 }} justifyContent={"center"}>
        {booksData &&
          booksData.map((book: IBooksProps) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              description={book.description}
              genre={book.genre}
              handleDelete={() => handleDelete(book.id!)}
              handleEdit={() => handleEditBook(book)}
              loading={loadingBookId === book.id}
            ></BookCard>
          ))}
      </Grid>
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

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Tooltip title="Search for a book" placement="left">
            <Fab
              size="large"
              color="secondary"
              aria-label="add"
              onClick={handleSearchDialogOpen}
            >
              <Search />
            </Fab>
          </Tooltip>
        </Stack>

        {!isFormOpen && (
          <Tooltip title="Add a book" placement="left">
            <Fab
              size="large"
              color="primary"
              aria-label="add"
              onClick={handleAddBookClick}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        )}
      </Stack>
      {isFormOpen && (
        <Modal
          open={isFormOpen}
          onClose={handleCloseForm}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          sx={{
            backdropFilter: "blur(5px)",
          }}
        >
          <Box sx={style}>
            <ReusableBookForm
              onClose={handleCloseForm}
              isLoading={loading}
              onSubmit={handleSubmit}
              selectedBook={selectedBook}
              onUpdate={handleUpdate}
            />
          </Box>
        </Modal>
      )}
      <Dialog open={searchDialogOpen} onClose={handleSearchDialogClose}>
        <DialogTitle>Search for a Book</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleSearchDialogClose} color="primary">
            Search
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksList;
