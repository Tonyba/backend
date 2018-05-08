const express = require('express');
const app = express();
const mongoose = require('mongoose');

// conection to db
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('db connected');
});

// routes
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'peticion enviada'
    });
});


app.listen(3000, () => {
    console.log('server on: \x1b[32m%s\x1b[0m', 'port 3000');
});