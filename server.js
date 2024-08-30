const express = require('express');
const { v4: uuidv4 } = require('uuid');  // Import UUID for unique ID generation
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

// In-memory storage for races and their tokens
const races = {};

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Racer API');
});

// Endpoint to start a race
app.post('/races', (req, res) => {
    try {
        const token = req.body.token;
        const raceId = uuidv4(); // Generate a unique race ID

        // Store the initial token for this race
        races[raceId] = {
            initialToken: token,
            lastToken: null,
            laps: 0, // Initialize lap count
            startTime: new Date() // Record the start time
        };

        res.json({ raceId, racerId: '69edff8d-005a-4f0e-844d-ada0b064d842' });
    } catch (error) {
        console.error('Error starting race:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Tier 1 & 2: Complete a lap
app.post('/races/:id/laps', (req, res) => {
    try {
        const raceId = req.params.id;  // Get the raceId from the request parameters
        const token = req.body.token;

        if (!races[raceId]) {
            return res.status(404).json({ message: 'Race not found' });
        }

        // Retrieve race information
        const race = races[raceId];

        // If this is the first lap, return the initial token
        const responseToken = race.lastToken || race.initialToken;

        // Store the new token for the next lap
        race.lastToken = token;
        race.laps += 1; // Increment lap count

        res.json({ token: responseToken, racerId: '69edff8d-005a-4f0e-844d-ada0b064d842' });
    } catch (error) {
        console.error('Error completing lap:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to get race results
app.get('/races/:id', (req, res) => {
    try {
        const raceId = req.params.id;  // Get the raceId from the request parameters

        if (!races[raceId]) {
            return res.status(404).json({ message: 'Race not found' });
        }

        // Retrieve race information
        const race = races[raceId];
        const endTime = new Date(); // Record the end time
        const timeTaken = (endTime - race.startTime) / 1000; // Calculate time taken in seconds

        res.json({
            raceId: raceId,
            racerId: '69edff8d-005a-4f0e-844d-ada0b064d842',
            laps: race.laps,
            timeTaken: timeTaken + " seconds"
        });
    } catch (error) {
        console.error('Error retrieving race results:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
