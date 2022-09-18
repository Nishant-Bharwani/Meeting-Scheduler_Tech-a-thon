const MeetingModel = require('../models/meeting-model');
const UserModel = require('../models/user-model');
class MeetingController {
    async createMeeting(req, res) {
            const { email, title, date, timeSlots, users } = req.body;
            console.log(req.body);

            if (!email || !title || !date || !timeSlots || !users) {
                res.status(403).send("All fields are required");
            }

            let createdById = await UserModel.findOne({ email });
            createdById = createdById._id;

            let usersId = [];
            for (let i = 0; i < users.length; i++) {
                let em = users[i];
                let user = await UserModel.findOne({ em });
                usersId.push(user._id);
            }

            try {
                let meeting = await new MeetingModel({ title: title, date: date, users: usersId, createdBy: createdById, timeSlots: timeSlots });
                console.log(usersId, meeting);
                await meeting.save();
                console.log(createdById);
                let u = await UserModel.findOne({ _id: createdById });
                console.log(u);
                let meetings1 = u.meetings;
                console.log("meetings", meetings1);
                console.log("meeting", meeting);


                await UserModel.updateOne({ _id: createdById }, {
                    $set: {
                        meetings: [...meetings1, meeting._id]
                    }
                });

                // this.scheduleMeeting();


                const { google } = require('googleapis')
                    //const { calendar } = require('googleapis/build/src/apis/calendar')
                const { OAuth2 } = google.auth
                const oAuth2Client = new OAuth2('825033099157-0g86n5vssrfq3s1rk7fi6nevv6llmkau.apps.googleusercontent.com', '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')
                oAuth2Client.setCredentials({ refresh_token: '1//04uCPrjGvMZCRCgYIARAAGAQSNwF-L9IrlXXiWC5ccxWXdMuN7bzSDgTmCtwQGUbC-DkQ-wxu3c7PXO0gdmu6x3p1HByWSPKe4Os', })

                const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

                let attendeesEmails = [];
                for (let i = 0; i < users.length; i++) {
                    attendeesEmails.push({
                        'email': users[i]
                    });
                }

                console.log("Attendeesssss", attendeesEmails);

                // const attendeesEmails = [
                //     { 'email': 'ayushsinght70@gmail.com' },
                //     { 'email': 'sakshambhalla22@gmail.com' },
                // ];

                let dateForSchedule = date.split('-');

                dateForSchedule = dateForSchedule[2] + "-" + dateForSchedule[0] + "-" + dateForSchedule[1];

                console.log("Date", dateForSchedule);
                for (let i = 0; i < timeSlots.length; i++) {
                    console.log(`time ${dateForSchedule}T${timeSlots[i].startTime}:00+05:30`);
                    const eventWithMeet = {
                        title: `${title}`,
                        start: {
                            // dateTime: `${dateForSchedule}T${timeSlots[i].startTime}:00.0z`,
                            dateTime: `${dateForSchedule}T${timeSlots[i].startTime}:00+05:30`,
                            timeZone: 'Asia/Kolkata',
                        },
                        end: {
                            // dateTime: `${dateForSchedule}T${timeSlots[i].endTime}:00.0z`,
                            dateTime: `${dateForSchedule}T${timeSlots[i].endTime}:00+05:30`,
                            timeZone: 'Asia/Kolkata',
                        },
                        attendees: attendeesEmails,
                        reminders: {
                            useDefault: false,
                            overrides: [
                                { method: 'email', 'minutes': 24 * 60 },
                                { method: 'popup', 'minutes': 10 },
                            ],
                        },
                        conferenceData: {
                            createRequest: {
                                conferenceSolutionKey: {
                                    type: 'hangoutsMeet'
                                },
                                requestId: 'coding-calendar-demo'
                            }
                        },
                    };
                    const eventWithoutMeet = {
                        title: `${title}`,
                        start: {
                            dateTime: `${dateForSchedule}T${timeSlots[i].startTime}:00+05:30`,
                            timeZone: 'Asia/Kolkata',
                        },
                        end: {
                            dateTime: `${dateForSchedule}T${timeSlots[i].endTime}:00+05:30`,
                            timeZone: 'Asia/Kolkata',
                        },
                        attendees: attendeesEmails,
                        reminders: {
                            useDefault: false,
                            overrides: [
                                { method: 'email', 'minutes': 24 * 60 },
                                { method: 'popup', 'minutes': 10 },
                            ],
                        },

                    };

                    let response;

                    if (i === 0) {

                        response = await calendar.events.insert({
                            calendarId: 'primary',
                            resource: eventWithMeet,
                            conferenceDataVersion: 1
                        });
                    } else {
                        response = await calendar.events.insert({
                            calendarId: 'primary',
                            resource: eventWithoutMeet,
                            conferenceDataVersion: 1
                        });
                    }

                    const { config: { data: {  start, end, attendees } }, data: { conferenceData } } = response;



                    const { uri } = conferenceData.entryPoints[0];
                    console.log(` Calendar event created: from ${start.dateTime} to ${end.dateTime}, attendees:\n${attendees.map(person => ` ${person.email}`).join('\n')} \n  Join conference call link: ${uri}`);
              
              
            }

            return res.status(201).json({
                meeting,
                uri
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: true,
                message: "Internal Server error",
            });
        }






    }


    async getMeetings(req, res) {
        const { email } = req.body;
        let user = await UserModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            })
        }

        console.log(user.meetings);
        let mIds = [];
        for (let i = 0; i < user.meetings.length; i++) {
            let mid = await MeetingModel.find({ _id: user.meetings[i] });
            mIds.push(mid);
        }


        return res.status(200).json({
            meetings: mIds
        })

    }


    async getAllMeetings(req, res) {

        let kk =  await  MeetingModel.find({});
        return res.status(200).json({meetings: kk});
    }


}

module.exports = new MeetingController();