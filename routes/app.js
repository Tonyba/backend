const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        message: 'peticion enviada'
    });
});


module.exports = router;