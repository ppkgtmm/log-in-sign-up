const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")

chai.use(chaiHttp)
chai.should()

describe("Test not found 404", () => {
    it("test wrong method", () => {
        return chai.request(server).post("/").send({
            abcd: "123"
        }).then((res) => {
            res.should.have.status(404)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
        })
    })

    it("test wrong method v1", () => {
        return chai.request(server).delete("/v1/signup").send({
            abcd: "123"
        }).then((res) => {
            res.should.have.status(404)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
        })
    })

    it("test wrong endpoint", () => {
        return chai.request(server).get("/v2").then((res) => {
            res.should.have.status(404)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
        })
    })

    it("test wrong endpoint v1", () => {
        return chai.request(server).post("/v1/signin").send({
            abcd: "123"
        }).then((res) => {
            res.should.have.status(404)
            res.body.should.be.a("object")
            res.body.should.have.property("error")
        })
    })
})