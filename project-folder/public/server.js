// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List of allowed emails and password
const allowedEmails = ["chandraharshavasa@gmail.com", "harshavasa816@gmail.com", "vallemanasa000@gmail.com" ,"deepaksheoran865@gmail.com" ]; // Replace with your allowed emails
const allowedPassword = "Chegg@321"; // Replace with a secure password

// Store session tokens per email
const sessionTokens = {};

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!allowedEmails.includes(email) || password !== allowedPassword) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Generate a new session token for this email and store it
    const sessionToken = Math.random().toString(36).substr(2);
    sessionTokens[email] = sessionToken;
    res.json({ success: true, token: sessionToken });
});

app.post('/api/check-session', (req, res) => {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader && authHeader.split(' ')[1];
    const { email } = req.body; // Send email in request body for validation

    if (!sessionToken || sessionToken !== sessionTokens[email]) {
        return res.json({ valid: false });
    }

    res.json({ valid: true });
});

app.post('/api/logout', (req, res) => {
    const { email } = req.body;
    delete sessionTokens[email];
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
