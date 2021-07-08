const mongoose = require('mongoose');


const url = 'mongodb://127.0.0.1:27017/BuySell';
const User = require('../models/user');
//database sanga connection linxa with mongoose package
beforeAll(async () => {
    await mongoose.connect(url,
        {
            useNewUrlParser: true,
            useCreateIndex: true
        }
    )
})
afterAll(async () => {
    await mongoose.connection.close()
})

describe("UserTesting", () => {
    //User Registration Testing
    it("User Registration", () => {
        const user = 
            {
                "Name": "Nima1",
                "Username": "nima12",
                "Password": "123456",
                "PhoneNumber": "01541582"
            }
        
        return User.create(user)
            .then((result) => { expect(result.Name).toEqual("Nima1") })
    })
   
})