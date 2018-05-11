const express = require('express');
const app = express();
const mongoose = require('mongoose');
const serveIndex = require('serve-index');
// routes
const users = require('./routes/users');
const login = require('./routes/login');
const hospitals = require('./routes/hospitals');
const medics = require('./routes/medics');
const search = require('./routes/search');
const upload = require('./routes/upload');
const img = require('./routes/img');
// conection to db
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('db connected');
});

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(__dirname + '/'));
app.use('/uploads', serveIndex(__dirname + '/uploads'));


// routes
app.use('/user', users);
app.use('/login', login);
app.use('/hospital', hospitals);
app.use('/medic', medics);
app.use('/search', search);
app.use('/upload', upload);
app.use('/img', img);



app.listen(3000, () => {
    console.log('server on: \x1b[32m%s\x1b[0m', 'port 3000');
});