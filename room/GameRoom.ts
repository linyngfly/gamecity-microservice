// import { Room, Client,FossilDeltaSerializer, serialize} from 'colyseus';
import { Room, Client} from 'colyseus';
import { PlayerState } from '../entity/PlayerState';

// @serialize(FossilDeltaSerializer)
export class GameRoom extends Room<PlayerState> {
    // 房间内的最大人数
    maxClients: number = 3;

    // 房间初始化方法
    onInit(options: any) {
        console.log('ChatRoom onInit');
        // 设置需要更新的状态
        this.setState(new PlayerState());
        // 设置发送频率
        this.setPatchRate(50);
    }

    // 消息收取方法
    onJoin(client: Client) {
        console.log('ChatRoom onJoin');
        this.state.addPlayer(client.sessionId);
    }

    // 消息收取方法
    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    // 消息收取方法
    onMessage(client: Client, data: any): void {
        this.state.movePlayer(client.sessionId, data.x, data.y);
    }

    onDispose () {
        console.log("Dispose GameRoom");
    }

}