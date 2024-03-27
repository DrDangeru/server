const express = require('express');
const sqlite = require('sqlite3').verbose();
const bodyParser = require('body-parser');
var _ = require('lodash');
const cors = require('cors'); // Import cors middleware
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://192.168.124.101:3001',
}));
app.use(express.urlencoded({ extended: true }));// may cause
// issues as other json parser used ??
//import open from sqlite3; // or sqlite3 maybe... 
let sql;

let db = new sqlite.Database('quote.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) { return console.log(err); }
})

// sqlite.OPEN_CREATE({ // above works. check migration stuff later
//   filename: 'quote.db', // db ,
//   driver: sqlite.Database
// }) 
// app.get('/search', async(req,res)=>{
//   const {lastName, firstName} = req.query()
//   let query = db.get(
//     SELECT ''
//     FROM 
//     Order
// if (movie) {
//   query = query.ilike('movie', `%{movieeQ}%`)
//   // % is like start so *search*
// }

// if (id) {
//   query = query.equals('id', id)
// }
//   )
// })
// GET all quotes from local Db
app.get('/quote', (req, res) => {
  try {
    sql = 'SELECT * FROM quote';
    db.all(sql, (err, rows) => {
      if (err) {
        return res.json({
          status: 404,
          success: false,
          error: err.message,
        });
      }
      console.log('Here are all the Movie quotes we have', rows);
      res.json({
        status: 200,
        success: true,
        quotes: rows,
      });
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: 400,
      success: false,
      error: 'Bad Request',
    });
  }
});

// SEARCH for movie quote in the database
app.post('/quote', (req, res) => {
  const searchStr = req.body.searchStr; // accessing searchStr from request body
  const sql = 'SELECT * FROM quote WHERE movie LIKE ? OR character LIKE ? OR quote LIKE ?';
  const params = [`%${searchStr}%`, `%${searchStr}%`, `%${searchStr}%`];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: err.message,
      });
    }
    console.log('Here are all the Movie quotes we have', rows);
    res.status(200).json({
      status: 200,
      success: true,
      quotes: rows,
    });
  });
});


// delete quote by id (in the Local Db)
app.delete('/quote/:id', (req, res) => {
  try {
    const id = req.params.id;
    sql = 'DELETE FROM quote WHERE ID = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        return res.json({
          status: 400,
          success: false,
          error: err.message,
        });
      }
      console.log(`Quote with ID ${id} deleted successfully`);
      res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: 400,
      success: false,
      error: 'Bad Request',
    });
  }
});

// Add quote  to local Db
app.post('/quote', (req, res) => {
  try {
    const { movie, character, quote } = req.body;
    sql = ('INSERT INTO quote(movie,quote,character) VALUES (?,?,?)');
    db.run(sql, [movie, quote, character], (err) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err.message,
        });
      }
      console.log('Successful input', movie, quote, character);
      res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: 400,
      success: false,
      error: 'Bad Request',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
