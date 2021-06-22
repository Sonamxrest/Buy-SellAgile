const express = require('express');
const app = express()
const db= require('./database/db')
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoutes')
const productRoute = require("./routes/productRoutes")
var request = require('./routes/requestRoutes')
var message = require('./routes/messageRoutes')

app.use(bodyParser.urlencoded({extended:false}))
app.use(require('express').json())

app.use(userRoute)
app.use(productRoute)
app.use(message)
app.use(request)
app.use('/uploads',require('express').static(__dirname +"/uploads"))
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let data=0
app.get('/',(req,res)=>{
    res.sendfile('index.html');
})
app.get('/hello',(req,res)=>{
    res.status(200).json({success:true,message:"Retrofit Connected"})
})
io.on('connection',(client)=>{
 data++; 
io.emit("message",{"message":"Hello Muzi"})


    client.on('disconnect',()=>{
data--
console.log(data)

    })
    client.on('message',(data)=>{
        var newMessage = data.message

        console.log(newMessage)    
        })
console.log(data)
})




http.listen(5000,()=>{
    console.log("Port has started on 0000")
})

