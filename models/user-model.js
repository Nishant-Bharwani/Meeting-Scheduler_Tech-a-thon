const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    meetings: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');