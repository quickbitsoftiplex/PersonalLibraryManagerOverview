import axios from "../apis/books";
import useAxiosFunction, { IBooksProps } from "../hooks/useAxiosFunction";
import useSWR, { mutate } from "swr";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Grid } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ReusableBookForm from "./ReusableBookForm";
import { Modal } from "@mui/material";
import { FormikHelpers } from "formik";

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
  const [selectedBook, setSelectedBook] = useState<any>(null);
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
    setSelectedBook(null);
  };

  const handleDelete = async (bookId: number) => {
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
  };

  const handleAddBookClick = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedBook(null);
  };

  const handleEditBook = (book: IBooksProps) => {
    setSelectedBook(book);
    setFormOpen(true);
  };

  return (
    <div>
      {loading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={2}>
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
      {!isFormOpen && (
        <Tooltip title="Add a book" placement="left">
          <Fab
            size="large"
            color="primary"
            aria-label="add"
            style={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleAddBookClick}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      )}

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
    </div>
  );
};

export default BooksList;
