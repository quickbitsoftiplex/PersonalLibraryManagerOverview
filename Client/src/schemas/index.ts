import * as yup from "yup";

export const BookFormValidation = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title can be no longer than 50 characters"),
  author: yup
    .string()
    .required("Author is required")
    .min(2, "Author must be at least 2 characters")
    .max(50, "Author can be no longer than 50 characters"),
  genre: yup
    .string()
    .required("Genre is required")
    .min(2, "Genre must be at least 2 characters")
    .max(30, "Genre can be no longer than 30 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description can be no longer than 500 characters"),
});
