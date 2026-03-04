const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    createProduct,
} = require('../controllers/products-controllers');

// GET /api/products - Get all products
router.get('/', getAllProducts);

// POST /api/products - Create a new product
router.post('/create', createProduct);

module.exports = router;