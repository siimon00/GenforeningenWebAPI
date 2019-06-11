var chai = require('chai');
var expect = chai.expect;

var ReviewEventModule = require('../../modules/review_event/review_event.module');

describe('ReviewEventModule', function () {

    describe('review_event.module file', function () {
        it('should confirm ReviewEventModule function exist', function () {
            expect(ReviewEventModule).to.be.a('function');
        });

        it('should confirm ReviewEventModule function returns an object', function () {
            expect(ReviewEventModule()).to.be.a('object');
        });

        it('should confirm ReviewEventController function exist', function () {
            expect(ReviewEventModule().ReviewEventController).to.be.a('function');
        });

        it('should confirm ReviewEventMiddleware object exist', function () {
            expect(ReviewEventModule().ReviewEventMiddleware).to.be.a('object');
        });

        it('should confirm ReviewEventService object exist', function () {
            expect(ReviewEventModule().ReviewEventService).to.be.a('object');
        });

        it('should confirm ReviewEventModel function exist', function () {
            expect(ReviewEventModule().ReviewEventModel).to.be.a('function');
        });
    });
});