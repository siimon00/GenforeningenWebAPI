'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-mongoose');

var mongoose = require('mongoose');
var AdminModule = require('../../modules/admin/admin.module')();
var AdminModel = AdminModule.AdminModel;
var AdminMiddleware = AdminModule.AdminMiddleware;

var Fixtures = require('./fixtures');
var AdminFixture = Fixtures.AdminFixture;
var AdminModelMock;

// myAsyncFunction only for testing stuff
function myAsyncFunction(callback) {
    // 50ms delay before callback
    setTimeout(function () {
        callback('hello');
    }, 100);
}

describe('AdminMiddleware', function () {

    beforeEach(function () {
        AdminModelMock = sinon.mock(AdminModel);
    });

    afterEach(function () {
        AdminModelMock.restore();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        return mongoose.connection.close();
    });

    describe('getAll', function () {
        var expectedResult;

        it('should successfully retrieve list of admins from AdminService', function () {
            expectedResult = AdminFixture.admins;
            let req = {};
            let res = {};
            let next = sinon.spy(() => {
                // this doesn't work when test is failing
                // cannot have assertions throw in callback from middleware - don't know solution
                AdminModelMock.verify();
                expect(next.firstCall.args[0]).to.equal(undefined);
                expect(req.response).to.not.equal(undefined);
                expect(req.response).to.deep.equal(expectedResult);

            });

            /*myAsyncFunction(function (data) { // callback  
                //this works when test is failing     
                console.log('in callback');
                expect(data).to.equal('hello');
                expect(2).to.not.equal(2);
                done();
            });*/

            AdminModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves(expectedResult);

            AdminMiddleware.getAll(req, res, next);
        });
    });

    describe('createAdmin', function () {
        var expectedResult;

        it('should create admin successfully', function () {
            expectedResult = AdminFixture.createAdmin;

            var req = { body: expectedResult };
            var res = {};
            var next = sinon.spy((err) => {
                // have to test like this because we have multiple promises in middleware 
                // so we cannot await the function     
                AdminModelMock.verify();
                expect(next.firstCall.args[0]).to.equal(undefined);
                expect(req.response).to.not.equal(undefined);
                expect(req.response).to.deep.equal(expectedResult);
            });

            AdminModelMock.expects('find')
                .withArgs({ username: expectedResult.username })
                .chain('exec')
                .resolves([]);
            AdminModelMock.expects('create')
                .withArgs(expectedResult)
                .resolves(expectedResult);

            AdminMiddleware.createAdmin(req, res, next);
        });

        it('should make req.response = \'username_exists\' when requested username exists', async function () {
            expectedResult = 'username_exists';
            let createAdmin = AdminFixture.createAdmin;

            let req = { body: createAdmin };
            let res = {};
            let next = sinon.spy();

            AdminModelMock.expects('find').withArgs({ username: createAdmin.username })
                .chain('exec')
                .resolves(createAdmin);

            await AdminMiddleware.createAdmin(req, res, next);

            AdminModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.not.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });
    });

    describe('deleteAdmin', function () {
        var expectedResult;

        it('should successfully delete an admin if it exists and there is more than one', function () {
            expectedResult = { ok: 0, n: 1 };
            let deleteAdmin = AdminFixture.admins[0];

            let req = { query: deleteAdmin };
            let res = {};
            let next = sinon.spy(() => {
                // have to test like this because we have multiple promises in middleware 
                // so we cannot await the function            
                AdminModelMock.verify();
                expect(next.firstCall.args[0]).to.equal(undefined);
                expect(req.response).to.not.equal(undefined);
                expect(req.response).to.deep.equal(expectedResult);
            });

            AdminModelMock.expects('find')
                .withArgs({ username: deleteAdmin.username })
                .chain('exec')
                .resolves([deleteAdmin]);

            AdminModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves(AdminFixture.admins);

            AdminModelMock.expects('deleteOne')
                .withArgs({ _id: mongoose.Types.ObjectId(deleteAdmin._id) })
                .chain('exec')
                .resolves({ ok: 0, n: 1 });

            AdminMiddleware.deleteAdmin(req, res, next);
        });

        it('should make req.response = \'not_found\' if the requested admin to delete doesn\'t exists', async function () {
            expectedResult = 'not_found';

            let req = { query: { username: 'non_existing_username' } };
            let res = {};
            let next = sinon.spy();

            AdminModelMock.expects('find')
                .withArgs({ username: req.query.username })
                .chain('exec')
                .resolves([]);

            await AdminMiddleware.deleteAdmin(req, res, next);
            AdminModelMock.verify();
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.not.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });

        it('should make req.response = \'not_allowed\' if the requested admin is the last entry left', async function () {
            expectedResult = 'not_allowed';
            var deleteAdmin = AdminFixture.admins[0];

            let req = { query: { deleteAdmin } };
            let res = {};
            let next = sinon.spy(() => {
                // have to test like this because we have multiple promises in middleware 
                // so we cannot await the function                              
                AdminModelMock.verify();
                expect(next.firstCall.args[0]).to.equal(undefined);
                expect(req.response).to.not.equal(undefined);
                expect(req.response).to.deep.equal(expectedResult);
            });

            AdminModelMock.expects('find')
                .withArgs({ username: req.query.username })
                .chain('exec')
                .resolves([deleteAdmin]);

            AdminModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves([deleteAdmin]);

            AdminMiddleware.deleteAdmin(req, res, next);
        });
    });

    describe('login', function () {
        var expectedResult;

        it('should make res.response = admin where admin is the matching admin of the username and password', async function () {
            expectedResult = AdminFixture.admins[1];

            let req = { body: expectedResult };
            let res = {};
            let next = sinon.spy();

            AdminModelMock.expects('findOne')
                .withArgs({ username: expectedResult.username, password: expectedResult.password })
                .chain('exec')
                .resolves(expectedResult);

            await AdminMiddleware.login(req, res, next);

            AdminModelMock.verify();
            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(undefined);
            expect(req.response).to.not.equal(undefined);
            expect(req.response).to.deep.equal(expectedResult);
        });
    });

});