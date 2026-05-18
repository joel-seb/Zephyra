const mongoose = require('mongoose');

// Medicine Schema
const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Tablet', 'Syrup', 'Injection', 'Capsule'],
            message: 'Category must be one of: Tablet, Syrup, Injection, Capsule'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        max: [999999, 'Price cannot exceed 999999']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        max: [999999, 'Stock cannot exceed 999999']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
        validate: {
            validator: (date) => new Date(date).setHours(0, 0, 0, 0) > Date.now(),
            message: 'Expiry date must be in the future'
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: ''
    }
}, { timestamps: true });

// Create text index for search
medicineSchema.index({ name: 'text', company: 'text', category: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
