var express = require('express')
var cors = require('cors')
var app = express()

let current = 0

app.use(cors({ origin: 'http://localhost:3000' }))

const server = app.listen(8000, console.log("Waiting for receiver at http://localhost:8000/"));

const io = require('socket.io')(server, {cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const appID = '1234'
const nodeID = '666'


io.on('connection', async (socket) => {
    console.log('connected!');
    socket.on('message-from-client-to-server', (msg) => {
        console.log('received!');
        console.log(msg);
    })

    socket.on('message-from-failover-to-server', (msg) => {
        console.log('received!');
        console.log(msg);

        if (msg === 'TakenOver') {
            process.exit(0)
        }
    })


    setInterval(() => {
            socket.emit('message-from-server-to-failover', current);
    }, 25)

    setInterval(() => {
        socket.emit('message-from-server-to-client', {
            count: current,
            appID, 
            nodeID
        });
    }, 1000)
})

setInterval(() => { current ++ }, 1000)