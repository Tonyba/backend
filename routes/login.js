const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SEED = require('../auth/config').SEED;

router.post('/', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error deleting User',
                errors: err
            });
        }

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'user\'s email does not exist',
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(404).json({
                ok: false,
                message: 'the password is incorrect',
            })
        }

        // create token
        user.password = 'fuck you!!';
        const token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 }) // 4 hours

        res.status(200).json({
            ok: true,
            message: 'login',
            token,
            user,
            id: user._id
        });
    });



});


module.exports = router;