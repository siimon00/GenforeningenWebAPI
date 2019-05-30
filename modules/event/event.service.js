(function () {

    'use strict';

    const listLimit = 3;

    var mongoose = require('mongoose');

    module.exports = {
        count: count,
        addSignup: addSignup,
        getEvent: getEvent,
        getEvents: getEvents,
        createEvent: createEvent,
        deleteEvent: deleteEvent
    };


    // instance of EventModel for mongoose interactions
    var EventModel = require('./event.module')().EventModel;

    // function to get search parameters for the database query 
    // for the functions that retrieve lists of events
    function getSearchParams(search, date, desc) {
        let params = { status: 'Active' };

        if (search && date) {
            params = {
                status: 'Active',
                date: (desc ? { $lte: date } : { $gte: date }),
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (search) {
            params = {
                status: 'Active',
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        } else if (date) {
            params = { status: 'Active', date: (desc ? { $lte: date } : { $gte: date }) };
        }
        return params;
    }

    function count(search, date, desc) {
        let params = getSearchParams(search, date, desc);
        return EventModel.countDocuments(params).exec();
    }

    function addSignup(id) {
        return EventModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { $inc: { signups: 1 } }).exec();
    }

    function getEvent(id) {
        return EventModel.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
    }

    function getEvents(str_pos, search, date, desc) {
        let pos = 0;
        let sort = {};
        let params = { status: 'Active' };

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
        return EventModel.find(params).sort(sort).skip(pos).limit(listLimit).exec();
    }

    function createEvent(event) {
        return EventModel.create(event);
    }

    function deleteEvent(event_id) {
        // We don't want to actually delete any of the accepted events
        // Modify status to inactive

        return EventModel.updateOne({ _id: mongoose.Types.ObjectId(event_id) }, { status: 'Inactive' }).exec();
    }

})();