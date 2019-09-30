import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';


chai.use(chaiHttp);
chai.should();

it('should list ALL blobs on /blobs GET', function(done) {
  chai.request(server)
    .get('/homepage.html')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
});
