"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const PlayerState_1 = require("../entity/PlayerState");
class GameRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        // 房间内的最大人数
        this.maxClients = 3;
    }
    // 房间初始化方法
    onInit(options) {
        console.log('ChatRoom onInit');
        // 设置需要更新的状态
        this.setState(new PlayerState_1.PlayerState());
        // 设置发送频率
        this.setPatchRate(50);
    }
    // 消息收取方法
    onJoin(client) {
        this.state.addPlayer(client);
    }
    // 消息收取方法
    onLeave(client) {
        this.state.removePlayer(client);
    }
    // 消息收取方法
    onMessage(client, data) {
        this.state.movePlayer(client, data.x, data.y);
    }
    onDispose() {
        console.log("Dispose GameRoom");
    }
}
exports.GameRoom = GameRoom;
