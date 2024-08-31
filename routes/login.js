const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Path to the JSON file
const usersFilePath = path.join(__dirname, '../data', 'users.json');

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

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
});

router.post('/', (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFromFile();

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Send user details to the profile page
        // res.send(`
        //     <script>
        //         localStorage.setItem('username', '${username}');
        //         localStorage.setItem('profilePicture', '${user.profilePicture || '/uploads/default.png'}');
        //         window.location.href = '/profile';
        //     </script>
        // `);
        res.sendFile(path.join(__dirname, '../views', 'signedin.html'));
    } else {
        res.send('Invalid username or password.');
    }
});

module.exports = router;
