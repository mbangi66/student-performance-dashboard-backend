const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('student_perf.db')

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });