require("dotenv").config();
const { Sequelize } = require("sequelize");

// Check environment variables
if (
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST
) {
  console.error("❌ Missing database configuration in .env file.");
  process.exit(1);
}

// Configure Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: console.log, // Always log in development
    dialectOptions: {}, // No SSL for local
    // sync: { force: process.env.NODE_ENV !== "production" },
  }
);

// Test connection
async function testConnection() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

module.exports = { sequelize, testConnection };
