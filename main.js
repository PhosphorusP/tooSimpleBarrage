//init server
var app_express = require('express')();
var server = require('http').Server(app_express);
var io = require('socket.io')(server);
var express = require('express');

var users = new Array();
var froms = new Array();

server.listen(3000, function () {
    console.log('Server started. Listening on the port:' + 3000);
});

app_express.get('/source/socket.io.slim.js', function (req, res) {
    res.sendfile('sources/socket.io.slim.js');
});

app_express.use(express.static('public'));
io.on('connection', function (socket) {
    socket.on('barrage', function(data) {
        socket.broadcast.emit('barrage',{
            message: data.message
        })
    });
});




//init Electron
const electron = require('electron');
const BrowserWindow = require('electron').BrowserWindow
const app_electron = require('electron').app
  let win
  
  function createWindow () {
    var {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({width: width, height: height, frame: false, transparent: true, titleBarStyle: 'default', type: 'desktop', hasShadow: false, alwaysOnTop: true})
  
    win.loadURL('http://127.0.0.1:3000/server.html')
    win.maximize();
    win.setIgnoreMouseEvents(true);
  
    //win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
    })
  }
  
  app_electron.on('ready', createWindow)
  
  app_electron.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app_electron.quit()
    }
  })
  
  app_electron.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })

//open browser
const opn = require('opn');
setTimeout(function(){opn('http://127.0.0.1:3000/send.html')},1000)