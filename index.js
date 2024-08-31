const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('views'));

// Routes
const homeRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const profileRoutes = require('./routes/profile');
const addproperty = require('./routes/properties');
const viewproperties = require('./routes/viewproperties');
const show = require('./routes/show');


app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/profile', profileRoutes);
app.use('/add-property',addproperty);
app.use('/viewproperties',viewproperties);
app.use('/show',show);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
