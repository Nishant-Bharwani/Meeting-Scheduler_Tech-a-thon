const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    title: String,
    date: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    timeSlots: [{
        startTime: String,
        endTime: String
    }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema, 'meetings');