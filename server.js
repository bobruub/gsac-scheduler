const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// const FILE_PATH = path.join(__dirname, 'data', 'schedule.json');
const SCHEDULE_FILE_NAME = process.env.SCHEDULE_FILE_NAME;
const SCHEDULE_FILE_PATH = process.env.SCHEDULE_FILE_PATH;
if (!SCHEDULE_FILE_NAME) {
  throw new Error("Environment variable SCHEDULE_FILE_NAME is required");
}
if (!SCHEDULE_FILE_PATH) {
  throw new Error("Environment variable SCHEDULE_FILE_PATH is required");
}
console.log(`Using schedule file name from environment variable: ${SCHEDULE_FILE_NAME}`);
console.log(`Using schedule file path from environment variable: ${SCHEDULE_FILE_PATH}`);

const FILE_PATH = path.join(SCHEDULE_FILE_PATH, SCHEDULE_FILE_NAME);
console.log (`Using schedule file path: ${FILE_PATH}`);
app.use(express.json());
app.use(express.static('public'));

// GET current schedule
app.get('/api/schedule', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read schedule file' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      res.status(500).json({ error: 'Invalid JSON format in file' });
    }
  });
});

// POST to overwrite schedule file
app.post('/api/schedule', (req, res) => {
  const newSchedule = req.body;
  if (!Array.isArray(newSchedule)) {
    return res.status(400).json({ error: 'Payload must be an array of schedule items' });
  }

  fs.writeFile(FILE_PATH, JSON.stringify(newSchedule, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to write schedule file' });
    }
    res.json({ message: 'Schedule updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});