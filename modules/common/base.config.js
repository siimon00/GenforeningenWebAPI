(function () {
    'use strict';
    
    module.exports = {
        discriminatorKey: "_type", //If you've got a lot of different data types, you could also consider setting up a secondary index here.
        collection: "genforeningen"   //Name of the Common Collection
    }
})();