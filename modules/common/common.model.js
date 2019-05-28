(function () {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    const BaseConfig = require('./base.config');    

    module.exports = mongoose.model('common', new Schema({}, BaseConfig));
})();