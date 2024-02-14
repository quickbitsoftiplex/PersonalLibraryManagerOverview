import { Modal, Box } from "@mui/material";
import ReusableBookForm from "./ReusableBookForm";
import { IBooksProps } from "../hooks/useAxiosCrudOps";
import { IFormValuesProps } from "./Books";
import { FormikHelpers } from "formik";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (
    values: IFormValuesProps,
    actions: FormikHelpers<IFormValuesProps>
  ) => void;
  onUpdate: (
    values: IFormValuesProps,
    actions: FormikHelpers<IFormValuesProps>
  ) => void;
  selectedBook?: IBooksProps;
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

const BookModal = ({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
  selectedBook,
  onUpdate,
}: BookModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="book-modal-title"
      aria-describedby="book-modal-description"
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <Box sx={style}>
        <ReusableBookForm
          onClose={onClose}
          isLoading={isLoading}
          onSubmit={onSubmit}
          selectedBook={selectedBook}
          onUpdate={onUpdate}
        />
      </Box>
    </Modal>
  );
};

export default BookModal;
