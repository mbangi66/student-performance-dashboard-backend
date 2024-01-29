const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Create SQLite database
const db = new sqlite3.Database('student_perf.db');

// Create Student table
db.run(`
CREATE TABLE IF NOT EXISTS Student (
    id INTEGER PRIMARY KEY  AUTOINCREMENT,
    school TEXT,
    sex TEXT,
    age NUMERIC,   
    address TEXT,
    famsize TEXT,
    Pstatus TEXT,
    Medu NUMERIC,     
    Fedu NUMERIC,     
    Mjob TEXT,
    Fjob TEXT,
    reason TEXT,
    guardian TEXT,
    traveltime NUMERIC,     
    studytime NUMERIC,      
    failures NUMERIC,       
    schoolsup TEXT,
    famsup TEXT,
    paid TEXT,
    activities TEXT,
    nursery TEXT,
    higher TEXT,
    internet TEXT,
    romantic TEXT,
    famrel NUMERIC,         
    freetime NUMERIC,       
    goout NUMERIC,          
    Dalc NUMERIC,           
    Walc NUMERIC,           
    health NUMERIC,         
    absences NUMERIC,
    G1 NUMERIC,
    G2 NUMERIC,
    G3 NUMERIC        
   );
`, (err) => {
   if (err) {
      console.error('Error creating Student table:', err);
   } else {
      console.log('Student table created successfully'); 
   }
});
// Read data from CSV file and insert into Student table
fs.createReadStream('student-por.csv')
.pipe(csvParser())
.on('data', (row) => {
   // Explicitly specify columns in the INSERT query
   const columns = Object.keys(row).join(', ');
   const placeholders = Object.keys(row).map(column => `:${column}`);
   const values = Object.fromEntries(Object.entries(row).map(([key, value]) => [':' + key, value]));

   // Insert into Student table using explicit column names
   db.run(`
      INSERT INTO Student (${columns})
      VALUES (${placeholders.join(', ')});
   `, values, function (err) {
      if (err) {
         console.error('Error inserting data into Student table:', err);
      } else {
         console.log(`Data inserted into Student table successfully: ${JSON.stringify(row)}`);
      }
   });
})
.on('end', () => {
   // Close the database connection after data import
   db.close();
});

// Start the Express server
app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
