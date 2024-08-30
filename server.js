const racerId = process.env.RACER_ID || '69edff8d-005a-4f0e-844d-ada0b064d842'; // Use an environment variable

app.post('/races', (req, res) => {
    try {
        const token = req.body.token;
        const raceId = uuidv4(); // Generate a unique race ID

        // Store the initial token for this race
        races[raceId] = {
            initialToken: token,
            lastToken: null,
        };

        res.json({ raceId, racerId });
    } catch (error) {
        console.error('Error starting race:', error);
        res.status(500).send('Internal Server Error');
    }
});

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

        res.json({ token: responseToken, racerId });
    } catch (error) {
        console.error('Error completing lap:', error);
        res.status(500).send('Internal Server Error');
    }
});
