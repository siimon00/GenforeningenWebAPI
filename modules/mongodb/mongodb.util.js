(function () {
    'use strict';

    module.exports = {
        init: init
    };

    var mongoose = require('mongoose');

    function init() {
        //mongoose.connect('mongodb://localhost:27017/genforeningen', { useNewUrlParser: true });
        mongoose.connect("mongodb://reunion2020-db:kvIIant8vSvFYI34bKjB9xbdqFWrFFAn1g5fnflfPMeKOuKiQsXUrN7cGdF0oGoqSQL9MghDWPu4nK8l8kWh9Q%3D%3D@reunion2020-db.documents.azure.com:10255/?ssl=true",
         {
              useNewUrlParser: true,
              dbName: 'Genforeningen2020'
         });
    }
})();