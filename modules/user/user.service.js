(function () {
    'use strict';   
    module.exports = {   
        findUser: findUser,
        saveUser: saveUser    
    };

    // instance of UserModel for mongoose interactions
    var UserModel = require('./user.module')().UserModel;

    function findUser(cookie){
        return UserModel.find({ cookieValue: cookie })
            .exec();
    }

    function saveUser(user){
        return UserModel.create(user);
    }

})();
