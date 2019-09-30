var chai = require('chai');
var chaiHttp = require('chai-http');
//var server = require('/app');
var should = chai.should();

chai.use(chaiHttp);

var assert = require('assert'),
  http = require('http');

var cookieserver;

describe('isallpagesworking', function () {
  // it('should return 200', function (done) {
  //   http.get('http://localhost:5000/homepage.html', function (res) {
  //     assert.equal(200, res.statusCode);
  //     done();
  //   });
  // });
  it('homepage', function(done) {
    chai.request('http://localhost:5000')
      .get('/homepage.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('about-us', function(done) {
    chai.request('http://localhost:5000')
      .get('/about-us.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('Login', function(done) {
    chai.request('http://localhost:5000')
      .get('/Login.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('register', function(done) {
    chai.request('http://localhost:5000')
      .get('/register.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('schedule', function(done) {
    chai.request('http://localhost:5000')
      .get('/schedule.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('workout-tip', function(done) {
    chai.request('http://localhost:5000')
      .get('/workout-tip.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('calorieTrack', function(done) {
    chai.request('http://localhost:5000')
      .get('/calorieTrack.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('editprofile', function(done) {
    chai.request('http://localhost:5000')
      .get('/editprofile.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('profile', function(done) {
    chai.request('http://localhost:5000')
      .get('/profile.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('shop', function(done) {
    chai.request('http://localhost:5000')
      .get('/shop.html')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
});

// describe('isLoginWorking', function () {
// //   it('is login working', function(done) {
// //     chai.request('http://localhost:5000')
// //       .get('/login?username=Yoja&password=123')
// //       .end(function(err, res){
// //         console.log(res);
// //         assert.equal(res.redirects[0],'http://localhost:5000/customer.html');
// //         done();
// //       })
// //   });
// // });

describe('isLogoutWorking', function () {
  it('is login working', function(done) {
    chai.request('http://localhost:5000')
      .get('/logout')
      .end(function(err, res){
        assert.equal(res.redirects[0],'http://localhost:5000/');
        done();
      });
  });
  it('is / redirect not working after login', function(done) {
    chai.request('http://localhost:5000')
      .get('/')
      .end(function(err, res){
        assert.equal(res.redirects[0],'http://localhost:5000/homepage.html');
        done();
      });
  });
});

//let cookie = Buffer.from(JSON.stringify({loginUser: "Yoja"})).toString('base64'); // base64 converted value of cookie

describe('logintest', function () {
  it('login to profile', function(done) {
    chai.request('http://localhost:5000')
      .post('/login')
      .send({username: "Yoja", password: "123"})
      .end(function(err,res) {
        //cookieserver = res.header['set-cookie'];
        //console.log(res.request.req.socket._httpMessage);
        //console.log(res.redirects[0]);
        assert.equal(res.redirects[0],'http://localhost:5000/profile.html');
        done();
      })
  });
  // it('sessiontest', function(done) {
  //   chai.request('http://localhost:5000')
  //     .get('/islogined')
  //     //.send({"cookie":{"originalMaxAge":600000,"expires":"2019-07-15T00:16:36.922Z","httpOnly":true,"path":"/"},"loginUser":"ooo","__lastAccess":1563149196923})
  //     //.set('Cookie', ['session=' + cookie + '; '])
  //     //.send({session: {loginUser: "Yoja"}})
  //     .end(function(err, res) {
  //       console.log(res);
  //       done();
  //     })
  // })
});

describe('userprofile', function () {
  it('user_profile_info', function(done) {
    chai.request('http://localhost:5000')
      .post('/user_profile_info')
      .send({username: "Yoja"})
      .end(function(err,res) {
        //console.log(res.body.rows[0]);
        assert.notEqual(res.body.rows[0],undefined);
        done();
      })
  });
  it('user_remaindate', function(done) {
    chai.request('http://localhost:5000')
      .post('/user_remaindate')
      .send({username: "Yoja"})
      .end(function(err,res) {
        //console.log(res.body.rows[0]);
        assert.notEqual(res.body.rows[0],undefined);
        done();
      })
  });
});

describe('admin', function () {
  it('getdatas', function(done) {
    chai.request('http://localhost:5000')
      .get('/getdatas')
      .end(function(err,res) {
        //console.log(res.body.results);
        assert.notEqual(res.body.results, undefined);
        done();
      })
  });
  it('get_by_name', function(done) {
    chai.request('http://localhost:5000')
      .post('/get_by_name')
      .send({username: "Yoja"})
      .end(function(err,res) {
        //console.log(res.body);
        assert.notEqual(res.body.results,undefined);
        done();
      })
  });
});

describe('insert test', function () {
  before('add', function(done) {
    chai.request('http://localhost:5000')
      .post('/add')
      .send({username: "noname", age: 18, gender: "M", weight:180, height: 180, password: "123"})
      .end(function(err,res) {
        done();
      })
  });

  it('get_by_name', function(done) {
    chai.request('http://localhost:5000')
      .post('/get_by_name')
      .send({username: "noname"})
      .end(function(err,res) {
        //console.log(res.body.results);
        assert.notEqual(res.body.results.length,0);
        done();
      })
  });
});

describe('delete test', function () {
  before('delete', function(done) {
    chai.request('http://localhost:5000')
      .post('/delete')
      .send({username: "noname"})
      .end(function(err,res) {
        done();
      })
  });

  it('get_by_name', function(done) {
    chai.request('http://localhost:5000')
      .post('/get_by_name')
      .send({username: "noname"})
      .end(function(err,res) {
        //console.log(res.body.results);
        assert.equal(res.body.results.length,0);
        done();
      })
  });
});


// describe('isSignUpWorking', function() {
// //   it('is login working', function(done) {
// //     chai.request('http://localhost:5000')
// //       .get('/logout')
// //       .end(function(err, res){
// //         assert.equal(res.redirects[0],'http://localhost:5000/');
// //         done();
// //       });
// //   });
// // });