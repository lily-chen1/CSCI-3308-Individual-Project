// Imports the server.js file to be tested.
let serverImports = require("../server");
//Assertion (Test Driven Development) and Should, Expect(Behaviour driven development) library
let chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { expect } = chai;
var assert = chai.assert;

describe("Server!", () => {
  it("Displays home page", (done) => {
    chai
      .request(serverImports.server)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
        done();
      });
  });
  it("Displays reviews page", (done) => {
    chai
      .request(serverImports.server)
      .get("/reviews")
      .end((err, res) => {
        expect(res).to.have.status(200);
        assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
        done();
      });
  });
  it("POST /addReview creates a new review in the database", (done) => {
    chai
      .request(serverImports.server)
      .post("/addReview")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ meal: "mochaMeal", review: "mochaReview", review_date: Date() })
      .end(async (err, res) => {
        expect(res).to.have.status(200);
        var userQuery = "SELECT * FROM reviews WHERE meal='mochaMeal';";
        var deleteQuery = "DELETE FROM reviews WHERE meal='mochaMeal';";
        await serverImports.db
          .task("check if newly created review exists", (task) => {
            return task.batch([task.any(userQuery), task.any(deleteQuery)]);
          })
          .then((data) => {
            assert.exists(data[0][0].meal, "has the property meal");
            assert.strictEqual(data[0][0].meal, "mochaMeal", "property name is equal to mochaMeal");
            assert.exists(data[0][0].review, "has the property review");
            assert.strictEqual(data[0][0].review, "mochaReview", "property user_name is equal to mochaReview");
            assert.exists(data[0][0].review_date, "has the property email");
            assert.exists(data[0][0].id, "has the property id");
          })
          .catch((err) => {
            console.log("error", err);
          });
        done();
      });
  });
});
