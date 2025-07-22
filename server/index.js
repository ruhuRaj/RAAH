const express = require("express");
const app = express();

const colors = require('colors');
const morgan = require('morgan');
const path = require('path');

const errorHandler = require('./middleware/errorMiddleware');

const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

const PORT = process.env.PORT || 4000;

dotenv.config();

cloudinaryConnect();

database.connect();

// Imports Routes
const userRoutes = require('./routes/user'); // Import the user management routes
const authRoutes = require('./routes/auth'); // Import the authentication routes
const profileRoutes = require('./routes/profile');
const departmentRoutes = require('./routes/department');
const grievanceRoutes = require('./routes/grievance');
const workProgressRoutes = require('./routes/workProgress');

// Core Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

// serves static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Mounting
// Mount user management routes under /api/users
console.log("Backend: Mounting /api/users routes...");
app.use('/api/users', userRoutes);

// Mount authentication routes under /api/auth
console.log("Backend: Mounting /api/auth routes...");
app.use('/api/auth', authRoutes);

// Other routes
console.log("Backend: Mounting /api/profiles routes...");
app.use('/api/profiles', profileRoutes);

console.log("Backend: Mounting /api/departments routes...");
app.use('/api/departments', departmentRoutes);

console.log("Backend: Mounting /api/grievances routes...");
app.use('/api/grievances', grievanceRoutes);

console.log("Backend: Mounting /api/work-progress routes...");
app.use('/api/work-progress', workProgressRoutes);

// Simple test route
app.get('/test', (req, res) => {
    res.status(200).send('Test route is working!');
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});