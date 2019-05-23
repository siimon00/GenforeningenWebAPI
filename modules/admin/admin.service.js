(function () {
    'use strict';

    var mongoose = require('mongoose');

    module.exports = {
        login: login,
        getAll: getAll,
        getAdmin: getAdmin,
        createAdmin: createAdmin,
        deleteAdmin: deleteAdmin
    };

    // instance of AdminModel for mongoose interactions
    var AdminModel = require('./admin.module')().AdminModel;

    function getAll() {
        return AdminModel.find({})
            .exec();
    }

    function getAdmin(username) {
        return AdminModel.find({ username: username })
            .exec();
    }

    function createAdmin(admin) {
        return AdminModel.create(admin);
    }

    function deleteAdmin(id) {
        return AdminModel.deleteOne({ _id: mongoose.Types.ObjectId(id) })
            .exec();
    }

    function login(admin) {
        // request body should contain JSON format like below
        // { "username": "admin_username", "password": "hashed_admin_password" }
        return AdminModel.findOne({ username: admin.username, password: admin.password })
            .exec();
    }
})();
