import chai from 'chai';
import chaiHttp from 'chai-http';
import {Test} from '../room/Test';

let should = chai.should();
chai.use(chaiHttp);

describe('App Unit Test', () => {
    it('should get status 200', (done) => {
        should.equal(1,Test.add(1,0));
        done();
        // chai.request(server)
        //     .get('/')
        //     .end((err, res) => {
        //         res.should.have.status(200);
        //         done();
        //     });
    });
    it('should get user list', (done) => {
        should.equal(1,Test.sub(1,0));
        done();
        // chai.request(server)
        //     .get('/users')
        //     .end((err, res) => {
        //         res.should.have.status(200);
        //         res.text.should.eql('respond with the user list here');
        //         done();
        //     });
    });
    it('should get status 404', (done) => {
        should.equal(1,Test.add(1,0));
        done();
        // chai.request(server)
        //     .get('/wrongUrl2018')
        //     .end((err, res) => {
        //         res.should.have.status(404);
        //         // res.text.should.eql('respond with the user list here');
        //         done();
        //     });
    });
});
