"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
class PlayerState {
    constructor() {
        // EntityMap是colyseus的对象实体模板
        this.players = {};
    }
    /**
     * 添加新用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    addPlayer(client) {
        let player = new Player_1.Player(0, 0);
        this.players[client.sessionId] = player;
    }
    /**
     * 删除一个用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    removePlayer(client) {
        delete this.players[client.sessionId];
    }
    /**
     * 移动用户的方法
     *
     * @param {Client} client
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @memberof PlayerState
     */
    movePlayer(client, x = 0, y = 0) {
        this.players[client.sessionId].x += x;
        this.players[client.sessionId].y += y;
        if (x > 0) {
            this.players[client.sessionId].dir = true;
        }
        else {
            this.players[client.sessionId].dir = false;
        }
    }
}
exports.PlayerState = PlayerState;
