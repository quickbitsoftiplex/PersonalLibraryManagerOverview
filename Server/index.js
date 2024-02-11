const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// This will store our books in memory,
// "id" is the unique identifier,
// other fields are up to you
let books = [
  {
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
    description:
      "The first novel in The Kingkiller Chronicle series, it tells the story of a gifted young man growing up to be the most notorious wizard his world has ever seen.",
  },
  {
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    genre: "Fantasy",
    description:
      "In a world where ash falls from the sky and mist dominates the night, an oppressed populace uses allomancy, a magic of metals, to fuel a rebellion against the Lord Ruler.",
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    genre: "Post-Apocalyptic",
    description:
      "A father and his son walk alone through burned America, heading through the ravaged landscape to the coast in a desperate attempt to survive.",
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "Thriller",
    description:
      "A thriller that unveils the secrets at the heart of a modern marriage, where a wife mysteriously disappears on the day of their fifth anniversary.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    description:
      "A narrative of humanity's creation and evolution that explores how Homo sapiens came to dominate the world.",
  },
];

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const book = { id: Date.now(), ...req.body };
  books.push(book);
  res.status(201).json(book);
});

// Update a book
app.put("/books/:id", (req, res) => {
  const index = books.findIndex((book) => book.id === parseInt(req.params.id));
  if (index >= 0) {
    books[index] = { ...books[index], ...req.body };
    res.json(books[index]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  books = books.filter((book) => book.id !== parseInt(req.params.id));
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
