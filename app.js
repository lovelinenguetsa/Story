const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { options } = require("request");
// f3517913f1bea423275110f0bf3778b1-us14
// 00d7ebd6b6
const app = express();

app.use('/public', express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile('signup.html', { root: __dirname });
});

app.post("/", function (req, res) {
    // {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/00d7ebd6b6";
    const options = {
        method: "POST",
        auth: "loveline:f3517913f1bea423275110f0bf3778b1-us14"
    };

   const request = https.request(url, options, function (response) {
       if(response.statusCode === 200){
        res.sendFile('success.html', { root: __dirname });
       }else{
        res.sendFile('failure.html', { root: __dirname });
       }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
    // }
});
app.post("/failure", function(req, res){
res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("running...");
})