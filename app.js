const {Server: HttpServer} = require('http');
const {Server: IoServer} = require('socket.io');
const express = require('express');
const _ = require('lodash');
const logger = require('morgan');
require('dotenv').config();
const MessagesService = require('./src/services/database/messages/messages.services');
const errorHandler = require('./src/middlewares/errorHandler');
const indexRouter = require('./src/routes/index');

const app = express();


const messageService = new MessagesService();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/api', indexRouter);

const http = new HttpServer(app);
const io = new IoServer(http);

app.get('/health', (_req, res) =>{
    res.status(200).json({
        success: true,
        enviroment: process.env.ENVIROMENT || 'undefined',
        health: 'Up'
    });
})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.get('/', async(_req, res) => {
    res.status(200).json({
        env: process.env.ENVIROMENT || undefined,
        port: process.env.PORT || 8000
    })
})
app.use('/api', indexRouter)
app.use(errorHandler)
app.use(logger('dev'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('dev'));

app.use('/api', indexRouter);

app.use(errorHandler);


io.on('connection', async (socket) => {
    const messages = await messageService.getMessages();
    console.info('Nuevo cliente conectado')
    socket.emit('UPDATE_DATA', messages.data);
    socket.on('NEW_MESSAGE_TO_SERVER', async data => {
        await messageService.createMesage(data)
        io.sockets.emit('NEW_MESSAGE_FROM_SERVER', data);
    })
})

module.exports = app;
module.exports = http;