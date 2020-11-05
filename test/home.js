const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")

chai.use(chaiHttp)
chai.should()
describe("Test home page", () => {
    it("GET /", async () => {
        return chai.request(server)
            .get("/")
            .then((res) => {
                res.should.have.status(200)
                res.body.should.be.a("object")
                res.body.should.have.property("messages")
                res.body.messages.should.be.a("string")
                res.body.messages.should.satisfy((messages) => {
                    return messages.trim().length > 0
                })
            })
    })
})