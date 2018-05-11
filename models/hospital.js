const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
    name: { type: String, required: [true, 'name is required'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);