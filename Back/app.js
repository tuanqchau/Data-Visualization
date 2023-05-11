/*
 *
 * app back-end JavaScript code for Project 2
 *
 * Author: Tuan Chau
 * Version: 2.0
 */

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', (req, res) =>
    res.send('<h1>MERN Example 2: Server</h1>') // Home web page
);

// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://tqc:1234@cluster0.ht8m45m.mongodb.net/Project2?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

// Create routes for database access
const tableSchema = require("./model");
const router = express.Router();
app.use('/db', router);
router.route('/find').get( (req, res) => {
  tableSchema.find(function(err, items){
    console.log(items);
    if (err) {
      console.log(err);
    } else {
      res.json(items);
    }
  });
});
router.route('/find/:caption').get(function(req, res) {
  tableSchema.find({caption: req.params.caption}, function(err, items) {
    res.json(items);
  });
});

// Added support for post requests. A document is found based on its id. The id is the value of _id property of the document.
router.route('/update/:id').post( (req, res) => {

  tableSchema.findById(req.params.id,function(err, items) {
    if (err) {
      console.log(err);
    }
    else {
      items.title = req.body.title;
      items.data = req.body.data;
      items.fileName = req.body.fileName;
      items.save().then(items => {
        res.json('Items updated!');
      })
          .catch(err => {
            res.status(400).send("Update not possible");
          });
    }
  });
});

//set up the router for creating new document
router.route('/createNew/').post( (req, res) => {
  let title = req.body.title;
  let data = req.body.data;
  let fileName = req.body.fileName;
  let table = new tableSchema({fileName, title, data });
  table.save().then(table => {
    res.json('New document added');
  })
      .catch(err => {
        res.status(400).send("New document not possible");
      });
});


// Export the app to be used in bin/www.js
module.exports = app;
