// index.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static( 'public'));

// Path to the JSON file
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Helper function to read users from the JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Helper function to write users to the JSON file
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFromFile();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        
        res.redirect('/');
    } else {
        res.send('Invalid username or password.');
    }
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFromFile();

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.send('Username already taken.');
    }

    users.push({ username, password });
    writeUsersToFile(users);

    res.send('Registration successful!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
