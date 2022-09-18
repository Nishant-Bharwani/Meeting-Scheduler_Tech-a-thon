const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    meetings: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }]
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema, 'meetings');