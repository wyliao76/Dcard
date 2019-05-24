let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
const memcached = require('../memcached')

chai.use(chaiHttp)

memcached.del('::ffff:127.0.0.1')
.then(result => {
  console.log(result)
})
.catch(err => {
  console.log(err)
})

for (let i = 1; i < 62; i++) {
  describe('GET /', () => {
    it('respond with 200 but 429 when rate limit exceeded', (done) => {
      chai.request(app)
        .get('/')
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.text)
          console.log(i)
          if (i == 61) {
            res.should.have.status(429)
            return done()
          }
          res.should.have.status(200)
          return done()
        });
      })
    });
  }
