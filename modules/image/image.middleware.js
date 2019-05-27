(function () {
    'use strict';

    module.exports = {   
        getFileData: getFileData    
    };

    // instance of AdminService to handle db interactions
    var ImageService = require('./image.module')().ImageService;

    function getFileData(req, res, next){

        ImageService.getFileData(req.params.id)
            .then(success)
            .catch(failure);

        function success(data){
            req.response = data;
            next();
        }

        function failure(err){
            next(err);
        }
    }
})();