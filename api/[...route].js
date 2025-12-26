const app = require('../backend/server');
const { connectDB } = require('../backend/config/db');

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Database connection failed:', error);
        return res.status(500).json({
            message: 'Database connection failed',
            error: error.message,
            details: 'Please check Vercel Environment Variables (DB_HOST, DB_PASSWORD, etc.)'
        });
    }
    return app(req, res);
};
