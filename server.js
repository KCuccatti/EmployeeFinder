// Import necessary packages and their functionalities
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Allow app to have express functionalities
const app = express();

// Define port to be used
const PORT = 8080;

// Sets up server to parse request body for usage
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Sets our server to use the public directory for static assets
app.use(express.static(path.join(__dirname, './app/public')));

// Parse application/json two types of data will be coming at us
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
require('./app/routing/htmlRoutes.js')(app);

// Starts server on the predefined PORT
app.listen(PORT, function(){
    console.log(`App is now listening on PORT ${PORT}`)
})
