require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Book = require("./models/book");
const app = express();
app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("----");
  next();
};

app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/books", (req, res) => {
  Book.find({}).then((book) => {
    res.json(book);
  });
});

app.get("/api/books/:id", (req, res) => {
  Book.findById(req.params.id).then((book) => {
    res.json(book);
  });
});

app.put("/api/books/:id", (req, res) => {
  const { name, description, favorite } = req.body;

  const updatedBookField = {};
  if (name !== undefined) updatedBookField.name = name;
  if (description !== undefined) updatedBookField.description = description;
  if (favorite !== undefined) updatedBookField.favorite = favorite;

  Book.findByIdAndUpdate(req.params.id, updatedBookField, {
    new: true,
    runValidators: true,
    context: "query",
  }).then((updatedBook) => res.json(updatedBook));
});

app.post("/api/books", (req, res) => {
  const { name, description, favorite } = req.body;
  if (!name) {
    res.status(400).json({ error: "name missing" });
  }

  const book = new Book({
    name,
    description,
    favorite: favorite || false,
  });

  book.save().then((book) => {
    res.json(book);
  });
});

app.delete("/api/books/:id", (req, res) => {
  Book.findOneAndDelete(req.params.id).then(() => {
    res.status(204).end();
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoints" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
