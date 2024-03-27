const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;
const baseURL = "http://localhost:5000";

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const user = users.find((u) => u.username === username);
    if (user) {
      return res.status(404).json({ message: "User already exists!" });
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json({ [isbn]: books[isbn] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  let key = keys.find((k) => books[k].author === author);
  return res.status(200).json({ [key]: books[key] });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  let key = keys.find((k) => books[k].title === title);
  return res.status(200).json({ [key]: books[key] });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  return res.status(200).json({ [isbn]: { reviews } });
});

// Get the book list available in the shop with axios
public_users.get("/books", function (req, res) {
  axios
    .get(`${baseURL}/`)
    .then((response) => res.status(response.status).send(response.data))
    .catch((error) => console.log(error));
});

// Get book details based on ISBN with axios
public_users.get("/books/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const response = await axios.get(`${baseURL}/isbn/${isbn}`);
  return res.status(response.status).send(response.data);
});

// Get book details based on author with axios
public_users.get("/books/author/:author", async function (req, res) {
  const author = req.params.author;
  const response = await axios.get(`${baseURL}/author/${author}`);
  return res.status(response.status).send(response.data);
});

// Get all books based on title with axios
public_users.get("/books/title/:title", async function (req, res) {
  const title = req.params.title;
  const response = await axios.get(`${baseURL}/title/${title}`);
  return res.status(response.status).send(response.data);
});

module.exports.general = public_users;
