import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Resolve __dirname and __filename in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List of allowed emails and password
const allowedEmails = ["chandraharshavasa@gmail.com", "harshavasa816@gmail.com", "vallemanasa000@gmail.com", "pranavdsp1718@gmail.com" ,"deepaksheoran865@gmail.com"]; // Replace with your allowed emails
const allowedPassword = "Chegg@321"; // Replace with a secure password
let activeSessionToken = null;

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!allowedEmails.includes(email) || password !== allowedPassword) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // Invalidate the previous session if it exists
    activeSessionToken = Math.random().toString(36).substr(2); // Generate a random session token
    res.json({ success: true, token: activeSessionToken });
});

app.post('/api/check-session', (req, res) => {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader && authHeader.split(' ')[1];

    if (!sessionToken || sessionToken !== activeSessionToken) {
        return res.json({ valid: false });
    }

    res.json({ valid: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

