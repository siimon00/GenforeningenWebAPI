(function () {
    'use strict';   
    module.exports = {
        login: login,
        getAll: getAll
      //  createUser: createUser, 
      //  deleteUser: deleteUser
    };

    // instance of AdminModel for mongoose interactions
    var AdminModel = require('./admin.module')().AdminModel;

    function getAll(){
        return AdminModel.find({}, { _id: 0, password: 0 })
            .exec();
    }

    function login(admin) {
        console.debug("in service login");  
        // request body should contain JSON format like below
        // { "username": "admin_username", "password": "hashed_admin_password" }
        return AdminModel.findOne({ username: admin.username, password: admin.password })
            .exec();
    }
})();
