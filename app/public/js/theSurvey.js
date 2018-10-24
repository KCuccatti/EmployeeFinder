$(document).ready(function () {
    
    /*
    ******************** TODO: ********************** 
    *
    * Show user confirmation of their information being entered successfully.
    * Create a modal for showing the employee match.
    * Add delete and update functionality
    * 
    */

    // Declare global variables
    var questions = '';
    var answers = [];
    var employeeData = '';
    var matchingName = '';
    var matchingPhoto = '';


    // When getSurveyQuestions ajax function is done, display questions from db
    $.when(ajaxGetSurveyQuestions()).done(function (a1) {
        $('#questions').html(questions);
    });

    // Make an ajax call to get the questions from the back-end API
    function ajaxGetSurveyQuestions() {
        return $.ajax({
            type: "GET",
            url: `http://localhost:8080/getSurveyData`,
            datatype: "json",
            success: getQuestions,
        });
    }

    // Using questions from db, generate html to display questions
    function getQuestions(response) {
        let questionHtml = '';
        let data = response.Data;
        for (let i = 0; i < data.length; i++) {
            questionHtml += `<h3><strong>Question ${i + 1}</strong></h3>`;
            questionHtml += `<h4>${data[i].question_text}</h4>`;
            questionHtml += `<select class="custom-select" id="q${i + 1}">`;
            questionHtml += `<option value="" selected disabled>Select an Option</option>
                                  <option value="1">1 (Strongly Disagree)</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5 (Strongly Agree)</option>
                                  </select>`;
        }
        questions = questionHtml;
    }


    $('#submit').on('click', function () {

        // Gather up answers to questions
        $('.custom-select').each(function (i, obj) {
            answers.push($(this).find('option:selected').val());
        });

        // Ajax post request to insert data into database
        $.post("/postSurveyData",
            {
                name: $('#name').val(),
                photo: $('#photo').val(),
                answers: answers
            },
            function (data, status) {
                // alert("Data: " + data + "\nStatus: " + status);
            });
        closestMatch(answers);
        $('#match-name').html(matchingName);
        $('#match-img').attr('src',matchingPhoto);
    })

    // Calculate a users match with an employee based off of answers to questions
    function closestMatch(myAnswers) {
        let leastDiff = 999;
        let sum = 0;

        for (let i = 0; i < (employeeData.length) - 1; i++) {
            let emplData = JSON.parse(employeeData[i].empl_json)
            for (let j = 0; j < emplData.scores.length; j++) {
                sum += Math.abs(myAnswers[j] - emplData.scores[j]);
            };

            // Keep searching for a match if sum > lestDiff
            if (sum < leastDiff) {
                matchingName = emplData.name;
                matchingPhoto = emplData.photo;
                leastDiff = sum;
            }
            sum = 0;
        }
    }


    $.when(ajaxGetEmployeeData()).done(function (a1) {

    });

    // Make an ajax call to get the employees from the back-end API
    function ajaxGetEmployeeData() {
        return $.ajax({
            type: "GET",
            url: `http://localhost:8080/getEmployeeData`,
            datatype: "json",
            success: getEmployeeData,
        });
    }

    function getEmployeeData(response) {
        employeeData = response.Data;
    }
})

