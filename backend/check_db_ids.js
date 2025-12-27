const { sequelize } = require('./config/db');

async function checkIds() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const [results, metadata] = await sequelize.query("SHOW VARIABLES LIKE 'auto_increment_increment'");
        console.log('Auto Increment Step:', results);

        const [rows] = await sequelize.query("SELECT Complaint_ID FROM Complaint ORDER BY Complaint_ID LIMIT 10");
        console.log('Actual IDs in DB:', rows);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkIds();
