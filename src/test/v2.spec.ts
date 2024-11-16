import request from 'supertest';
import { describe, it } from 'mocha';
import {  app } from '../index'; // Ensure this path is correct

let expect: Chai.ExpectStatic;
(async () => {
  const chai = await import('chai');
  expect = chai.expect;
})();
let token: string = "";
let productId = '';



describe('API Tests', () => {
  it('logs in and sets token', function(done) {
    request(app)
      .post('/users/login')
      .send({ email: 'admin@gmail.com', password: 'Admin123' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.betterToken;
        done();
      });
  });
  

  it('adds a product', function(done) {
    request(app)
      .post('/v2/products')
      .set('Authorization', token)
      .send({
        title: "Saint Predator",
        price: 2799,
        description: "A rocket launcher used by Misaki. Upon firing, it separates into a cluster ordinance when it reaches a certain altitude, creating a wide explosion.",
        category: "Rocket Launcher",
        image: "https://static.wikia.nocookie.net/blue-archive/images/b/be/Misaki_UE.png/revision/latest?cb=20220524053355",
        rating: { rate: 5, count: 69420 },
        stock: 1
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        productId = res.body.id;
        done();
      });
  });

  it('gets products without query', function(done) {
    request(app)
      .get('/v2/products')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('gets products with query', function(done) {
    request(app)
      .get('/v2/products')
      .set('Authorization', token)
      .query({ minPrice: 2799, maxPrice: 2800, minStock: 1, maxStock: 1 })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body._id).to.equal(productId);
        let product  = res.body[0];
        productId = product._id;
        done();
      });
  });

  it('edits a product', function(done) {
    request(app)
      .put(`/v2/products/${productId}`)
      .set('Authorization', token)
      .send({
        title: "Scorpius",
        price: 54999,
        description: "A submachine gun used by Atsuko. It has intense firepower for its short barrel, and is especially suited for close-range combat.",
        category: "Assault Rifle",
        image: "https://static.wikia.nocookie.net/blue-archive/images/3/39/Atsuko_UE.png/revision/latest?cb=20220608135451",
        rating: { rate: 5, count: 42069 },
        stock: 1
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).eql('Product edited');
        done();
      });
  });

  it('deletes a product', function(done) {
    request(app)
      .delete(`/v2/products/${productId}`)
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).eql('Product deleted');
        done();
      });
  });
});

