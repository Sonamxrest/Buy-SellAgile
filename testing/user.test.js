const mongoose = require('mongoose');


const url = 'mongodb://127.0.0.1:27017/BuySell';
const User = require('../models/user');

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
                "Name": "Nima",
                "Username": "nima",
                "Password": "123456",
                "PhoneNumber": "01541582"
            }
        
        return User.create(user)
            .then((result) => { expect(result.Name).toEqual("Nima") })
    })
    it("User Login",async ()=>{
        let status = await User.findOne({"Username":"nima","Password":"123456"})  
        expect(status.Username).toBe("nima")
   })
   
})