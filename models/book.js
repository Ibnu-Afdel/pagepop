const mongoose = require("mongoose");

url = process.env.MONGODO_URI;
mongoose.set("strictQuery", false);

console.log(`connecting to ${url}`);
mongoose.connect(url).then(() => {
  console.log("connected to MongoDB");
});

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true,
  },
  description: {
    type: String,
    minLength: 7,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Book = mongoose.model("Book", bookSchema);

bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Book", bookSchema);
