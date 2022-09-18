const router = require('express').Router();
const meetingController = require('../controllers/meeting-controller');

router.post('/create', meetingController.createMeeting);
router.post('/getmeetings', meetingController.getAllMeetings);
// router.post('/scheduleCalendar', meetingController.scheduleMeeting);
module.exports = router;
