const express = require('express')
const route = express.Router()
const upload = require('../middleware/upload')
const {verifyUser} = require('../middleware/authentication')
const Product = require('../models/product')
const User = require("../models/user")
const {check,validationResult} = require('express-validator') 



route.post('/post',verifyUser,(req,res)=>{
    console.log(req.body)
const error = validationResult(req)
if(error.isEmpty()){
    const name = req.body.Name
    const category = req.body.Category
    const price = parseInt(req.body.Price)
    const description = req.body.Description
    const user = req.user._id
 const usedFor = parseInt(req.body.UsedFor)
 const negotiable = req.body.Negotiable
 const product = new Product({
 
 Name:name,
 Category:category,
 Price:price,
 Description:description,
 User:user,
 SubCategory:req.body.SubCategory,
 UsedFor:usedFor,
 Condition:req.body.Condition,
 Negotiable:negotiable
 
    })
    product.save().then((data)=>{
     
       return res.status(200).json({success:true,message:product._id})
 
    }).catch((error)=>{
 
        console.log(error)
 return res.status(200).json({success:false,message:error})
 
    })
}
else{
    return res.status(200).json({ success:false,message:" "})

}
  
   


})


route.put('/update/product/:id',(req,res)=>{

    const name = req.body.Name
    const category = req.body.Category
    const price = parseInt(req.body.Price)
    const description = req.body.Description
    const negotiable = req.body.Negotiable
    Product.findByIdAndUpdate({_id:req.params.id},{
        Name:name,
        Category:category,
        Price:price,
        Description:description,
        Features:req.body.Features,
        Condition:req.body.Condition,
        Negotiable:negotiable
    }).then((result)=>{
        return res.status(200).json({success:true,message:"Done"})
    })

   


})


//route.put('/post/upload/:id',upload.single('image'),(req,res)=>{
//console.log(req.file)
//
//Product.findByIdAndUpdate({_id:req.params.id},{
//    Images:req.file.filename
//}).then((data)=>{
//    res.status(200).json({success:true,message:"Done"})
//})
//})

 route.put('/post/upload/:id',upload.fields([{name:'image'}]),(req,res)=>{
 let newData =[]
 console.log(req.files)
 req.files.image.forEach(data => {
  newData.push(data.filename)
 })
     Product.findByIdAndUpdate({_id:req.params.id},{
        Images:newData
         }).then((data)=>{
     return res.status(200).json({success:true,message:"Image Updated"})

 }).catch((er)=>{
     console.log(er)
 return res.status(400).json({success:false,message:"Something went wrong"})
 })


 })

route.put('/like/:id',verifyUser,async(req,res)=>{

let flag =false
    Product.findOne({_id:req.params.id}).then((data)=>{
     
        flag = data.Likes.includes(req.user._id)
        console.log(flag)
        
     
if(flag)
{
    console.log("UnLiked")
    Product.findByIdAndUpdate({_id:req.params.id},{
        $pull:{Likes:req.user._id}
        }).then((data)=>{
        User.findByIdAndUpdate({_id:req.user._id},{
        $pull:{Likes:{product:req.params.id}}
        }).then((data)=>{
                    return res.status(200).json({success:false,message:"UnLiked"})
        })
        })
}
else if(flag===false) {
    console.log("Liked")
    Product.findByIdAndUpdate({_id:req.params.id},{
        $push:{Likes:req.user._id}
        }).then((data)=>{
        User.findByIdAndUpdate({_id:req.user._id},{
        $push:{Likes:{product:req.params.id}}
        }).then((data)=>{
            return res.status(200).json({success:true,message:"Liked"})
        })
        })
}

})

})

route.put('/comment',verifyUser,(req,res)=>{
const message= req.body.comment
console.log(message)
Product.findByIdAndUpdate({_id:req.body._id},{
    $push:{Comments:{user:req.user._id,comment:message}}
}).then((data)=>{
    return res.status(200).json({success:true,message:"One Comment Added"})
})


})
route.get('/get/product',(req,res)=>{
    Product.find().populate('User').populate('Comments.user').then((data)=>{
        
        return res.status(200).json({success:true,data:data})
    })
})

route.get('/person/post/:id',(req,res)=>{
    console.log("peroson post")
Product.find({User:req.params.id}).populate('User').populate('Comments.user').then((data)=>{

    return res.status(200).json({success:true,data:data})
}).catch((err)=>{
    res.status(400).json({success:false,message:"Something went wrong"})
})




})

route.delete('/delete/:id',(req,res)=>{
    console.log("delete")
    Product.findByIdAndDelete({_id:req.params.id}).then((re)=>{
        return res.status(200).json({success:true,message:"Deleted"})
    })
})
route.put('/sold/:id',(req,res)=>{
    Product.findOneAndUpdate({_id:req.params.id},{
SoldOut:true
    }).then((re)=>{
        return res.status(200).json({success:true,message:"Deleted"})
    })
})


route.get('/search/:name',(req,res)=>{

Product.find({Name:{$regex:req.params.name,$options:'$i'}}).then((data)=>{
    return res.status(200).json({success:true,data:data})
})

})
route.get('/category/:category',(req,res)=>{

    Product.find({Category:req.params.category}).then((data)=>{
        return res.status(200).json({success:true,data:data})
    })
    

})

route.put("/deleteComment/:pid/:oid",(req,res)=>{

    Product.findByIdAndUpdate({_id:req.params.pid},{
        $pull:{Comments:{_id:req.params.oid}}
            }).then((data)=>{
                return res.status(200).json({success:true,message:"Done"})
        
            })


})
route.put("/updateComment/:pid/:oid",verifyUser,(req,res)=>{

    Product.update({'Comments._id':req.params.oid},{
        $set:{'Comments.$._id':req.params.oid,'Comments.$.user':req.user._id,'Comments.$.comment':req.body.comment}
            }).then((data)=>{
                return res.status(200).json({success:true,message:"Done"})
        
            })


})

module.exports = route