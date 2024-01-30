const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database('student_perf.db')

// Middleware for parsing JSON requests
app.use(express.json());

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

// API for performance data for a specific student.
app.get('/api/performance/:studentId', (req, res) => {
    const { studentId } = req.params;
  
    // Fetch performance data for the specific student
    db.get('SELECT G1, G2, G3 FROM Student WHERE id = ?', [studentId], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      // Respond with the performance data for the specific student
      res.json({ performanceData: row });
    });
  });

// Get performance data for all students in a specific school.
app.get('/api/schools/:id/performance', (req, res) => {
    const { id } = req.params;
  
    // Fetch performance data for all students in the specific school
    db.all('SELECT G1, G2, G3 FROM Student WHERE school = ?', [id], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      // Respond with the performance data for all students in the specific school
      res.json({ performanceData: rows });
    });
});

app.get('/api/performance-by-lunch', (req, res) => {
    // Fetch data and calculate impact
    // Calculate average scores based on lunch type
    db.all('SELECT lunch, AVG(G1) AS avgG1, AVG(G2) AS avgG2, AVG(G3) AS avgG3 FROM Student GROUP BY lunch', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ impactByLunch: rows });
    });
});


// Create a new student
app.post('/api/students', (req, res) => {
    const newStudent = req.body;
  
    // Validate that the required information is present in the request body
    if (!newStudent.school || !newStudent.sex || !newStudent.age) {
      res.status(400).json({ error: 'Required information (school, sex, age) is missing for creating a new student' });
      return;
    }
  
    // Inserting the new student into the database
    db.run(
      'INSERT INTO Student (school, sex, age, address, famsize, Pstatus, Medu, Fedu, Mjob, Fjob, reason, guardian, traveltime, studytime, failures, schoolsup, famsup, paid, activities, nursery, higher, internet, romantic, famrel, freetime, goout, Dalc, Walc, health, absences, G1, G2, G3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newStudent.school,
        newStudent.sex,
        newStudent.age,
        newStudent.address,
        newStudent.famsize,
        newStudent.Pstatus,
        newStudent.Medu,
        newStudent.Fedu,
        newStudent.Mjob,
        newStudent.Fjob,
        newStudent.reason,
        newStudent.guardian,
        newStudent.traveltime,
        newStudent.studytime,
        newStudent.failures,
        newStudent.schoolsup,
        newStudent.famsup,
        newStudent.paid,
        newStudent.activities,
        newStudent.nursery,
        newStudent.higher,
        newStudent.internet,
        newStudent.romantic,
        newStudent.famrel,
        newStudent.freetime,
        newStudent.goout,
        newStudent.Dalc,
        newStudent.Walc,
        newStudent.health,
        newStudent.absences,
        newStudent.G1,
        newStudent.G2,
        newStudent.G3
      ], 
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
  
        // Respond with the information of the newly created student
        res.json({
          success: true,
          message: 'Student created successfully',
          student: {
            id: this.lastID,
            ...newStudent  
          }
        });
      }
    );
  });

// Update details of a specific student
app.put('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const updatedStudent = req.body;
  
    // Validate that the required information is present in the request body
    if (!updatedStudent.school || !updatedStudent.sex || !updatedStudent.age) {
      res.status(400).json({ error: 'Required information (school, sex, age) is missing for updating the student' });
      return;
    }
  
    // Update the details of the specific student in the database
    db.run(
      'UPDATE Student SET school = ?, sex = ?, age = ?, address = ?, famsize = ?, Pstatus = ?, Medu = ?, Fedu = ?, Mjob = ?, Fjob = ?, reason = ?, guardian = ?, traveltime = ?, studytime = ?, failures = ?, schoolsup = ?, famsup = ?, paid = ?, activities = ?, nursery = ?, higher = ?, internet = ?, romantic = ?, famrel = ?, freetime = ?, goout = ?, Dalc = ?, Walc = ?, health = ?, absences = ?, G1 = ?, G2 = ?, G3 = ? WHERE id = ?',
      [
        updatedStudent.school,
        updatedStudent.sex,
        updatedStudent.age,
        updatedStudent.address,
        updatedStudent.famsize,
        updatedStudent.Pstatus,
        updatedStudent.Medu,
        updatedStudent.Fedu,
        updatedStudent.Mjob,
        updatedStudent.Fjob,
        updatedStudent.reason,
        updatedStudent.guardian,
        updatedStudent.traveltime,
        updatedStudent.studytime,
        updatedStudent.failures,
        updatedStudent.schoolsup,
        updatedStudent.famsup,
        updatedStudent.paid,
        updatedStudent.activities,
        updatedStudent.nursery,
        updatedStudent.higher,
        updatedStudent.internet,
        updatedStudent.romantic,
        updatedStudent.famrel,
        updatedStudent.freetime,
        updatedStudent.goout,
        updatedStudent.Dalc,
        updatedStudent.Walc,
        updatedStudent.health,
        updatedStudent.absences,
        updatedStudent.G1,
        updatedStudent.G2,
        updatedStudent.G3,
        studentId
      ], 
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
  
        // Check if any rows were affected
        if (this.changes === 0) {
          res.status(404).json({ error: 'Student not found' });
          return;
        }
  
        // Respond with the information of the updated student
        res.json({
          success: true,
          message: 'Student details updated successfully',
          student: {
            id: studentId,
            ...updatedStudent  // Include other fields if needed
          }
        });
      }
    );
  });

// Delete a specific student
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;

// Delete the specific student from the database
db.run('DELETE FROM Student WHERE id = ?', [studentId], function (err) {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
    }

    // Check if any rows were affected
    if (this.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
        return;
    }

    // Respond with a success message
    res.json({
        success: true,
        message: 'Student deleted successfully',
        studentId: studentId
    });
});
});

// API for students by multiple criteria
app.post('/api/students/filter', (req, res) => {
    const { criteria } = req.body;
  
    // Define an SQL query string based on the provided criteria
    let sql = 'SELECT * FROM Student WHERE 1=1';
    const params = [];
  
    // Check if criteria are provided and append them to the query
    if (criteria) {
      if (criteria.school) {
        sql += ' AND school = ?';
        params.push(criteria.school);
      }
      if (criteria.gender) {
        sql += ' AND sex = ?';
        params.push(criteria.gender);
      }
  
      // Execute the query
      db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ filteredStudents: rows });
      });
    } else {
      res.status(400).json({ error: 'Criteria not provided' });
    }
});

// API for Average Scores
app.get('/api/average-scores', (req, res) => {
    db.get('SELECT AVG(G1) AS avgG1, AVG(G2) AS avgG2, AVG(G3) AS avgG3 FROM Student', (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ averageScores: row });
    });
});

// API for performance by gender
app.get('/api/performance-by-gender', (req, res) => {
    db.all('SELECT sex, AVG(G1) AS avgG1, AVG(G2) AS avgG2, AVG(G3) AS avgG3 FROM Student GROUP BY sex', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ performanceByGender: rows });
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

