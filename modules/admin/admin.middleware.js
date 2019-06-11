(function () {
    'use strict';

    module.exports = {
        login: login,
        getAll: getAll,
        createAdmin: createAdmin,
        deleteAdmin: deleteAdmin
    };

    // instance of AdminService to handle db interactions
    var AdminService = require('./admin.module')().AdminService;

    // function to retrieve a list of all admins
    function getAll(req, res, next) {

        AdminService.getAll()
            .then(success)
            .catch(failure);

        function success(data) {
            req.response = data;
            next();
        }

        function failure(error) {
            next(error);
        }
    }

    // function to create an admin
    function createAdmin(req, res, next) {
        AdminService.getAdmin(req.body.username)
            .then(getAdminSuccess)
            .catch(failure);

        function getAdminSuccess(data) {
            if (data.length === 0) {
                AdminService.createAdmin(req.body)
                    .then(success)
                    .catch(failure);
            } else {
                req.response = 'username_exists';
                next();
            }
        }

        function success(data) {
            req.response = data;
            next();
        }
        function failure(err) {
            next(err);
        }
    }

    // function to delete an admin
    function deleteAdmin(req, res, next) {

        let adminId = '';

        AdminService.getAdmin(req.query.username)
            .then(getAdminSuccess)
            .catch(failure);

        function getAdminSuccess(data) {
            if (data.length === 1) {
                adminId = data[0]._id;
                AdminService.getAll()
                    .then(getAllSuccess)
                    .catch(failure);
            } else {
                req.response = 'not_found';
                next();
            }
        }

        function getAllSuccess(data) {
            if (data.length > 1) {
                AdminService.deleteAdmin(adminId)
                    .then(success)
                    .catch(failure);
            } else {
                // there is only 1 admin document in the database
                // not allowed to delete 
                req.response = 'not_allowed';
                next();
            }
        }

        function success(data) {
            req.response = data;
            next();
        }

        function failure(err) {
            next(err);
        }
    }

    // function to handle login requests
    function login(req, res, next) {
        // call adminservice.login which returns a promise
        // that resolves to an admin with the corresponding username and password that was given
        // in the request
        AdminService.login(req.body)
            .then(success)
            .catch(failure);

        // on successfull query
        function success(data) {
            // set req.response to the returned data
            // for the next callback function
            req.response = data;
            next();
        }

        // on error
        function failure(error) {
            // skip next callback and send error
            next(error);
        }
    }
})();
