(function () {
    'use strict';

    var mongoose = require('mongoose')

    module.exports = {
        findUser: findUser,
        signup: signup,
        saveUser: saveUser
    };

    // instance of UserModel for mongoose interactions
    var UserModel = require('./user.module')().UserModel;

    function findUser(cookie) {
        return UserModel.findOne({ _id: mongoose.Types.ObjectId(cookie) })
            .exec();
    }

    function signup(cookie, eventId) {
        return UserModel.updateOne({ _id: mongoose.Types.ObjectId(cookie) }, { $push: { eventIds: eventId } })
    }

    function saveUser(user) {
        return UserModel.create(user);
    }

})();
