const chai = require("chai")
const chaiHttp = require("chai-http")
const randomString = require('random-string');
const server = require("../index")
const { containOnlyWantedKeys } = require("../utils/object")

chai.use(chaiHttp)
chai.should()

const testData = {
    firstname: "abc",
    lastname: "def",
    email: "ghi@gmail.com",
    password: "somepassword"
}


describe("Test user API",() =>{
    describe("Test sign up", () => {
        it("Case no data provided", () => {
            return chai.request(server).post("/v1/signup/").then((res) => {
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
    
        describe("Valid email", () => {
            it("Not enough data provided", () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: undefined,
                    lastname: "",
                    password: ""
                }).then((res) => {
                    const expectedKeys = ["firstname", "lastname", "password"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 3
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
            it("Invalid data provided", () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    password: "2345",
                    abc: "><><"
                }).then((res) => {
                    const expectedKeys = ["password"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
    
            it("Not enough and invalid data provided", () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: "",
                    lastname:  randomString({length: 135}),
                    password: "2345",
                    abc: "><><"
                }).then((res) => {
                    const expectedKeys = ["firstname", "lastname", "password"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 3
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
        
            it("Valid and enough data provided", () => {
                return chai.request(server).post("/v1/signup/")
                .send({
                    ...testData,
                    abc: "><><"
                }).then((res) => {
                    const expectedKeys = ["firstname", "lastname", "email"]
                    res.should.have.status(201)
                    res.body.should.be.a("object")
                    res.body.should.have.property("data")
                    res.body.data.should.be.a("object")
                    res.body.data.should.satisfy((messages) => {
                        return Object.keys(messages).length === 3
                    })
                    res.body.data.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
    
            it("Not unique email", () => {
                return chai.request(server).post("/v1/signup/")
                .send({
                    ...testData,
                    abc: "><><"
                }).then((res) => {
                    const expectedKeys = ["email"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
    
            it("Valid and enough data provided 2", () => {
                return chai.request(server).post("/v1/signup/")
                .send({
                    ...testData,
                    email: "abc@gmail.co.th",
                    abc: "><><"
                }).then((res) => {
                    const expectedKeys = ["firstname", "lastname", "email"]
                    res.should.have.status(201)
                    res.body.should.be.a("object")
                    res.body.should.have.property("data")
                    res.body.data.should.be.a("object")
                    res.body.data.should.satisfy((messages) => {
                        return Object.keys(messages).length === 3
                    })
                    res.body.data.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
        
        })
    
        describe("Invalid email", () => {
            it("Not enough data provided", () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: undefined,
                    lastname: "",
                    email: "acb123.com",
                    password: ""
                }).then((res) => {
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
            it("Invalid data provided", () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: randomString({length: 128}),
                    email: "ooopdoo.123.com",
                    password: "2345",
                    abc: "><><"
                }).then((res) => {
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
    
            it("Not enough and invalid data provided", () => {
               return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: "",
                    lastname: undefined,
                    password: "2345",
                    email: "123456@.com",
                    abc: "><><"
                }).then((res) => {
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
    
            it("Only email is invalid", () => {
            return chai.request(server).post("/v1/signup/").send({
                ...testData,
                email: "123%@000",
                abc: "><><"
            }).then((res) => {
                const expectedKeys = ["email"]
                res.should.have.status(400)
                res.body.should.be.a("object")
                res.body.should.have.property("messages")
                res.body.messages.should.be.a("object")
                res.body.messages.should.satisfy((messages) => {
                    return Object.keys(messages).length === 1
                })
                res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })  
        })
    })
    describe("Test login", () => {
        describe("not enough data provided", () => {
            it("Nothing provided", () => {
                return chai.request(server).post("/v1/login/").then((res) => {
                    const expectedKeys = ["error"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
            it("No password provided", () => {
                return chai.request(server).post("/v1/login/").send({
                    email: testData.email
                }).then((res) => {
                    const expectedKeys = ["error"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
        })

        describe("Enough data provided", () => {
            it("User doesn't exist", () => {
                return chai.request(server).post("/v1/login/").send({
                    email: "abcdef4@"
                }).then((res) => {
                    const expectedKeys = ["error"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
    
            it("User exist but incorrect password", () => {
                return chai.request(server).post("/v1/login/").send({
                    ...testData,
                    password: "1234567"
                }).then((res) => {
                    const expectedKeys = ["error"]
                    res.should.have.status(400)
                    res.body.should.be.a("object")
                    res.body.should.have.property("messages")
                    res.body.messages.should.be.a("object")
                    res.body.messages.should.satisfy((messages) => {
                        return Object.keys(messages).length === 1
                    })
                    res.body.messages.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
            
            it("User exist and correct password", () => {
                return chai.request(server).post("/v1/login/").send({
                    ...testData
                }).then((res) => {
                    const expectedKeys = ["firstname", "lastname", "email", "token"]
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("data")
                    res.body.data.should.be.a("object")
                    res.body.data.should.satisfy((messages) => {
                        return Object.keys(messages).length === 4
                    })
                    res.body.data.should.satisfy((messages) => containOnlyWantedKeys(messages, expectedKeys))
                })
            })
        })
    })
})