const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const usersFilePath = path.join(__dirname, '../data', 'properties.json');

// Route to fetch properties
router.get('/', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Unable to read properties data.' });
            return;
        }

        const properties = JSON.parse(data);
        res.json(properties);
    });
});

module.exports = router;