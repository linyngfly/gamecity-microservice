"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameRoom_1 = require("./room/GameRoom");
const colyseus_1 = require("colyseus");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = express_1.default();
// 初始化游戏服务器
const gameServer = new colyseus_1.Server({
    server: http_1.default.createServer(app)
});
// 注册房间服务器
gameServer.register('game', GameRoom_1.GameRoom);
// 开始监听端口
gameServer.listen(3000);
console.log('server is on');
