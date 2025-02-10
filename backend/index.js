const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./database/db'); // Import database connection
const userRoutes = require('./routes/userRoute');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: `http://localhost:3000`, // Update this with your front-end URL if needed
    credentials: true
}));
app.use(express.json()); // Built-in express middleware for JSON parsing
app.use(express.urlencoded({ extended: true })); // Built-in express middleware for URL-encoded data

// Test route
app.get('/', (req, res) => {
    res.send("Welcome to NepNutri API");
});

// API Routes
app.use('/users', userRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Sync database (Only for development - remove in production)
sequelize.sync()
    .then(() => console.log("✅ Database synced"))
    .catch(err => console.error("❌ Database sync failed:", err));

// Test database connection and start server
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Failed to start server due to database connection issues:', err);
});
