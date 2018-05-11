const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicSchema = new Schema({
    name: { type: String, required: [true, 'name is required'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'hospital is mandatory'] }
});

module.exports = mongoose.model('Medic', MedicSchema);