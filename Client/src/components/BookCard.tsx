import { IBooksProps } from "../hooks/useAxiosCrudOps";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IBookCardProps extends IBooksProps {
  handleEdit?: () => void;
  handleDelete: () => void;
  loading: boolean;
}

const BookCard = ({
  title,
  author,
  genre,
  description,
  handleEdit,
  handleDelete,
  loading,
}: IBookCardProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Card
      sx={{
        width: 330,
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        "&:hover": { boxShadow: "0 16px 40px -12.125px rgba(0,0,0,0.3)" },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image="https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"
        alt={title}
        sx={{ objectFit: "contain" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          sx={{ fontSize: matches ? 16 : 14 }}
          color="text.secondary"
          gutterBottom
        >
          Genre: {genre}
        </Typography>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Author: {author}
        </Typography>
        <Typography variant="body2">{description}</Typography>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </CardContent>
      <CardActions disableSpacing sx={{ mt: "auto" }}>
        <Box sx={{ marginLeft: "auto" }}>
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default BookCard;
