const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');

const medicineRoutes = require('./routes/medicines');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', medicineRoutes);

// Error Handling
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(` Medicine Management API running on port ${PORT}`);
    console.log(` API Base URL: http://localhost:${PORT}`);
    console.log(` Medicines API: http://localhost:${PORT}/api/medicines`);
    console.log(` Search API: http://localhost:${PORT}/api/medicines/search/[query]`);
});

module.exports = app;
