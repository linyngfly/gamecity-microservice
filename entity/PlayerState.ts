import { Client } from 'colyseus';
import { Schema, type, MapSchema} from "@colyseus/schema";
import { Player } from './Player';

export class PlayerState extends Schema{
    // EntityMap是colyseus的对象实体模板
    @type({ map: Player })
    players = new MapSchema<Player>();

    /**
     * 添加新用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    addPlayer(client: Client) {
        let player = new Player(0, 0);
        this.players[client.sessionId] = player;
    }

    /**
     * 删除一个用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    removePlayer (client: Client) {
        delete this.players[ client.sessionId ];
    }

    /**
     * 移动用户的方法
     *
     * @param {Client} client
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @memberof PlayerState
     */
    movePlayer(client: Client, x: number = 0, y: number = 0) {
        this.players[client.sessionId].x += x;
        this.players[client.sessionId].y += y;
        if(x > 0){
            this.players[client.sessionId].dir = true;
        } else {
            this.players[client.sessionId].dir = false;
        }
    }
}