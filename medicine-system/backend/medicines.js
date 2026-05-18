const express = require('express');
const router = express.Router();
const Medicine = require('../models/medicine');

// Routes
// Home route
router.get('/', (req, res) => {
    res.json({
        message: 'Medicine Management API with MongoDB is running!',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Search medicines
router.get('/api/medicines/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query.trim();
        const medicines = await Medicine.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: medicines,
            count: medicines.length,
            query: searchQuery
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching medicines',
            error: error.message
        });
    }
});

// Add new medicine
router.post('/api/medicines', async (req, res) => {
    try {
        const { name, company, category, price, stock, expiryDate, description } = req.body;

        const existingMedicine = await Medicine.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            company: { $regex: new RegExp(`^${company}$`, 'i') }
        });

        if (existingMedicine) {
            return res.status(409).json({
                success: false,
                message: 'Medicine with the same name and company already exists'
            });
        }

        const newMedicine = new Medicine({
            name: name.trim(),
            company: company.trim(),
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
            expiryDate: new Date(expiryDate),
            description: description ? description.trim() : ''
        });

        const savedMedicine = await newMedicine.save();

        res.status(201).json({
            success: true,
            data: savedMedicine,
            message: 'Medicine added successfully'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ success: false, message: 'Validation error', errors });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error adding medicine',
                error: error.message
            });
        }
    }
});

// Update medicine
router.put('/api/medicines/:id', async (req, res) => {
    try {
        const { name, company, category, price, stock, expiryDate, description } = req.body;

        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            {
                ...(name && { name: name.trim() }),
                ...(company && { company: company.trim() }),
                ...(category && { category }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(expiryDate && { expiryDate: new Date(expiryDate) }),
                ...(description !== undefined && { description: description.trim() })
            },
            { new: true, runValidators: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        res.json({ success: true, data: updatedMedicine, message: 'Medicine updated successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ success: false, message: 'Validation error', errors });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error updating medicine',
                error: error.message
            });
        }
    }
});

// Delete medicine
router.delete('/api/medicines/:id', async (req, res) => {
    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!deletedMedicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }
        res.json({ success: true, data: deletedMedicine, message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting medicine',
            error: error.message
        });
    }
});

module.exports = router;
