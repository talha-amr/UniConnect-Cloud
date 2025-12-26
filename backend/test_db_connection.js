const { sequelize } = require('./config/db');

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database connected successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

testConnection();
