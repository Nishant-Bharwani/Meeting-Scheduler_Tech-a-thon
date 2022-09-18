async function f() {
    // You already have the user emails from your NodeJS app
    const attendeesEmails = [
        { 'email': 'nbtaylor1031@gmail.com' },
    ];
    const event = {
        summary: 'Coding class',
        location: 'Virtual / Google Meet',
        description: 'Learn how to code with Javascript',
        start: {
            dateTime: '2022-01-18T09:00:00-07:00',
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: '2022-01-18T09:30:00-07:00',
            timeZone: 'America/Los_Angeles',
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

    const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
    });

    const { config: { data: { summary, location, start, end, attendees } }, data: { conferenceData } } = response;

    // Get the Google Meet conference URL in order to join the call
    const { uri } = conferenceData.entryPoints[0];
    console.log(`📅 Calendar event created: ${summary} at ${location}, from ${start.dateTime} to ${end.dateTime}, attendees:\n${attendees.map(person => `🧍 ${person.email}`).join('\n')} \n 💻 Join conference call link: ${uri}`);
 
  

}

f();