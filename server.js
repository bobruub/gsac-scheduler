const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
//const PORT = 3000;
const PORT = process.env.PORT || 3000;


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
    console.log(`Reading schedule file from path: ${FILE_PATH}`);
  // Create backup with current date and time suffix
  const now = new Date();
  const backupFileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  const backupFilePath = FILE_PATH + '.' + backupFileName + '.bak';
  console.log(`Creating backup of schedule file at: ${backupFilePath}`);
  fs.copyFile(FILE_PATH, backupFilePath, (err) => {
    if (err) {
      console.warn('Warning: Failed to create backup file', err);
    } else {
      console.log(`Backup created at ${backupFilePath}`);
    }
  });

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
    console.log(`Writing schedule file to path: ${FILE_PATH}`);
  const newSchedule = req.body;
  if (!Array.isArray(newSchedule)) {
    return res.status(400).json({ error: 'Payload must be an array of schedule items' });
  }

  // Write new schedule
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