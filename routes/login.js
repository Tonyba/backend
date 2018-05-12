const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SEED = require('../auth/config').SEED;
const CLIENT_ID = require('../auth/config').CLIENT_ID;

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

router.post('/', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error login User',
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

router.post('/google', async(req, res) => {

    const token = req.body.token;

    const googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'token invalid',
                googleUser
            });
        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error login User',
                errors: err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'error login User',
                    errors: err
                });
            } else {
                const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }) // 4 hours

                res.status(200).json({
                    ok: true,
                    message: 'login',
                    user: userDB,
                    token,
                    id: userDB._id
                });
            }
        } else {
            // user does not exist
            const user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'error login User',
                        errors: err
                    });
                }

                const token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 }) // 4 hours

                res.status(200).json({
                    ok: true,
                    message: 'login',
                    user: userDB,
                    token,
                    id: userDB._id
                });
            });
        }

    });

});


module.exports = router;