const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB, sequelize } = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('UniConnect API is running...');
});

// Debug Endpoint
app.get('/api/debug', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            status: 'success',
            message: 'Database connection established',
            url: req.url,
            originalUrl: req.originalUrl,
            headers: req.headers,
            env: {
                PORT: process.env.PORT,
                DB_HOST: process.env.DB_HOST ? 'Defined' : 'Undefined',
                // Do not expose secrets
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        });
    }
});

// Sync Database and Start Server
// Export app for Vercel
module.exports = app;

// Sync Database and Start Server only if run directly
const startServer = async () => {
    try {
        await connectDB();
        // Sync models (force: false creates tables if not exist, doesn't drop)
        await sequelize.sync({ force: false });
        console.log('Database synced');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

// Only start server if this file is run directly (not imported by Vercel)
if (require.main === module) {
    startServer();
}
