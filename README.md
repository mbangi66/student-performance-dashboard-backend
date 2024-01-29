# Student Performance Dashboard Backend

This repository contains the backend code for the Student Performance Dashboard, an application designed to manage and analyze student performance data. The backend is built using Node.js, Express, and SQLite.

## Features

- Retrieve average scores for all students.
- Get information about schools and students associated with each school.
- Analyze performance data based on gender.
- Create, update, and delete student records.
- Filter and search students based on multiple criteria.

## Getting Started

To set up the backend locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/student-performance-dashboard-backend.git

Install dependencies:

cd student-performance-dashboard-backend
npm install

Run the backend server:
npm start

The server will be accessible at http://localhost:3000.

# API Endpoints

`GET /api/average-scores:` Get average scores for all students.
`GET /api/schools:` Get a list of all schools.
`GET /api/schools/:id/students:` Get a list of students for a specific school.
`GET /api/performance-by-gender:` Get performance data based on gender.
`GET /api/students:` Get all students.
`POST /api/students:` Create a new student.
`GET /api/students/by-school/:school:` Get students for a specific school.
`GET /api/students/by-gender/:gender:` Get students based on gender.
`GET /api/performance/:studentId:` Get performance data for a specific student.
`GET /api/schools/:id/performance:` Get performance data for all students in a specific school.
`POST /api/students/filter:` Filter students based on multiple criteria.
`PUT/PATCH /api/students/:id:` Update details of a specific student.
`DELETE /api/students/:id:` Delete a specific student.