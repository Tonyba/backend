const router = require('express').Router();
const Hospital = require('../models/hospital');
const User = require('../models/user');
const mdAuth = require('../middleware/auth');

router.get('/', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error getting hospitals',
                    errors: err
                });
            }

            Hospital.count({}, (err, counter) => {
                res.status(200).json({
                    ok: true,
                    hospitals,
                    total: counter
                });
            });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error on DB'
                });
            }

            if (!hospital) {
                return res.status(404).json({
                    ok: false,
                    message: 'the hospital does not exist'
                })
            }

            res.status(200).json({
                ok: true,
                message: 'success on getting hospital',
                hospital
            })

        });
});

router.post('/', mdAuth.verifyToken, (req, res) => {

    const body = req.body;

    const hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save((err, newHospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                messsage: 'error posting hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            message: 'succes on posting new Hospital',
            hospital: newHospital
        });
    });

});

router.put('/:id', mdAuth.verifyToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error updating hospital in db',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                message: 'no hospital found'
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, updatedHospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error updating hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'hospital updated',
                hospital: updatedHospital
            });
        });

    });

});


router.delete('/:id', mdAuth.verifyToken, (req, res) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error deleting hospital',
                errors: err
            });
        }

        if (!deletedHospital) {
            return res.status(404).json({
                ok: false,
                message: 'no hospital found'
            });
        }

        res.status(200).json({
            ok: true,
            message: 'success on deleting hospital',
            deletedHospital
        });

    });

});


module.exports = router;