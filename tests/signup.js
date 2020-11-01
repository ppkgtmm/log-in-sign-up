const chai = require("chai")
const chaiHttp = require("chai-http")
const server = require("../index")

chai.use(chaiHttp)
chai.should()

const testData = {
    firstname: "abc",
    lastname: "def",
    email: "ghi@gmail.com",
    password: "somepassword"
}

function containOnlyWantedKeys(object, keyList) {
    if(Object.keys(object).length !== keyList.length){
        return false
    }
    const keys = Object.keys(object).filter(key => !keyList.includes(key))
    return keys.length === 0
}

describe("Test sign up", () => {
    it("Case no data provided", () => {
        chai.request(server).post("/v1/signup/").end((err, res) => {
            const expectedKeys = ["firstname", "lastname", "email", "password"]
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("messages")
            res.body.messages.should.be.a("object")
            res.body.messages.should.satisfy((messages) => {
                return Object.keys(messages).length === 4
            })
            res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
        })
    })

    it("Not enough data provided", () => {
        chai.request(server).post("/v1/signup/").send({
            ...testData,
            firstname: undefined,
            password: ""
        }).end((err, res) => {
            const expectedKeys = ["firstname", "password"]
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("messages")
            res.body.messages.should.be.a("object")
            res.body.messages.should.satisfy((messages) => {
                return Object.keys(messages).length === 2
            })
            res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
        })
    })

    it("Invalid provided", () => {
        chai.request(server).post("/v1/signup/").send({
            ...testData,
            password: "2345",
            email: "123%@000",
            abc: "><><"
        }).end((err, res) => {
            const expectedKeys = ["email", "password"]
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("messages")
            res.body.messages.should.be.a("object")
            res.body.messages.should.satisfy((messages) => {
                return Object.keys(messages).length === 2
            })
            res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
        })
    })

    it("Not enough and invalid provided", () => {
        chai.request(server).post("/v1/signup/").send({
            lastname: undefined,
            firstname: "",
            password: "2345",
            email: "123%@000",
            abc: "><><"
        }).end((err, res) => {
            const expectedKeys = ["firstname", "lastname", "email", "password"]
            res.should.have.status(400)
            res.body.should.be.a("object")
            res.body.should.have.property("messages")
            res.body.messages.should.be.a("object")
            res.body.messages.should.satisfy((messages) => {
                return Object.keys(messages).length === 4
            })
            res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
        })
    })
})