const router = require('express').Router();
const path = require('path');
const fs = require('fs');

router.get('/:type/:img', (req, res) => {

    const type = req.params.type;
    const img = req.params.img;

    const pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);

    }

});

module.exports = router;