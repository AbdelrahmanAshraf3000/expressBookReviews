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

function getAllBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
            } else {
                reject({ message: "No books available" });
            }
        }, 1000); 
    });
}
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const allTheBooks = await getAllBooks();
    res.send(JSON.stringify(allTheBooks,null,4));
} catch(error) {
    return res.status(404).json({message: "No books available"});
}
});

function getBookByIsbn(isbn) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const book = books[isbn] || null;
            resolve(book);
        }, 500); 
    });
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  try{
    const book = await getBookByIsbn(isbn);
    res.send(JSON.stringify(book,null,4));
  }
  catch (error){
    return res.status(404).json({message: "book not found"});
  }
 });

 function getBooksByAuthor(author) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let foundBooks = [];
            for (let key in books) {
                if (books[key].author === author) {
                    foundBooks.push(books[key]);
                }
            }
            resolve(foundBooks);
        }, 500); 
    });
}
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try {
        const foundBooks = await getBooksByAuthor(author);
        if (foundBooks.length > 0) {
            res.status(200).json(foundBooks);
        } else {
            res.status(404).json({ message: "Books not found" });
        }
    } 
    catch (error) {
        res.status(500).json({ message: error.message});
    }

});
function getBooksByTitle(title) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let foundBooks = [];
            for (let key in books) {
                if (books[key].title === title) {
                    foundBooks.push(books[key]);
                }
            }
            resolve(foundBooks);
        }, 500); 
    });
}
// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try {
    const foundBooks = await getBooksByTitle(title);
    if (foundBooks.length > 0) {
        res.status(200).json(foundBooks);
    } else {
        res.status(404).json({ message: "Books not found" });
    }
} 
catch (error) {
    res.status(500).json({ message: error.message});
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
