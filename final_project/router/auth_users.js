const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Implement code to check if the username is valid
    // For example, you can check if the username exists in the 'users' array
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return false;
        } else {
          return true;
        }
      
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!isValid(username) && authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    // Implement code to add a review for the book with the given ISBN
    if (books[isbn]) {
        books[isbn].reviews[req.user.data] = review;
        return res.send(`The review for the book with ISBN ${isbn} has been added/updated`);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data; // Assuming the username is sent in the request body
  
    // Find the book by ISBN
    if (books[isbn]) {
      const book = books[isbn];
  
      // Check if the book has reviews and the user's review is present
      if (book.reviews && book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];
        return res.send(`Reviews for the ISBN ${isbn} posted by the user test deleted.`)
      } else {
        return res.status(404).json({ message: "Review not found for this user" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
