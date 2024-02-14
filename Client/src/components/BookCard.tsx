import useAxiosFunction, { IBooksProps } from "../hooks/useAxiosFunction";
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
  Grid,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IBookCardProps extends IBooksProps {
  handleEdit?: any;
  handleDelete: any;
}

const BookCard = ({
  id,
  title,
  author,
  genre,
  description,
  handleEdit,
  handleDelete,
}: IBookCardProps) => {
  const [, , loading] = useAxiosFunction();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        sx={{
          maxWidth: 345,
          margin: 2,
          transition: "0.3s",
          "&:hover": { elevation: 10 },
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image="https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png"
          alt={title}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
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
          <Typography variant="body2" noWrap>
            {description}
          </Typography>
          {loading && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <CircularProgress />
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing>
          <Box sx={{ marginLeft: "auto" }}>
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default BookCard;
