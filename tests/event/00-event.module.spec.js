var chai = require('chai');
var expect = chai.expect;

var EventModule = require('../../modules/event/event.module');

describe('EventModule', function () {

    describe('event.module file', function () {
        it('should confirm EventModule function exist', function () {
            expect(EventModule).to.be.a('function');
        });

        it('should confirm EventModule function returns an object', function () {
            expect(EventModule()).to.be.a('object');
        });

        it('should confirm EventController function exist', function () {
            expect(EventModule().EventController).to.be.a('function');
        });

        it('should confirm EventMiddleware object exist', function () {
            expect(EventModule().EventMiddleware).to.be.a('object');
        });

        it('should confirm EventService object exist', function () {
            expect(EventModule().EventService).to.be.a('object');
        });

        it('should confirm EventModel function exist', function () {
            expect(EventModule().EventModel).to.be.a('function');
        });
    });
});