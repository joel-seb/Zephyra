const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmadb';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log(' Connected to MongoDB successfully!');
        console.log(' Database: pharmadb');
    })
    .catch((error) => {
        console.error(' MongoDB connection error:', error);
        process.exit(1);
    });

module.exports = mongoose;
