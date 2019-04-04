import { GameRoom } from './room/GameRoom';
import { Server } from 'colyseus';
import express from 'express';
import http from 'http';

const app = express();

// 初始化游戏服务器
const gameServer = new Server({
    server: http.createServer(app)
});

// 注册房间服务器
gameServer.register('game', GameRoom);

// 开始监听端口
gameServer.listen(3000);
console.log('server is on');