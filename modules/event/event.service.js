(function () {

    'use strict';

    var mongoose = require('mongoose');

    module.exports = {
        addSignup: addSignup,
        getFifty: getFifty,
        getEvent: getEvent,
        getFiftyByDateAsc: getFiftyByDateAsc,
        getFiftyByDateDesc: getFiftyByDateDesc,
        createEvent: createEvent,
        deleteEvent: deleteEvent
    };


    // instance of EventModel for mongoose interactions
    var EventModel = require('./event.module')().EventModel;

    function addSignup(id){
        return EventModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { $inc: { signups: 1 }}).exec();
    }

    function getFifty(str_pos, search) {
        let pos = 0;
        let params = { status: 'Active' };

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search) {
            params = {
                status: 'Active',
                $or:
                    [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
            };
        }
        return EventModel.find(params).skip(pos).limit(3).exec();
    }

    function getEvent(id){
        return EventModel.findOne({ _id: mongoose.Types.ObjectId(id) }).exec();
    }

    function getFiftyByDateAsc(str_pos, search, date) {
        let pos = 0;
        let params = { status: 'Active' };

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search && date) {
            params = {
                status: 'Active',
                date: { $gte: date },
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
            params = { status: 'Active', date: { $gte: date } };
        }

        return EventModel.find(params).sort({ date: 'asc' }).skip(pos).limit(3).exec();
    }

    function getFiftyByDateDesc(str_pos, search, date) {
        let pos = 0;
        let params = { status: 'Active' };

        try {
            pos = Number(str_pos);
        } catch (err) {
            pos = 0;
        }

        if (search && date) {
            params = {
                status: 'Active',
                date: { $lte: date },
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
            params = { status: 'Active', date: { $lte: date } };
        }

        return EventModel.find(params).sort({ date: 'desc' }).skip(pos).limit(3).exec();
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