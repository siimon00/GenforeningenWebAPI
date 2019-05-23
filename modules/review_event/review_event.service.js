(function () {

    'use strict';

    var mongoose = require('mongoose');

    module.exports = {
        getReviewEvent: getReviewEvent,
        getFifty: getFifty,
        createReviewEvent: createReviewEvent,
        deleteReviewEvent: deleteReviewEvent,
        getFiftyByDateAsc: getFiftyByDateAsc,
        getFiftyByDateDesc: getFiftyByDateDesc        
    };

    // instance of ReviewEventModel for mongoose interactions
    var ReviewEventModel = require('./review_event.module')().ReviewEventModel;

    function getReviewEvent(id){
        return ReviewEventModel.findOne({ _id: mongoose.Types.ObjectId(id) })
            .exec();
    }

    function getFifty(str_pos, search) {
        let pos = 0;
        let params = {};

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search) {
            params = {
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        }
        return ReviewEventModel.find(params).skip(pos).limit(3).exec();
    }

    function createReviewEvent(title, date, description, location, targetGroupMin, targetGroupMax, imageId) {
        return ReviewEventModel.create(
            {
                title: title,
                date: date,
                description: description,
                location: location,
                targetGroupMin: targetGroupMin,
                targetGroupMax: targetGroupMax,
                imageId: imageId
            });
    }

    function deleteReviewEvent(id){
        return ReviewEventModel.deleteOne({ _id: mongoose.Types.ObjectId(id) })
            .exec();
    }

    function getFiftyByDateAsc(str_pos, search, date) {
        let pos = 0;
        let params = {};

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search && date) {
            params = {
                date: { $gte: date },
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (search) {
            params = {
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (date) {
            params = { date: { $gte: date } };
        }

        return ReviewEventModel.find(params).sort({ date: 'asc' }).skip(pos).limit(3).exec();
    }

    function getFiftyByDateDesc(str_pos, search, date) {
        let pos = 0;
        let params = {};

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search && date) {
            params = {
                date: { $lte: date },
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (search) {
            params = {
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (date) {
            params = { date: { $lte: date } };
        }

        return ReviewEventModel.find(params).sort({ date: 'desc' }).skip(pos).limit(3).exec();
    }

})();