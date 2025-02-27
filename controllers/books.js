const bookRoute = require("express").Router();
const Book = require("../models/book");

bookRoute.get("/", (req, res) => {
  Book.find({}).then((book) => {
    res.json(book);
  });
});

bookRoute.post("/", (req, res) => {
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

bookRoute.get("/:id", (req, res) => {
  Book.findById(req.params.id).then((book) => {
    res.json(book);
  });
});

bookRoute.put("/:id", (req, res) => {
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

bookRoute.delete("/:id", (req, res) => {
  Book.findOneAndDelete(req.params.id).then(() => {
    res.status(204).end();
  });
});

module.exports = bookRoute;
