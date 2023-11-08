const express = require('express');
const books = require("./booksdb.js");
const { isValid } = require("./auth_users.js");
const public_users = express.Router();
const { users } = require("./auth_users.js");

public_users.post("/register", (req, res) => {
  // Implement code to register a new user
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the 'users' array in auth_users.js
  users.push({ username, password });

  return res.status(201).json({ message: "Customer successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);

  if (authorBooks.length > 0) {
    return res.status(200).json({"booksbyauthor":authorBooks});
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title === title);

  if (titleBooks.length > 0) {
    return res.status(200).json({"booksbytitle": titleBooks});
  } else {
    return res.status(404).json({ message: "Books with this title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

module.exports.general = public_users;
