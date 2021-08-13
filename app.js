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
const wss = new WebSocket.Server({ server:http });

app.use(bodyParser.urlencoded({extended:false}))
app.use(require('express').json())

app.use(userRoute)
app.use(productRoute)
app.use(message)
app.use(request)

app.use('/uploads',require('express').static(__dirname +"/uploads"))
let client=0

var newM={}
const { Server } = require("socket.io");
const io = new Server(http);

  
io.on('connection', (socket) => {
client++
console.log('socket client', client)
  console.log('a user connected');

socket.on('recieved',(data)=>{
  io.emit('recieved',data)
})
socket.on('calling',(data)=>{
  console.log(data)
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




//chat 
var clients =0
var newM={}
wss.on('connection', function connection(ws) {

clients++
console.log(clients)

  ws.on('message', function incoming(message) {
    console.log(message)
//      newM = JSON.parse(message)
//      console.log(newM) 
    wss.broadcast(message)
// newM={}
   
 
     });

     ws.on('close',(daat)=>{
      clients--
      console.log(client)
       console.log("disconnected")
     })


  
})






wss.broadcast = function broadcast(msg) {
   
  wss.clients.forEach(function each(client) {
        client.send(msg);
       
     });
 };



app.get('/',(req,res)=>{
    res.sendfile('index.html');
})




http.listen(5000,()=>{
    console.log("Port has started on 5000")
})

