'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-mongoose');

var mongoose = require('mongoose');
var EventModule = require('../../modules/event/event.module')();
var EventModel = EventModule.EventModel;
var EventMiddleware = EventModule.EventMiddleware;

var Fixtures = require('./fixtures');
var EventFixture = Fixtures.EventFixture;
var EventModelMock;

describe('EventMiddleware', function () {
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

        it('should return number of Event entries from EventService with no search parameters passed in', async function () {
            expectedResult = EventFixture.events.length;

            let req = { query: {} }
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('countDocuments')
                .withArgs({ status: 'Active' })
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.count(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should return number of Event entries from EventService that matches search parameter', async function () {
            expectedResult = 1;

            let req = { query: { search_string: 'search_string' } }
            let res = {};
            let next = sinon.spy();

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

            await EventMiddleware.count(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should return number of Event entries from EventService that matches date parameter', async function () {
            expectedResult = 1;

            let req = { query: { date: '2020-08-15 00:00:00.000Z' } }
            let res = {};
            let next = sinon.spy();

            let desc;
            EventModelMock.expects('countDocuments')
                .withArgs(
                    {
                        status: 'Active',
                        date: (desc ? { $lte: '2020-08-15 00:00:00.000Z' } : { $gte: '2020-08-15 00:00:00.000Z' })
                    })
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.count(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should return number of Event entries from EventService that matches search and date parameter', async function () {
            expectedResult = 1;

            let req = { query: { search_string: 'search_string', date: '2020-08-15 00:00:00.000Z' } }
            let res = {};
            let next = sinon.spy();

            let desc;
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

            await EventMiddleware.count(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });
    });

    describe('getEvent', function () {
        var expectedResult;

        it('should get one Event that matches the specified _id from EventService', async function () {
            expectedResult = EventFixture.events[0];

            let req = { params: { id: expectedResult._id } }
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('findOne')
                .withArgs({ _id: mongoose.Types.ObjectId(expectedResult._id) })
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.getEvent(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });
    });

    describe('getEvents', function () {
        var expectedResult;

        it('should get the three first events when no parameters are given from EventService', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            let req = { query: {} };
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('find')
                .withArgs({ status: 'Active' })
                .chain('sort').withArgs({})
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.getEvents(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should get three events from index 3 from EventService when query.position = 3 is passed in req', async function () {
            expectedResult = [EventFixture.events[3], EventFixture.events[4]];

            let req = { query: { position: 3 } };
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('find')
                .withArgs({ status: 'Active' })
                .chain('sort').withArgs({})
                .chain('skip').withArgs(3)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.getEvents(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should get list sorted by date ascending from EventService when query.date is given in req', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            let req = { query: { date: '2020-08-15 00:00:00.000Z' } };
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('find')
                .withArgs({ status: 'Active', date: { $gte: "2020-08-15 00:00:00.000Z" } })
                .chain('sort').withArgs({ date: 'asc' })
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.getEvents(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should get list sorted by date ascending from EventService when query.date and query.descending=\'true\' is given in req', async function () {
            expectedResult = [EventFixture.events[0], EventFixture.events[1], EventFixture.events[2]];

            let req = { query: { date: '2020-08-15 00:00:00.000Z', descending: 'true' } };
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('find')
                .withArgs({ status: 'Active', date: { $lte: "2020-08-15 00:00:00.000Z" } })
                .chain('sort').withArgs({ date: 'desc' })
                .chain('skip').withArgs(NaN)
                .chain('limit')
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.getEvents(req, res, next);

            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        })
    });

    describe('deleteEvent', function () {
        var expectedResult;

        it('should successfully call deleteEvent in EventService and get a response about the updated document', async function () {
            expectedResult = { ok: 0, n: 1 };
            let deleteEvent = EventFixture.events[0];

            let req = { params: { id: deleteEvent._id } };
            let res = {};
            let next = sinon.spy();

            EventModelMock.expects('updateOne')
                .withArgs({ _id: mongoose.Types.ObjectId(deleteEvent._id) }, { status: 'Inactive' })
                .chain('exec')
                .resolves(expectedResult);

            await EventMiddleware.deleteEvent(req, res, next);
            
            EventModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });
    });
})