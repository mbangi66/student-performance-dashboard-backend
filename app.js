const express = require('express');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('student_perf.db')

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for handling CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Schools API endpoint
app.get('/api/schools', (req, res) => {
    db.all('SELECT DISTINCT school FROM Student', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ schools: rows.map(row => row.school) });
    });
  });

// API for all students
app.get('/api/students', (req, res) => {
    db.all('SELECT * FROM Student', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ students: rows });
    });
  });

// API for students by school
app.get('/api/students/by-school/:school', (req, res) => {
    const { school } = req.params;
    db.all('SELECT * FROM Student WHERE school = ?', [school], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ students: rows });
    });
  });  

// API for students by gender
app.get('/api/students/by-gender/:gender', (req, res) => {
    const { gender } = req.params;
    db.all('SELECT * FROM Student WHERE sex = ?', [gender], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ students: rows });
    });
  });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

