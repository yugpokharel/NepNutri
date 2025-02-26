require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./database/db');
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow cookies and credentials
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send("Welcome to NepNutri API");
});

app.use('/users', userRoutes);

// Handle preflight requests
app.options('*', cors());

// Sync database (only in development)
if (NODE_ENV !== 'production') {
  sequelize.sync()
    .then(() => console.log("✅ Database synced"))
    .catch(err => console.error("❌ Database sync failed:", err));
}

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
});