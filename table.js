const sqlite =require('sqlite3').verbose();
const db = new sqlite.Database( './quote.db',sqlite.OPEN_READWRITE, (err)=>{
  if(err) return console.log(err,'DB Error on table create')
});

const sql = `CREATE TABLE quote(ID INTEGER PRIMARY KEY, movie,quote,character)`;
db.run(sql);

// HAVING a pre gened table is pretty not great.
// Instead a migration would contain all versions
// But not that different come to think of it.