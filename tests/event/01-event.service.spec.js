'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-mongoose');

var mongoose = require('mongoose');
var EventModule = require('../../modules/event/event.module')();
var EventModel = EventModule.EventModel;
var EventService = EventModule.EventService;

var Fixtures = require('./fixtures');
var EventFixture = Fixtures.EventFixture;
var EventModelMock;

describe('EventService', function () {

    beforeEach(function () {
        EventModelMock = sinon.mock(EventModel);
    });

    afterEach(function () {
        EventModelMock.restore();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        return mongoose.connection.close();
    });

    describe('count', function () {
        var expectedResult;

        it('should return number of Event entries in collection with no search parameters passed in', async function () {
            expectedResult = EventFixture.events.length;

            EventModelMock.expects('countDocuments')
                .withArgs({ status: 'Active' })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.count();

            EventModelMock.verify();
            expect(data).to.equal(expectedResult);
        });

        it('should return number of Event entries in collection that matches search parameter', async function () {
            expectedResult = 1;

            EventModelMock.expects('countDocuments')
                .withArgs(
                    {
                        status: 'Active',
                        $or:
                            [
                                { title: { $regex: 'search_string', $options: 'i' } },
                                { description: { $regex: 'search_string', $options: 'i' } }
                            ]
                    })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.count('search_string');

            EventModelMock.verify();
            expect(data).to.equal(expectedResult);
        });

        it('should return number of Event entries in collection that matches date parameter', async function () {
            expectedResult = 1;
            var desc;

            EventModelMock.expects('countDocuments')
                .withArgs(
                    {
                        status: 'Active',
                        date: (desc ? { $lte: '2020-08-15 00:00:00.000Z' } : { $gte: '2020-08-15 00:00:00.000Z' })
                    })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.count(undefined, '2020-08-15 00:00:00.000Z');

            EventModelMock.verify();
            expect(data).to.equal(expectedResult);
        });

        it('should return number of Event entries in collection that matches search and date parameter', async function () {
            expectedResult = 1;
            var desc;

            EventModelMock.expects('countDocuments')
                .withArgs(
                    {
                        status: 'Active',
                        date: (desc ? { $lte: '2020-08-15 00:00:00.000Z' } : { $gte: '2020-08-15 00:00:00.000Z' }),
                        $or:
                            [
                                { title: { $regex: 'search_string', $options: 'i' } },
                                { description: { $regex: 'search_string', $options: 'i' } }
                            ]
                    })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.count('search_string', '2020-08-15 00:00:00.000Z');

            EventModelMock.verify();
            expect(data).to.equal(expectedResult);
        });
    });

    describe('addSignup', function () {
        var expectedResult;

        it('should increment the signups attribute of an Event with the specified _id', async function () {
            expectedResult = { ok: 0, n: 1 };
            let signupEvent = EventFixture.events[0];

            EventModelMock.expects('findOneAndUpdate')
                .withArgs({ _id: mongoose.Types.ObjectId(signupEvent._id) }, { $inc: { signups: 1 } })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.addSignup(signupEvent._id);

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        })
    });

    describe('getEvent', function () {
        var expectedResult;

        it('should return one Event that matches the specified _id', async function () {
            expectedResult = EventFixture.events[0];

            EventModelMock.expects('findOne')
                .withArgs({ _id: mongoose.Types.ObjectId(expectedResult._id) })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.getEvent(expectedResult._id);

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });

    describe('getEvents', function () {
        var expectedResult;

        it('should return the three first events when no parameters are given', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            EventModelMock.expects('find')
                .withArgs({ status: 'Active' })
                .chain('sort').withArgs({})
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.getEvents();

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });

        it('should return three events from index 3 when pos = 3 is passed as argument', async function () {
            expectedResult = [EventFixture.events[3], EventFixture.events[4]];

            EventModelMock.expects('find')
                .withArgs({ status: 'Active' })
                .chain('sort').withArgs({})
                .chain('skip').withArgs(3)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.getEvents(3);

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });

        it('should sort by date ascending when date is given as parameter', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            EventModelMock.expects('find')
                .withArgs({ status: 'Active', date: { $gte: "2020-08-15 00:00:00.000Z" } })
                .chain('sort').withArgs({ date: 'asc' })
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.getEvents(undefined, undefined, '2020-08-15 00:00:00.000Z');

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });

        it('should sort by date descending when date and desc = \'true\' is given as parameter', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            EventModelMock.expects('find')
                .withArgs({ status: 'Active', date: { $lte: "2020-08-15 00:00:00.000Z" } })
                .chain('sort').withArgs({ date: 'desc' })
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.getEvents(undefined, undefined, '2020-08-15 00:00:00.000Z', 'true');

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });

    describe('createEvent', function () {
        var expectedResult;

        it('should successfully create the event passed in', async function () {
            expectedResult = EventFixture.createEvent;

            EventModelMock.expects('create')
                .withArgs(expectedResult)
                .resolves(expectedResult);

            const data = await EventService.createEvent(expectedResult);

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });

    describe('deleteEvent', function () {
        var expectedResult;

        it('should successfully update an event with the _id specified\'s status to \'Inactive\'', async function () {
            let deleteEvent = EventFixture.events[0];
            expectedResult = { ok: 0, n: 1 };

            EventModelMock.expects('updateOne')
                .withArgs({ _id: mongoose.Types.ObjectId(deleteEvent._id) }, { status: 'Inactive' })
                .chain('exec')
                .resolves(expectedResult);

            const data = await EventService.deleteEvent(deleteEvent._id);

            EventModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });
});
