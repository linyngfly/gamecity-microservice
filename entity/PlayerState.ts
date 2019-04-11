import { Client } from 'colyseus';
import { Schema, type, MapSchema } from "@colyseus/schema";
import { Player } from './Player';

export class PlayerState extends Schema {
    // EntityMap是colyseus的对象实体模板
    @type({ map: Player })
    players = new MapSchema<Player>();

    /**
     * 添加新用户的方法
     *
     * @param {string} sessionId
     * @memberof PlayerState
     */
    addPlayer(sessionId: string) {
        let player = new Player(0, 0);
        this.players[sessionId] = player;
    }

    /**
     * 删除一个用户的方法
     *
     * @param {string} sessionId
     * @memberof PlayerState
     */
    removePlayer(sessionId: string) {
        delete this.players[sessionId];
    }

    /**
     * 移动用户的方法
     *
     * @param {string} sessionId
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @memberof PlayerState
     */
    movePlayer(sessionId: string, x: number = 0, y: number = 0) {
        this.players[sessionId].x += x;
        this.players[sessionId].y += y;
        if (x > 0) {
            this.players[sessionId].dir = true;
        } else {
            this.players[sessionId].dir = false;
        }
    }
}