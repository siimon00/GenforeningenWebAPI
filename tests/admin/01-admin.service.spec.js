'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-mongoose');

var mongoose = require('mongoose');
var AdminModule = require('../../modules/admin/admin.module')();
var AdminModel = AdminModule.AdminModel;
var AdminService = AdminModule.AdminService;

var Fixtures = require('./fixtures');
var AdminFixture = Fixtures.AdminFixture;
var AdminModelMock;

describe('AdminService', function () {

    beforeEach(function () {
        AdminModelMock = sinon.mock(AdminModel);
    });

    afterEach(function () {
        AdminModelMock.restore();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        return mongoose.connection.close();
    });

    describe('createAdmin', function () {
        var newAdmin, expectedAdmin;

        it('should successfully create new admin', async function () {
            newAdmin = AdminFixture.createAdmin;
            expectedAdmin = newAdmin;

            AdminModelMock.expects('create')
                .withArgs(newAdmin)
                .resolves(expectedAdmin);

            const data = await AdminService.createAdmin(newAdmin);
            AdminModelMock.verify();
            expect(data.username).to.equal(newAdmin.username);
            expect(data.password).to.equal(newAdmin.password);
            expect(data.name).to.equal(newAdmin.name);
        });
    });

    describe('getAll', function () {
        var expectedAdmins;

        it('should successfully get all admins', async function () {
            expectedAdmins = AdminFixture.admins;

            AdminModelMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves(expectedAdmins);

            const data = await AdminService.getAll();
            AdminModelMock.verify();
            expect(data).to.deep.equal(expectedAdmins);
        });
    });

    describe('getAdmin', function () {
        var expectedAdmin;

        it('should successfully get an admin by its\' username', async function () {
            expectedAdmin = AdminFixture.admins[1];

            AdminModelMock.expects('find')
                .withArgs({ username: expectedAdmin.username })
                .chain('exec')
                .resolves(expectedAdmin);

            const data = await AdminService.getAdmin(expectedAdmin.username);
            AdminModelMock.verify();
            expect(data).to.deep.equal(expectedAdmin);
        });
    });

    describe('deleteAdmin', function () {
        var expectedResult, adminToDel;

        it('should successfully delete an admin by its\' id', async function () {
            expectedResult = { ok: 0, n: 1}
            adminToDel = AdminFixture.admins[0];

            AdminModelMock.expects('deleteOne')
                .withArgs({ _id: mongoose.Types.ObjectId(adminToDel._id) })
                .chain('exec')
                .resolves(expectedResult);

            const data = await AdminService.deleteAdmin(adminToDel._id);
            AdminModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });

    describe('login', function () {
        var expectedResult;

        it('should successfully return admin that matches username and password', async function () {
            expectedResult = AdminFixture.admins[0];

            AdminModelMock.expects('findOne')
                .withArgs({ username: expectedResult.username, password: expectedResult.password })
                .chain('exec')
                .resolves(expectedResult);
            
            const data = await AdminService.login(expectedResult);
            AdminModelMock.verify();
            expect(data).to.deep.equal(expectedResult);
        });
    });
});