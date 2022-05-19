const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")


// To connect with your mongoDB database
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fastsolutiondeveloper:WeareHere1214@unihost.dejxl.mongodb.net/test?authSource=admin&replicaSet=atlas-12njqq-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true', {
    dbName: 'UniHost',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) :
    console.log('Connected to Unihost database'));

// Schema for users of app
const UserSchema = new mongoose.Schema({
    familyname: {
        type: String,
    },
    givenname: {
        type: String,
    },
    googleid: {
        type: String,
    },
    useremail: {
        type: String,
        unique: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('users', UserSchema);
User.createIndexes();

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");

console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("Hello World");
});

app.post("/register", async (req, resp) => {
    try {
        console.log("Registering user", req);
        const user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            delete result.password;
            resp.send(req.body);
            console.log(result);
        } else {
            console.log("User already register");
        }

    } catch (e) {
        console.log(e);
        responsData = {
            message: e.message,
            status: 500
        }
        resp.send(responsData);
    }
});

app.post("/login", async (req, resp) => {
    try {
        console.log("Logging in user", req);
        const user = await User.findOne({
            googleid: req.body.googleid
        });
        if (user) {
            console.log("User logged in");
            resp.send(user);
        }
        else {
            console.log("User not found");
            resp.send("User not found");
        }
    } catch (e) {
        console.log(e);
        responsData = {
            message: e.message,
            status: 500
        }

        resp.send(responsData);

    }
});

app.post("/contactUs", async (req, resp) => {


    try {
        let useremail = req.body.useremail;
        let mesg = req.body.message;

        const msg = {
            to: 'mecati5973@cupbest.com', // Change to your recipient
            from: 'mecati5973@cupbest.com', // Change to your verified sender
            subject: `Contact Us | ${useremail}`,
            text: mesg,
        }

        sgMail.send(msg)
            .then((response) => {
                console.log("statusCode===>", response[0].statusCode)
                console.log(response[0].headers)
            })
            .catch((error) => {
                console.error(error)
            })

        console.log("Contacting us", req);
        resp.send("Message sent");

    }
    catch (e) {
        console.log(e);
        responsData = {
            message: e.message,
            status: 500
        }

        resp.send(responsData);
    }

});




app.listen(5000);
