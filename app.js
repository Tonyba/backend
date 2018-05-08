const express = require('express');
const app = express();
const mongoose = require('mongoose');
// routes
const appRoute = require('./routes/app');
const users = require('./routes/users');
const login = require('./routes/login');

// conection to db
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('db connected');
});

// middlewares
app.use(express.urlencoded({ extended: false }));


// routes
app.use('/', appRoute);
app.use('/user', users);
app.use('/login', login);


app.listen(3000, () => {
    console.log('server on: \x1b[32m%s\x1b[0m', 'port 3000');
});