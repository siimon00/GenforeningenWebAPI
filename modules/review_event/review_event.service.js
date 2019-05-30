(function () {

    'use strict';

    const listLimit = 3;

    var mongoose = require('mongoose');

    module.exports = {
        count: count,
        getReviewEvent: getReviewEvent,
        getReviewEvents: getReviewEvents,
        createReviewEvent: createReviewEvent,
        deleteReviewEvent: deleteReviewEvent,
    };

    // instance of ReviewEventModel for mongoose interactions
    var ReviewEventModel = require('./review_event.module')().ReviewEventModel;

    // function to get search parameters for the database query 
    // for the functions that retrieve lists of events
    function getSearchParams(search, date, desc) {
        let params = {};

        if (search && date) {
            params = {
                date: (desc ? { $lte: date } : { $gte: date }),
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
            params = { date: (desc ? { $lte: date } : { $gte: date }) };
        }
        return params;
    }

    function count(search, date, desc) {
        let params = getSearchParams(search, date, desc);
        return ReviewEventModel.countDocuments(params).exec();
    }

    function getReviewEvent(id) {
        return ReviewEventModel.findOne({ _id: mongoose.Types.ObjectId(id) })
            .exec();
    }

    function getReviewEvents(str_pos, search, date, desc) {
        let pos = 0;
        let sort = {};
        let params = {};

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (date) {
            if (desc) {
                if (desc.toLowerCase() === 'true') {
                    sort = { date: 'desc' };
                }
            } else {
                sort = { date: 'asc' };
            }
        }

        params = getSearchParams(search, date, desc);
        return ReviewEventModel.find(params).sort(sort).skip(pos).limit(listLimit).exec();
    }

    function createReviewEvent(title, date, description, location, targetGroupMin, targetGroupMax, externLink, imageId, eventContact) {
        return ReviewEventModel.create(
            {
                title: title,
                date: date,
                description: description,
                location: location,
                targetGroupMin: targetGroupMin,
                targetGroupMax: targetGroupMax,
                externLink: externLink,
                imageId: imageId,
                eventContact: eventContact
            });
    }

    function deleteReviewEvent(id) {
        return ReviewEventModel.deleteOne({ _id: mongoose.Types.ObjectId(id) })
            .exec();
    }
})();