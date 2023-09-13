const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const localStorage = require('localStorage');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/get-tokens', async (req, res) => {
    const { client_id, client_secret, code } = req.body;

    if (client_id && client_secret) {
        localStorage.setItem('client_id', client_id);
        localStorage.setItem('client_secret', client_secret);
    }

    // Command 1: Getting Access and Refresh Tokens
    const data = {
        grant_type: 'authorization_code',
        client_id: client_id,
        client_secret: client_secret,
        code: code,
    };

    try {
        const token_url = 'https://accounts.zoho.com/oauth/v2/token';
        const response = await axios.post(token_url, new URLSearchParams(data));

        const token_data = response.data;
        if (token_data.access_token && token_data.refresh_token) {
            const access_token = token_data.access_token;
            const refresh_token = token_data.refresh_token;

            const tokenResponse = {
                access_token,
                refresh_token,
            };

            res.json(tokenResponse);
        } else {
            res.status(400).json({ error: 'Invalid response from the token endpoint.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to connect to the token endpoint.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
