var express = require('express');
var app = express();

var mongoose = require('mongoose');
var cors = require('cors');

var MongoDBUtil = require('./modules/mongodb/mongodb.module').MongoDBUtil;
var AdminController = require('./modules/admin/admin.module')().AdminController;
var UserController = require('./modules/user/user.module')().UserController;
var EventController = require('./modules/event/event.module')().EventController;
var ReviewEventController = require('./modules/review_event/review_event.module')().ReviewEventController;

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: true });

var cookieParser = require('cookie-parser');

var corsOptions = {
    origin: 'https://genforeningenwebsite.azurewebsites.net',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

MongoDBUtil.init();

// check if user cookie is set
// on each request, before letting it fall through
// to the controllers
app.use(async function (req, res, next) {

    // get instance of usermodel from the user module
    let UserModel = require('./modules/user/user.module')().UserModel;

    // check if client sent cookie
    let cookie = req.cookies.GenforeningenCookie;

    if (cookie === undefined) {
        // client didn't send cookie, generate new
        // have to generate a unique cookie 
        let uniqueCookieFound = false;

        while (!uniqueCookieFound) {
            // create new user
            let newUser = new UserModel();
            let saveUser = await newUser.save();
            // make sure it saved properly and let request fall through
            if (saveUser === newUser) {
                //console.debug('cookie created successfully');
                // if the user saved successfully create a cookie with the _id as value
                res.cookie('GenforeningenCookie', saveUser._id, { expires: new Date('2021-01-01'), httpOnly: true });
                uniqueCookieFound = true;
                next();
            }
        }
    }
    else {
        // client sent cookie
        // check if it exists in the db
        try {
            let dbUser = await UserModel.find({ _id: mongoose.Types.ObjectId(cookie) });
            if (dbUser.length !== 1) {
                if (dbUser.length > 1) {
                    // somehow multiple users were found for the specified cookievalue
                    res.status(500).send();
                } else {
                    // invalid cookie was received
                    res.status(403).send();
                }
            } else {
                // cookie exists in db - let request fall through
                //console.debug('cookie exists');
                next();
            }
        } catch (err) {
            // invalid cookie was received
            res.status(403).send();
        }
    }
});

// Assign the Controllers to the corresponding paths
app.use('/admins', AdminController);
app.use('/users', UserController);
app.use('/events', EventController);
app.use('/review-events', ReviewEventController);

const port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log('We are now listening on port ' + port + ' (serverside)');
});