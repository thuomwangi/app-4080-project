const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');

const {
    getAllProducts,
    createProduct,
} = require('../controllers/products-controllers');



router.get('/', getAllProducts);

router.post('/create', createProduct);

module.exports = router;