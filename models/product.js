const mongoose = require('mongoose')

const product = mongoose.model('Product',{
    User:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User"
    },
Name:{
    type:String,
    require:true
},
createdAt:{
    type:String,
    default:Date.now()
},
Category:{
    type:String,
    enum:['Electronics','AutoMobiles','Furniture','Musical','Real State']
},
SubCategory:{
type:String,
enuma:["Mobile","Computer & Peripherals", "Gadgets","Bike","Car","Scooter","Sofa","Bed","Table","Chair","CupBoard","House","Land","Office"]
},
Price:{
    type:String,
    default:"0"
},
Negotiable:{
    type:Boolean,
    default:false
},
SoldOut:{
    type:Boolean,
    default:false
},
UsedFor:{
    type:Number,
    default:0
},
Condition:{
    type:String,
    enum:["Brand New","Like New","Used"],
    default:"Used"
},
Description:{
    type:String
},

Images:[{
    type:String
}],
Likes:[
    {

        user:{
            type:String,
            
        },
        

    }
],

Features:[
    {
name:{
type:String
},
feature:{
    type:String
}

    }
],
Comments:[{
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
comment:{
    type:String
}

}]

})
module.exports =product