const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "jwt_secret_private_key";
let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let index = users.findIndex(
    (user) => user.username === username && user.password === password
  );
  return index === -1 ? false : true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const keys = Object.keys(books[isbn].reviews); //keys are the username of users that post review
  books[isbn].reviews[username] = req.query.review;
  let message = keys.includes(username) ? "review updated" : "review added";
  return res.status(201).json({ message, [isbn]: books[isbn] });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
