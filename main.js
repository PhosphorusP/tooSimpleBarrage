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
            message: data.message,
            type: data.type,
            color: data.color
        })
    });
});




//init Electron
const path = require('path');
const electron = require('electron');
const {BrowserWindow, Tray, Menu, ipcMain} = require('electron');
const app_electron = require('electron').app;
const opn = require('opn');
  let win
  let tray = null
  
  function readyHandler () {
    tray = new Tray(path.join(__dirname,'/sources/tray.png'));
    const trayMenu = Menu.buildFromTemplate([
      {label: '退出', click: ()=>{app_electron.quit();}, type: 'normal'}
    ]);
    tray.setToolTip('tooSimpleBarrage正在运行。');
    tray.setContextMenu(trayMenu);


    win = new BrowserWindow({width: 384, height: 256, frame: false, transparent: true, hasShadow: false})
  
    win.loadFile(path.join(__dirname, '/sources/launch.html'));
    //win.setIgnoreMouseEvents(true);
  
    //win.webContents.openDevTools()
  
    win.on('closed', () => {
      win = null
    })
  }
  
  app_electron.on('ready', readyHandler)
  
  app_electron.on('window-all-closed', () => {
      app_electron.quit();
  })
  
  app_electron.on('activate', () => {
    if (win === null) {
      readyHandler()
    }
  })

ipcMain.on('launch', (event, arg) => {
    win.setOpacity(0);
    win.setIgnoreMouseEvents(true);
    win.maximize();
    win.setAlwaysOnTop(true, 'screen-saver', 4);
    win.loadURL('http://127.0.0.1:3000/server.html');
    setTimeout(()=>{win.setOpacity(1)},1000);
    setTimeout(()=>{opn('http://127.0.0.1:3000/send.html')},1000);
  })