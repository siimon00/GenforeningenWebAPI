var chai = require('chai');
var expect = chai.expect;

var AdminModule = require('../../modules/admin/admin.module');

describe('AdminModule', function () {

    describe('admin.module file', function () {
        it('should confirm AdminModule function exist', function () {
            expect(AdminModule).to.be.a('function');
        });

        it('should confirm AdminModule function returns an object', function () {
            expect(AdminModule()).to.be.a('object');
        });

        it('should confirm AdminController function exist', function () {
            expect(AdminModule().AdminController).to.be.a('function');
        });

        it('should confirm AdminMiddleware object exist', function () {
            expect(AdminModule().AdminMiddleware).to.be.a('object');
        });

        it('should confirm AdminService object exist', function () {
            expect(AdminModule().AdminService).to.be.a('object');
        });

        it('should confirm AdminModel function exist', function () {
            expect(AdminModule().AdminModel).to.be.a('function');
        });
    });
});