const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
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

        // Store the initial token and race details
        races[raceId] = {
            initialToken: token,
            lastToken: null,
            laps: 0,
            tokens: [],  // Store tokens for each lap
            startTime: new Date() // Record the start time
        };

        // Return the raceId as both id and raceId to ensure compatibility
        res.json({ id: raceId, raceId, racerId: '69edff8d-005a-4f0e-844d-ada0b064d842' });
    } catch (error) {
        console.error('Error starting race:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to complete a lap
app.post('/races/:id/laps', (req, res) => {
    try {
        const raceId = req.params.id; // Get the raceId from the request parameters
        const token = req.body.token;

        if (!races[raceId]) {
            return res.status(404).json({ message: 'Race not found' });
        }

        // Retrieve race information
        const race = races[raceId];

        // If this is the first lap, use the initial token
        const responseToken = race.tokens.length === 0 ? race.initialToken : race.tokens[race.tokens.length - 1];

        // Store the new token for the next lap
        race.tokens.push(token);
        race.lastToken = token;
        race.laps += 1;

        // Return the token from the previous lap
        res.json({ token: responseToken, racerId: '69edff8d-005a-4f0e-844d-ada0b064d842' });
    } catch (error) {
        console.error('Error completing lap:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to get race results
app.get('/races/:id', (req, res) => {
    try {
        const raceId = req.params.id; // Get the raceId from the request parameters

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
            tokens: race.tokens,  // Return all tokens if needed
            timeTaken: `${timeTaken} seconds`
        });
    } catch (error) {
        console.error('Error retrieving race results:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
