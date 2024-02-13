import { useFormik } from "formik";
import {
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BookFormValidation } from "../schemas";
import { IFormValuesProps } from "./BooksList";
import { IBooksProps } from "../hooks/useAxiosFunction";

interface IReusableBookFormProps {
  onClose: () => void;
  onSubmit?: (values: IFormValuesProps, actions: any) => void;
  isLoading: boolean;
  bookId?: number;
  currentBookDetails?: IBooksProps;
}

const ReusableBookForm = ({
  onClose,
  onSubmit,
  bookId,
  isLoading,
  currentBookDetails,
}: IReusableBookFormProps) => {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: currentBookDetails || {
      title: "",
      author: "",
      genre: "",
      description: "",
    },
    validationSchema: BookFormValidation,

    onSubmit: (values, actions) => {
      if (currentBookDetails && currentBookDetails.id) {
        handleUpdate(currentBookDetails.id, values, actions);
      } else {
        if (onSubmit) {
          onSubmit(values, actions);
        }
      }
    },
  });

  const submitButtonLabel = currentBookDetails ? "Edit book" : "Add new book";

  return (
    <>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>
        Book Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={values.title}
              onChange={handleChange}
              error={touched.title && Boolean(errors.title)}
              helperText={touched.title && errors.title}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="author"
              name="author"
              label="Author"
              value={values.author}
              onChange={handleChange}
              error={touched.author && Boolean(errors.author)}
              helperText={touched.author && errors.author}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="genre"
              name="genre"
              label="Genre"
              value={values.genre}
              onChange={handleChange}
              error={touched.genre && Boolean(errors.genre)}
              helperText={touched.genre && errors.genre}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={values.description}
              onChange={handleChange}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : submitButtonLabel}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ReusableBookForm;
