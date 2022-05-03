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
app.get("/", (req, resp) => {
    console.log("Hello World");
    resp.send("App is Working");
    // You can check backend is working or not by
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
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
app.listen(5000);
