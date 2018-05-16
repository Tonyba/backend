const router = require('express').Router();
const Medic = require('../models/medic');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const mdAuth = require('../middleware/auth');

router.get('/', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Medic.find({})
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, medics) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error on finding medics in db',
                    errors: err
                });
            }

            Medic.count({}, (err, counter) => {
                res.status(200).json({
                    ok: true,
                    message: 'medics found',
                    medics,
                    total: counter
                });
            });



        });

});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    Medic.findById(id)
        .populate('user', 'name img email')
        .populate('hospital')
        .exec((err, medic) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error on DB'
                });
            }

            if (!medic) {
                return res.status(404).json({
                    ok: false,
                    message: 'the medic does not exist'
                })
            }

            res.status(200).json({
                ok: true,
                message: 'success on getting medic',
                medic
            })

        });
});

router.post('/', mdAuth.verifyToken, (req, res) => {

    const body = req.body;

    const medic = new Medic({
        name: body.name,
        hospital: body.hospital,
        user: req.user._id,

    });

    medic.save((err, newMedic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error on saving medic in db',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            message: 'medic saved',
            newMedic
        });
    });

});

router.put('/:id', mdAuth.verifyToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Medic.findById(id, (err, medic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error updating medic',
                errors: err
            });
        }

        if (!medic) {
            return res.status(404).json({
                ok: false,
                message: 'no medic found',
            });
        }

        medic.name = body.name;
        medic.hospital = body.hospital;
        medic.user = req.user._id;

        medic.save((err, updatedMedic) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error updating medic',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                message: 'medic updated',
                updatedMedic
            });

        });

    });

});

router.delete('/:id', mdAuth.verifyToken, (req, res) => {
    const id = req.params.id;

    Medic.findByIdAndRemove(id, (err, deletedMedic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'error deleting medic',
                erros: err
            });
        }

        res.status(200).json({
            ok: true,
            message: 'medic deleted',
            deletedMedic
        });

    });

});

module.exports = router