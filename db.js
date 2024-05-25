const Database = require('better-sqlite3');

const DB_ADDR = ':memory:';

const users = [
  {
    username: '1lameuser',
    password: 'secret_password'
  },
  {
    username: 'cool_user_87',
    password: 'notPassword!'
  },
];

const initDB = () => {
  const db = new Database(DB_ADDR);
  db.exec(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  const insertStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  const insertMany = db.transaction((users) => {
    for (const user of users) {
      insertStmt.run(user.username, user.password);
    }
  });

  insertMany(users);

  return db;
};

module.exports = { initDB };
