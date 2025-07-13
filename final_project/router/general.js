const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username  is missing
  if (!username)
      return res.status(404).json({message: "Username not provided."});
  if(!password)
      return res.status(404).json({message: "password not provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books) {
    res.send(JSON.stringify(books,null,4));
} else {
    return res.status(404).json({message: "No books available"});
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn] || null;
  if(book){
    res.send(JSON.stringify(book,null,4));
  }
  else{
    return res.status(404).json({message: "book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let book =[];
  for (let key in books) {
    if (books[key].author === author) {
        book.push(books[key]);
    }
  }  
  if(book.length > 0){
    res.send(JSON.stringify(book,null,4));
  }
  else{
    return res.status(404).json({message: "book not found"});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let book =[];
  for (let key in books) {
    if (books[key].title === title) {
        book.push(books[key]);
    }
  }  
  if(book.length > 0){
    res.send(JSON.stringify(book,null,4));
  }
  else{
    return res.status(404).json({message: "book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  if(reviews.length > 0){
    res.send(JSON.stringify(reviews,null,4));
  }
  else{
    return res.status(404).json({message: "no reviews found"});
  }

});

module.exports.general = public_users;
