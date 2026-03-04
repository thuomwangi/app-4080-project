require ('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product-routes');
const errorHandler = require('./middlewares/error-handler');    

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/products', productRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();  
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();