// Import dependencies
require('dotenv').config();
const { Sequelize } = require('sequelize');  

// Create a new Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,  // Ensure environment variables are loaded
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false, // Disable logging for cleaner output
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
);

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

// Export sequelize instance and testConnection function
module.exports = { sequelize, testConnection };
