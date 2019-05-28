(function () {
    'use strict';

    module.exports = {
        init: init
    };

    var mongoose = require('mongoose');

    function init() {
        //mongoose.connect('mongodb://localhost:27017/genforeningen', { useNewUrlParser: true, useFindAndModify: false });
        //"mongodb://reunion2020-db:kvIIant8vSvFYI34bKjB9xbdqFWrFFAn1g5fnflfPMeKOuKiQsXUrN7cGdF0oGoqSQL9MghDWPu4nK8l8kWh9Q%3D%3D@reunion2020-db.documents.azure.com:10255/?ssl=true"
        mongoose.connect('mongodb://genforeningen2020-db:' + encodeURIComponent('FSj118DiOUgqMEhAVqywCvpoGs2mOPtBDUuoWuZ7K05b9UpSsskQiZub2LGKfkY4loje65YqiP8a9nJNSIL7gQ==') + '@genforeningen2020-db.documents.azure.com:10255/?ssl=true',
         {
              useNewUrlParser: true,
              useFindAndModify: false,
              dbName: 'Genforeningen2020'
         });
    }
})();