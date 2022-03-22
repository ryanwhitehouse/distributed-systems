var express = require('express')
var cors = require('cors')
var app = express()
var socketIOClient = require('socket.io-client')
const ENDPOINT = "http://localhost:8000";

let localCurrent = 0
let serverCurrent = 0
let lastCall = Date.now()

app.use(cors({ origin: 'http://localhost:3000' }))

const server = app.listen(8001, console.log("Waiting for receiver at http://localhost:8001/"));

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const appID = '1234'
const nodeID = '999'

const socket = socketIOClient(ENDPOINT);

socket.on('message-from-server-to-failover', data => {
    serverCurrent = data
    localCurrent = data

    lastCall = Date.now()
});

socket.on('connection', () => {
    console.log(`I'm connected with the back-end`);

    socket.emit('message-from-failover-to-server', 'I\'m here for you');
});

io.on('connection', async (socket) => {
    console.log('connected')
    socket.on('message-from-client-to-server', (msg) => {
        console.log('received!');
        console.log(msg);
    })

    const myInterval = setInterval(() => {
        if (Date.now() - lastCall > 35) {
            socket.emit('message-from-failover-to-server', 'TakenOver');
            console.log('taken over')
            
            clearInterval(myInterval)
            
            setInterval(() => { 
                socket.emit('message-from-failover-to-client', {
                    count: localCurrent,
                    appID,
                    nodeID
                });
            }, 1000)
        }
    }, 23)  
});

setInterval(() => { localCurrent ++ }, 1000)