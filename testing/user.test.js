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
                "PhoneNumber": "0154152"
            }
        
        return User.create(user)
            .then((result) => { expect(result.Name).toEqual("Nima") })
    })
    it("User Login",async ()=>{
        let status = await User.findOne({"Username":"nima","Password":"123456"})  
        expect(status.Username).toBe("nima")
   })

   it('Update', async () => {
    const reg = {
        'Username': 'nima1'
    };
    const status = await User.updateOne({ _id: Object('60e7f56a2436f346c8de89d6') },
        { $set: reg });
    expect(status.ok).toBe(1);
});

   
})