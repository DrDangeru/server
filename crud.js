const db= require('sqlite').verbose();


const updateItem=(id, movie,quote, callback) =>{
  const sql = `UPDATE quote SET movie=?, quote=? WHERE id =?  `
  db.run(sql, [movie,quote,id], callback)
  

}

const deleteItem= (id,callback) =>{
  const sql = `DELETE from quote WHERE id=?`
  db.run(sql, id,callback )
}