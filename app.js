const express = require('express');
const app = express()
const db= require('./database/db')
const cors = require('cors')
const WebSocket = require("ws")
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoutes')
const productRoute = require("./routes/productRoutes")
var request = require('./routes/requestRoutes')
var message = require('./routes/messageRoutes')
const http = require('http').createServer(app)
 const wss = new WebSocket.Server({server:http})
app.use(bodyParser.urlencoded({extended:false}))
app.use(require('express').json())

app.use(userRoute)
app.use(productRoute)
app.use(message)
app.use(request)

app.use('/uploads',require('express').static(__dirname +"/uploads"))
let client=0
let client2=0
var newM={}
const { Server } = require("socket.io");
const io = new Server(http);

  
io.on('connection', (socket) => {
client++
console.log(client)
  console.log('a user connected');

socket.on('message',(data)=>{
  io.emit('message',data)
})
socket.on('recieved',(data)=>{
  io.emit('recieved',data)
})
socket.on('calling',(data)=>{
  io.emit('calling',data)
})
//notify on request send
socket.on('request',(data)=>{
  console.log(data)
})
});

io.on('disconnect',(data)=>{
  client--
console.log(client)
})




app.get('/',(req,res)=>{
    res.sendfile('index.html');
})




http.listen(5000,()=>{
    console.log("Port has started on 5000")
})

