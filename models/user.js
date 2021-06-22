const mongoose = require('mongoose')
const schema = mongoose.Schema({


Name:{
    type:String,
    require:true
},
Username:{
    type:String,
    require:true,
    unique:true
},
Password:{
    type:String,
    require:true,
}
,
PhoneNumber:{
    type:String,
        unique:true

},
Profile:{
    type:String,
    default:"no-image.jpg"
},
isOnline:{
    type:Boolean,
    default:false
},Friends:[{

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
}
}],
Questions:[{
    question:{
        type:String
    },
    answer:{
        type:String
    }
}]
})


const User= mongoose.model('User',schema)
module.exports= User