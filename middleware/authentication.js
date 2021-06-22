const jwt = require('jsonwebtoken')
const User = require('../models/user')



module.exports.verifyUser =(req,res,next)=>{

try{
    const rawToken = req.headers.authorization.split(" ")[1]
    const data = jwt.verify(rawToken,"SecretKey")
    User.findById({_id:data.id}).then((r)=>{
        req.user =r
        console.log(r)
        next()
    })
}
catch{

}
  
}


