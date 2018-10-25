// Import necessary packages for use with their functionalities
const path = require('path');
const mysql = require('mysql');

// Declare constant variables to be used throughout
const questionsQuery = 'SELECT question_text FROM question';
const employeeQuery = 'SELECT empl_json FROM employee order by id';


 // Establish connection to db
 const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'employee_db'
});

module.exports = (function (app) {

    // Home page route
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    });


    // Survey page html route
    app.get('/surveyData', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/survey.html'));
    });


    // Get the questions
    // Returns data from question table in json format
    app.get('/getSurveyData', function (req, res) {
        var data = {
            "Data": ""
        };

        connection.query(questionsQuery, function (err, rows, fields) {
            if (rows.length != 0) {
                data["Data"] = rows;
                res.json(data);
            } else {
                data["Data"] = 'No data Found..';
                res.json(data);
            }
        });
    });


    // Get the employees
    // Returns data from employee table in json format
    app.get('/getEmployeeData', function (req, res) {
        var data = {
            "Data": ""
        };

        connection.query(employeeQuery, function (err, rows, fields) {
            if (rows.length != 0) {
                data["Data"] = rows;
                res.json(data);
            } else {
                data["Data"] = 'No data Found..';
                res.json(data);
            }
        });
    });

    
    // Catch all route if nothing is entered in url, go to home page
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/home.html'));
    });


    // Insert user data in the table
    app.post('/postSurveyData', function (req, res) {
        var json = `{ "name": "${req.body.name}", "photo": "${req.body.photo}", "scores": [${req.body.answers}]}`;
        
        connection.query("INSERT INTO employee(empl_json) VALUES(?)", json, function (err, result) {
            if (err) throw err;
        });
    });

})