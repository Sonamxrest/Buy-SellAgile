const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const upload = require('../middleware/upload')
const { verifyUser } = require('../middleware/authentication')
const Transaction = require('../models/transaction')
const { Router } = require('express')




route.post('/insert/user',(req,res)=>{
console.log(req.body)
const name = req.body.Name
const usernmae = req.body.Username
const password =req.body.Password
const phone = req.body.PhoneNumber
bcrypt.hash(password,10,(err,data)=>{
const user = new User({
Name:name,
Username:usernmae,
Password:data,
PhoneNumber:phone,
Questions:req.body.Questions
})
user.save().then((data)=>{
res.status(200).json({success:true,message:user._id})
console.log(user)
    }).catch()
})
})



// .populate({


//     path:"Likes.product",
//     populate:{
//     path:"User"
//     }
//     })
route.post('/login',(req,res)=>{
const username = req.body['Username']
const password = req.body['Password']
console.log(req.body)
User.findOne({Username:username}).populate('Friends.user').populate({path:"Likes.product",populate:{path:"User"}}).populate({path:"Likes.product",populate:{path:"Comments.user"}}).then((data)=>{
if(!data){
    console.log('no user found')
res.status(200).json({success:false,message:'no user found'})
}
else{   
   
bcrypt.compare(password,data.Password).then((result)=>{
if(result===false){

    res.status(200).json({success:false,message:"Password did not matched",success:false})
}
else{
    User.findOneAndUpdate({_id:data._id},{
        isOnline:true
     }).then((d)=>{
         const token = jwt.sign({id:data._id},'SecretKey')
         console.log(token, data)
     res.status(200).json({success:true,token:token,user:data})
     })
}



}).catch((err)=>{
    console.log(err)
})
}
}).catch((err)=>{
    console.log(err)
})
})

route.put('/update/profile/:id',upload.single('profile'),(req,res)=>{
console.log(req.file)
User.findByIdAndUpdate({_id:req.params.id},{
    Profile:req.file.filename
}).then((data)=>{
    res.status(200).json({success:true,message:req.file.filename})
})

})

route.put('/update/user',verifyUser,(req,res)=>{
    console.log("Update")
    console.log(req.body)
    const name = req.body.Name
    const username = req.body.Username
    const phone = req.body.PhoneNumber
User.findByIdAndUpdate({_id:req.user._id},{
    Name:name,
    Username:username,
    PhoneNumber:phone
}).then((data)=>{
    res.status(200).json({success:true,message:"Done"})
})

})


//.populate({
//
//
// //                                             path:"Likes.product",
//                                             populate:{
//                                             path:"User"
//                                             }
//                                             })

route.get('/user/:number',(req,res)=>{
User.findOne({PhoneNumber:req.params.number}).populate('Friends.user').populate({path:"Likes.product",populate:{path:"User"}}).populate({path:"Likes.product",populate:{path:"Comments.user"}}).then((data)=>{
    console.log(data)
if(data)
{
res.status(200).json({success:true,user:data,token:""})

}
else{
res.status(200).json({success:false,user:data,token:""})
}

})
})

route.put('/logout',verifyUser,(req,res)=>{
User.findOneAndUpdate({_id:req.user._id},{
    isOnline:false
}).then((data)=>{
    res.status(200).json({success:true,message:"Logged Out"})
})
})



route.get('/showFriends',verifyUser,(req,res)=>{
User.findOne({_id:req.user._id}).populate('Friends.user').populate({path:"Likes.product",populate:{path:"User"}}).populate({path:"Likes.product",populate:{path:"Comments.user"}}).then((data)=>{
console.log(data)
res.status(200).json({success:true,data:data})
})



})

route.get('/all',(req,res)=>{
    User.find().then((data)=>{  
        return res.status(200).json({success:true,data:data})
    })
})


route.put("/changePassword/:id",(req,res)=>{

    var newPassword = req.body.np
    User.findById({_id:req.params.id}).then((data)=>{

bcrypt.hash(newPassword,10).then((hash)=>{
    User.findOneAndUpdate({_id:req.params.id},{
Password:hash
    }).then((finalResult)=>{
        res.status(200).json({success:true,message:"Password Updated"})
    })
})
}).catch((err)=>{

    })
})


route.get("/wishList",verifyUser,(req,res)=>{
User.findById({_id:req.user._id}).populate('Friends.user').populate({path:"Likes.product",populate:{path:"User"}}).populate({path:"Likes.product",populate:{path:"Comments.user"}}).then((data)=>{
    return res.status(200).json({success:true,user:data,token:""})
})

})

route.get('/users/:id',(req,res)=>{
    console.log(req.params.id)
    User.findById({_id:req.params.id}).populate('Friends.user').populate({path:"Likes.product",populate:{path:"User"}}).populate({path:"Likes.product",populate:{path:"Comments.user"}}).then((data)=>{
        console.log(data)
        return res.status(200).json({success:true,user:data,token:""})

    })
})

route.put('/rate/:id',verifyUser,(req,res)=>{
    console.log(req.body.Rating)
    User.findOne({_id:req.params.id,'Rating.user':req.user._id}).then((data)=>{
        if(data)
    {
        console.log(data)
        User.update({'Rating.user':req.user._id},{
            
                $set:{'Rating.$.rating':parseInt(req.body.Rating),'Rating.$.user':req.user._id}
            
                }).then((datas)=>{
                    return res.status(200).json({success:true,message:"Done"})
                }) 

    }
    else{
        User.findByIdAndUpdate({_id:req.params.id},{
            $push:{Rating:{user:req.user._id,rating:parseInt(req.body.Rating)}}
                }).then((data)=>{
                    return res.status(200).json({success:true,message:"data xaina"})
                })   
    }
        

    })
    
                
})  

route.put("/pay/:id", verifyUser,async(req,res)=>{
    console.log("Pay")
    const transaction = req.body.amount;
    const desc = req.body.desc;
    const reciever = await User.findById({_id:req.params.id})
    const sender = await User.findById({_id: req.user._id})
    User.findOneAndUpdate({_id:reciever._id},{
        Cash : (reciever.Cash + parseInt(transaction))
    }).then((dre)=>{
        User.findOneAndUpdate({_id:sender._id},{
            Cash : (reciever.Cash - parseInt(transaction))
        }).then((dd) =>{
            const tran = Transaction({ Sender: sender._id, Reciever: reciever._id, Amount: parseInt(transaction), Description: desc,Product:req.body.product})
            tran.save().then((resss) =>{
                return res.status(200).json({success:true,message:"Dami"})
            })
        })
    })
})
route.get("/transaction", verifyUser,(req,res)=>{
     Transaction.find({$or:[{'Sender':req.user._id},{'Reciever':req.user._id}]}).populate('Sender').populate('Reciever').populate('Product').then((data)=>{
         console.log(data)
         return res.status(200).json({success:true, data:data})
     })

})

module.exports = route