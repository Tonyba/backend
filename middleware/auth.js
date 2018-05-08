const jwt = require('jsonwebtoken');
const SEED = require('../auth/config').SEED;

exports.verifyToken = (req, res, next) => {
    const token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token invalid',
                errors: err
            });
        }

        req.user = decoded.user

        next();

    });

}