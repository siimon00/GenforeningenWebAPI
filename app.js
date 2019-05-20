var express = require('express');
var app = express();

//var mongoose = require('mongoose');

var MongoDBUtil = require('./modules/mongodb/mongodb.module').MongoDBUtil;
var AdminController = require('./modules/admin/admin.module')().AdminController;
var UserController = require('./modules/user/user.module')().UserController;

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: true });

var cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

MongoDBUtil.init();

// check if user cookie is set
// on each request, before letting it fall through
app.use(async function (req, res, next) {  

    // get instance of usermodel from the user module
    let UserModel = require('./modules/user/user.module')().UserModel;  

    // check if client sent cookie
    let cookie = req.cookies.GenforeningenCookie;

    if (cookie === undefined){
        // client didn't send cookie, generate new
        // have to generate a unique cookie 
        let uniqueCookieFound = false;

        while(!uniqueCookieFound){
            // Generate a random number
            let randomNumber=Math.random().toString();
            // remove first two characters
            randomNumber = randomNumber.substring(2, randomNumber.length);            
            //randomNumber = '9093256025412526';
           
            // check if user with the generated value exists
            let dbUser = await UserModel.find({ cookieValue: randomNumber });
            // if it didn't exist
            if(dbUser.length === 0){
                // put new cookie in response
                res.cookie('GenforeningenCookie', randomNumber, { expires: new Date('2021-01-01'), httpOnly: true });               

                // save new user with new cookievalue
                let newUser = new UserModel({ cookieValue: randomNumber });
                let saveUser = await newUser.save();
                // make sure it saved properly and let request fall through
                if(saveUser === newUser){
                    console.debug('cookie created successfully');
                    uniqueCookieFound = true;
                    next();
                }
            }
        }
    } 
    else
    {
      // client sent cookie
      // check if it exists in the db
      let dbUser = await UserModel.find({ cookieValue: cookie });
      if(dbUser.length !== 1) {
          if(dbUser.length > 1){
              // somehow multiple users were found for the specified cookievalue
              res.status(500).send();
          } else {
              // invalid cookie was received
              res.status(403).send();
          }
      } else {     
          // cookie exists in db - let request fall through
          console.debug('cookie exists');     
          next();  
      }
    } 
  });

// Assign the Controllers to the corresponding paths
app.use('/admin', AdminController);

app.listen(4040, () => {
    console.log('We are now listening on port 4040 (serverside)');
});