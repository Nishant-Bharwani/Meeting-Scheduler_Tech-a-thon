require('dotenv').config();
const { HOST } = require('./config');
const dbConnect = require('./db/conn');
const express = require('express');
const userRoute = require('./routes/auth-route');
const meetingRoute = require('./routes/meeting-route');
const cors = require("cors");
const app = express();

const server = require('http').createServer(app);
const PORT = process.env.PORT || 8000;
dbConnect();
const corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));
// app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/auth', userRoute);
app.use('/api/meeting', meetingRoute);
app.get("/", (req, res) => {
    res.send("Hello");
});

server.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log(`Listening on http://${HOST}:${PORT}`);
});

// {
//     "email": "nbtaylor1031@gmail.com",
//     "password": "123",
//     "isAdmin": false,
//     "_id": "6325feae712fba769a35e78f",
//     "createdAt": "2022-09-17T17:06:54.060Z",
//     "updatedAt": "2022-09-17T17:06:54.060Z",
//     "__v": 0
// }