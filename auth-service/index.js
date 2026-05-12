const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, sequelize } = require('./db');
const User = require('./User');

const app = express();
app.use(express.json());

const JWT_SECRET = 'datahive_secret_key';

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) { res.status(400).json({ error: 'Username taken' }); }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const PORT = 3001;
app.listen(PORT, async () => {
  await connectDB();
  await sequelize.sync(); // This creates the table in Postgres automatically
  console.log(`Auth Service running on port ${PORT}`);
});
