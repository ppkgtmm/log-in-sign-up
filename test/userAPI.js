const chai = require("chai")
const chaiHttp = require("chai-http")
const randomString = require("random-string")
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

function responseTester(res, expected){
    res.should.have.status(expected.status)
    res.body.should.be.a("object")
}
function responseDataTester(res, expected) {
    res.body.should.have.property(expected.field)
    res.body[expected.field].should.be.a("object")
    res.body[expected.field].should.satisfy((items) => {
        return Object.keys(items).length === expected.keys.length
    })
    res.body[expected.field].should.satisfy((items) => containOnlyWantedKeys(items, expected.keys))
}


describe("Test user API",() =>{
    describe("Test sign up", () => {
        it("Case no data provided", async () => {
            return chai.request(server).post("/v1/signup/").then((res) => {
                const keys = ["firstname", "lastname", "email", "password"]
                responseTester(res, { status: 400 })
                responseDataTester(res, { field: "messages",  keys })
            })
        })
    
        describe("Valid email", () => {
            it("Not enough data provided", async () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: undefined,
                    lastname: "",
                    password: ""
                }).then((res) => {
                    const keys = ["firstname", "lastname", "password"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
            it("Invalid data provided", async () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    password: "2345",
                    abc: "><><"
                }).then((res) => {
                    const keys = ["password"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
    
            it("Not enough and invalid data provided", async () => {
                return chai.request(server).post("/v1/signup/").send({
                    ...testData,
                    firstname: "",
                    lastname:  randomString({length: 135}),
                    password: "2345",
                    abc: "><><"
                }).then((res) => {
                    const keys = ["firstname", "lastname", "password"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
        
            it("Valid and enough data provided", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["firstname", "lastname", "email"]
                        responseTester(res, { status: 201 })
                        responseDataTester(res, { field: "data",  keys })
                    })
            })
    
            it("Not unique email", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["email"]
                        responseTester(res, { status: 400 })
                        responseDataTester(res, { field: "messages",  keys })
                    })
            })
    
            it("Valid and enough data provided 2", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        email: "abc@gmail.co.th",
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["firstname", "lastname", "email"]
                        responseTester(res, { status: 201 })
                        responseDataTester(res, { field: "data",  keys })
                    })
            })
        
        })
    
        describe("Invalid email", () => {
            it("Not enough data provided", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        firstname: undefined,
                        lastname: "",
                        email: "acb123.com",
                        password: ""
                    }).then((res) => {
                        const keys = ["firstname", "lastname", "email", "password"]
                        responseTester(res, { status: 400 })
                        responseDataTester(res, { field: "messages",  keys })
                    })
            })
            it("Invalid data provided", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        firstname: randomString({length: 128}),
                        email: "ooopdoo.123.com",
                        password: "2345",
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["email", "password"]
                        responseTester(res, { status: 400 })
                        responseDataTester(res, { field: "messages",  keys })
                    })
            })
    
            it("Not enough and invalid data provided", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        firstname: "",
                        lastname: undefined,
                        password: "2345",
                        email: "123456@.com",
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["firstname", "lastname", "email", "password"]
                        responseTester(res, { status: 400 })
                        responseDataTester(res, { field: "messages",  keys })
                    })
            })
    
            it("Only email is invalid", async () => {
                return chai.request(server).post("/v1/signup/")
                    .send({
                        ...testData,
                        email: "123%@000",
                        abc: "><><"
                    }).then((res) => {
                        const keys = ["email"]
                        responseTester(res, { status: 400 })
                        responseDataTester(res, { field: "messages",  keys })
                    })
            })  
        })
    })
    describe("Test login", () => {
        describe("not enough data provided", () => {
            it("Nothing provided", async () => {
                return chai.request(server).post("/v1/login/").then((res) => {
                    const keys = ["error"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
            it("No password provided", async () => {
                return chai.request(server).post("/v1/login/").send({
                    email: testData.email
                }).then((res) => {
                    const keys = ["error"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
        })

        describe("Enough data provided", () => {
            it("User doesn't exist", async () => {
                return chai.request(server).post("/v1/login/").send({
                    email: "abcdef4@"
                }).then((res) => {
                    const keys = ["error"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })
                })
            })
    
            it("User exist but incorrect password", async () => {
                return chai.request(server).post("/v1/login/").send({
                    ...testData,
                    password: "1234567"
                }).then((res) => {
                    const keys = ["error"]
                    responseTester(res, { status: 400 })
                    responseDataTester(res, { field: "messages",  keys })

                })
            })
            
            it("User exist and correct password", async () => {
                return chai.request(server).post("/v1/login/").send({
                    ...testData
                }).then((res) => {
                    const keys = ["firstname", "lastname", "email", "token"]
                    responseTester(res, { status: 200 })
                    responseDataTester(res, { field: "data",  keys })
                })
            })
        })
    })
})