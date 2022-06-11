//Express is a node framework, just like jQuery, it adds extra features to make it easier to work with JS.  Its the same thing but for Node. Its for webb applications built with Node.
const express = require("express");
//BodyParser allows us to pass all the information so that we can interact with the website. I will have access to properties and variables such as what values the user typed into the calculator. So far, what ever the user did, the response would always be the same because of the post function 
const bodyParser = require("body-parser")
// Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.
const request = require("request")
//I am binding the express function to the "app" const
const app = express();

// app.use(express.static('public'));
// If I wouldn't have used this use-method, I would not be able to get all the css to the website
app.use(express.static(__dirname));
// When I use the bodyParser, I can use and manipulate the data that is typed into the html
app.use(bodyParser.urlencoded({ extended: true }))
// Everything written above is standard and should be used in every app

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/", function (req, res) {
    // I need to use what the user have typed in. For that, I will need to use the bodyParser
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email
    const https = require('https')
    // This is the data that we will send to mailchimp
    var data = {
        // Members has to be an array, don't ask me why. My array will only contain one object because I will only register one person at a time.
        members:
            [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
    }

    // I am putting this whole object into one long string that will be sent and read by mailchimp
    var jsonData = JSON.stringify(data)
    // console.log(firstName, lastName, email)

    // The url will come from Mailchimps main endpoint. The us8 indicates which server I am connected to and the last string indicates my custom name for my list
    const url = "https://us8.api.mailchimp.com/3.0/lists/2da342bbb9"

    options = {
        method: "POST",
        // This is where I authenticate myself. I can type in any string as the username and my api key as the password
        // Auth allows me to type this in very simply
        auth: "userName:6747cd5fa813c75d8b9efd4c250a8399-us8"
    }
    // I am creating this constant in order to not confuse it with the keyword rec
    const request = https.request(url, options, function (response) {
        // Depending on if they succeeded or not, the server will send them to the success or the failure html file
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data))
        })
    })
    // I am passing the data to the Mailchimp server using this line
    request.write(jsonData)
    // According to Mailchimps documentation, I have to type in the following line in order to complete the request
    request.end()
})

// If you fail to submit your details, the failure html will be shown. The "try again" button on that page doesn't work. It is supposed to send the user back to the "/" page. This function does just that.
app.post("/failure", function (req, res) {
    res.redirect("/");
})

// The following 3 lines were written when I put the app on a localhost:3000
// const port = 3000;
// I am asking it to listen to any http requests to our server. (3000 is standard)
// 3000 is called a port, a channel (like on the radio) that you can tune into.

// app.listen(port, function () {
// The callback function is important because I have to know if the connection is working properly
//I am saying on which port because several might be active
//     console.log(`Example app listening at http://localhost:${port}`);
// });


// this is writtein in order to connect to the host-website heroku
app.listen(process.env.PORT || 3000, function () {
    console.log("You are connected to a port")
})


// {"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}
