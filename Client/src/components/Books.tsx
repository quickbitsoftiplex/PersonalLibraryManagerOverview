import axios from "../apis/books";
import useAxiosFunction, { IBooksProps } from "../hooks/useAxiosCrudOps";
import useSWR, { mutate } from "swr";
import { AlertColor } from "@mui/material/Alert";
import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, Stack } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FormikHelpers } from "formik";
import { Search } from "@mui/icons-material";
import CustomSnackbar from "./CustomSnackBar";
import BookModal from "./BookModal";
import SearchDialog from "./SearchDialog";

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

const Books = () => {
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
  const [bookBySearch, setBookBySearch] = useState<IBooksProps>();

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
    bookId: number
  ) => {
    console.log("handle update fired");
    await axiosFetch({
      axiosInstance: axios,
      method: "PUT",
      url: `/books/${bookId}`,
      requestConfig: values,
    });
    mutate(BOOKS_MUTATION_KEY);
    if (bookBySearch && bookBySearch.id === bookId) {
      setBookBySearch({ ...bookBySearch, ...values });
    }
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
    if (bookBySearch && bookBySearch.id === bookId) {
      setBookBySearch(undefined);
    }
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setBookBySearch(undefined);
  };

  const handleBookSearchByTitle = async () => {
    if (!searchTerm.trim()) {
      console.log("No search term provided");
      setSnackbar({
        open: true,
        message: "Please enter a search term.",
        severity: "info",
      });
      return;
    }
    try {
      const response = await axios.get("/books", {
        params: { title: searchTerm },
      });
      if (response && response.data.length > 0) {
        const bookData = response.data[0];
        setBookBySearch(bookData);

        setSnackbar({
          open: true,
          message: `Found book: ${bookData.title}`,
          severity: "success",
        });
      } else {
        console.log("No book found");
        setBookBySearch(undefined);

        setSnackbar({
          open: true,
          message: "No book found with the given title.",
          severity: "info",
        });
      }
    } catch (error) {
      console.error(error);
      setBookBySearch(undefined);

      setSnackbar({
        open: true,
        message: "An error occured",
        severity: "error",
      });
    } finally {
      setSearchTerm("");
      handleSearchDialogClose();
    }
  };

  return (
    <div>
      <Grid container gap={{ xs: 2, lg: 3 }} justifyContent={"center"}>
        {bookBySearch && (
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            <BookCard
              key={bookBySearch.id}
              id={bookBySearch.id}
              title={bookBySearch.title}
              author={bookBySearch.author}
              description={bookBySearch.description}
              genre={bookBySearch.genre}
              handleDelete={() => handleDelete(bookBySearch.id!)}
              handleEdit={() => handleEditBook(bookBySearch)}
              loading={loadingBookId === bookBySearch.id}
            />
            <Button onClick={handleClearSearch} color="primary">
              Clear search & return to main screen
            </Button>
          </Stack>
        )}
        {booksData &&
          !bookBySearch &&
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
      <CustomSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />

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
        <BookModal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          isLoading={loading}
          onSubmit={handleSubmit}
          selectedBook={selectedBook}
          onUpdate={handleUpdate}
        />
      )}

      <SearchDialog
        open={searchDialogOpen}
        onClose={handleSearchDialogClose}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleBookSearchByTitle}
        isLoading={loading}
      />
    </div>
  );
};

export default Books;
