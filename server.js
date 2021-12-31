const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Node IDs 
let connectionTable = {
  controlPanel: {
    online: false,
    id: null,
  },
  iPad0: {
    online: false,
    id: null,
  },
  iPad1: {
    online: false,
    id: null,
  },
  iPad2: {
    online: false,
    id: null,
  },
  iPad3: {
    online: false,
    id: null,
  },
  iPad4: {
    online: false,
    id: null,
  },
  iPad5: {
    online: false,
    id: null,
  },
  iPad6: {
    online: false,
    id: null,
  },
  iPad7: {
    online: false,
    id: null,
  },
  iPhone0: {
    online: false,
    id: null,
  },
  iPhone1: {
    online: false,
    id: null,
  },
};

var connectionMap = Object;

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public' + '/index.html');
});



// When a new connection is detected
io.on('connection', (socket) => {
  // console.log('a user connected:\t' + socket.id);

  // VIDEO CONTROLLERS
  // ---------------------------------------
  socket.on('callPlayVids', () => {
    console.log("Global PLAY/PAUSE called");
    socket.broadcast.emit('playVids', 'blah');
    //TODO: When vids are done, call reset and play again. This is to prevent issues with lagging vids. 
  });

  socket.on('callResetVids', () => { 
    console.log("Global RESET called");
    socket.broadcast.emit('resetVids', 'blah');
  })

  // CONNECTION MANAGERS 
  // ---------------------------------------
  // Control Panel Connects
  socket.on('controlPanelConnected', () => { 
    console.log('Control Panel Connected @ ' + socket.id);
    //Register Control Panel
    connectionMap[socket.id] = 'controlPanel';
    connectionTable.controlPanel.id = socket.id;
    connectionTable.controlPanel.online = true;
    //send Control Panel the connection logs 
    console.log('Sending connectionTable to control panel.');
    socket.emit("connectionReport", connectionTable);
  });

  // Device Connects
  socket.on('deviceConnects', (name) => {
    console.log('Logged on:\t' + name + ' @ ' + socket.id);

    //Register Device
    connectionMap[socket.id] = name;
    connectionTable[name].id = socket.id;
    connectionTable[name].online = true;

    //send Control Panel the connection logs
    if (connectionTable.controlPanel.online) { 
      sendLatestConnections(socket, connectionTable.controlPanel.id, connectionTable);
    }
  });

  // on disconnection of Device, show name
  socket.on('disconnect', () => {
    console.log('Logged Off:\t' + connectionMap[socket.id] + ' @ ' + socket.id);

    //Dereigster Device 
    connectionTable[connectionMap[socket.id]].id = null;
    connectionTable[connectionMap[socket.id]].online = false;
    connectionMap[socket.id] = null;

    //send Control Panel the connection logs 
    if (connectionTable.controlPanel.online) { 
      sendLatestConnections(socket, connectionTable.controlPanel.id, connectionTable);
    }
  });
});

function sendLatestConnections(socket, controlPanelId, connectionTable) {
  socket.to(controlPanelId).emit("connectionReport", connectionTable);
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});