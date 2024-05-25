const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./db');

const app = express();
app.use(bodyParser.json());

const db = initDB();

app.get('/users', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM users').all();
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  try {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (row) {
      res.json({ user: row });
    } else {
      res.json({ user: {} });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', (req, res) => {
  const { user: { username, password } } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(username, password);
    res.json({
      id: info.lastInsertRowid,
      username,
      password
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('Simple server running on http://localhost:4000'));
