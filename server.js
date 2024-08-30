const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
app.use(express.json());

const myDb = {
    storedToken: new Map(),
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});


app.post('/races', (req, res) => {
    const receivedToken = req.body.token;
    const raceId = uuidv4();


    myDb.storedToken.set(raceId, receivedToken);


    const toSend = {
        id: raceId,
        racerId: "2532c7d5-511b-466a-a8b7-bb6c797efa36", //
    };

    console.log('Race started:', toSend);
    res.json(toSend);
});


app.post('/races/:id/laps', (req, res) => {
    const raceId = req.params.id;
    const receivedToken = req.body.token;

    if (!myDb.storedToken.has(raceId)) {
        return res.status(404).json({ error: 'Race ID not found' });
    }


    const initialToken = myDb.storedToken.get(raceId);


    myDb.storedToken.set(raceId, receivedToken);


    const toSend = {
        token: initialToken,
        racerId: "2532c7d5-511b-466a-a8b7-bb6c797efa36",
    };

    console.log('Lap completed:', toSend);
    res.json(toSend);
});