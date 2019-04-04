import { Room, Client } from 'colyseus';
import { PlayerState } from '../entity/PlayerState';
export declare class GameRoom extends Room<PlayerState> {
    maxClients: number;
    onInit(options: any): void;
    onJoin(client: Client): void;
    onLeave(client: Client): void;
    onMessage(client: Client, data: any): void;
}
