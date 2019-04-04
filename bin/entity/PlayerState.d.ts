import { EntityMap, Client } from 'colyseus';
import { Player } from './Player';
export declare class PlayerState {
    players: EntityMap<Player>;
    /**
     * 添加新用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    addPlayer(client: Client): void;
    /**
     * 删除一个用户的方法
     *
     * @param {Client} client
     * @memberof PlayerState
     */
    removePlayer(client: Client): void;
    /**
     * 移动用户的方法
     *
     * @param {Client} client
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @memberof PlayerState
     */
    movePlayer(client: Client, x?: number, y?: number): void;
}
