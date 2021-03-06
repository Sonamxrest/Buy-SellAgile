const mongoose = require('mongoose');


const url = 'mongodb://127.0.0.1:27017/BuySell';
const Product = require('../models/product');

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

describe("Product Testing",()=>{
    it("Product Addition",()=>{
        const productObj = {
            User:"60e7f56a2436f346c8de89d6",
        Name:"Jacket",
        createdAt:"2021-01-01",
        Category:"Electronics",
        SubCategory:"Gadgets",
        Price:1200,
       
        Description:"Good Product!!",
        
        Images:["img.jpg"],
        Likes:[
           {"user":"Nima"}
        ],
        
        Features:[
            {
        name:"Brilliant",
        feature:"Nice One"
        
            }
        ],
        Comments:[{
        user:"60e7f56a2436f346c8de89d6",
        comment:"Hello World"
        
        }]
        }

       return  Product.create(productObj)
        .then((data)=>{
            expect(data.Name).toEqual("Jacket")
        })
    })
    it("Delete Product",async()=>{
        let products = await Product.find({})
        let status = await Product.deleteOne({"_id":products[0]._id})
        expect(status.ok).toBe(1)
    })

    it("Update Product",async()=>{
        let products = await Product.find({})
        let updateData = {
            "Name":"Kattu"
        }

        let status = await Product.updateOne({"_id":products[0]._id},{
            $set:updateData
        })

        expect(status.ok).toBe(1)

    })


    
})