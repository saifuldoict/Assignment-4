const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const userController = require('./controllers/userController');
const protect = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
app.post('/api/registration', userController.registerUser);
app.post('/api/login', userController.loginUser);
app.get('/api/profile', protect, userController.getUserProfile);
app.get('/api/AllProfileRead', protect, userController.getAllUsers);
app.put('/api/profileUpdate', protect, userController.updateUserProfile);
app.delete('/api/delete', protect, userController.deleteUser);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
