const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        dialectModule: require('mysql2')
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // Do not exit process in serverless environment, throw error instead so handler catches it
        throw error;
    }
};

module.exports = { sequelize, connectDB };
