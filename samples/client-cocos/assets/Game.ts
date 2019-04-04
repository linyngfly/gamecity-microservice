import { JoystickDirection } from "./script/Joystick/JoystickCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab) p_prefab: cc.Prefab = null;
    
    @property(cc.Node) m_gameMap: cc.Node = null;

    players = {};

    posMap = {};

    pos: cc.Vec2 = cc.Vec2.ZERO;

    client: Colyseus.Client;
    room: Colyseus.Room;

    userId: string;

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    
    onLoad() {
        this.client = new Colyseus.Client('ws://192.168.8.82:3000');
        this.client.onOpen.add(() => {
            this.room = this.client.join('game');

            this.startInputTimer();

            this.room.listen('players/:id', (change) => {
                if (change.operation === 'add') {
                    if (typeof this.players[change.path.id] === 'undefined') {
                        let playerNode = cc.instantiate(this.p_prefab);
                        playerNode.getChildByName('name').getComponent(cc.Label).string = change.value.name;
                        this.m_gameMap.addChild(playerNode);
                        this.players[change.path.id] = playerNode;
                        if(change.path.id === this.room.sessionId) {
                            playerNode.getChildByName('name').color = cc.Color.RED;
                        }
                        console.log('add', change)
                    }
                    console.log('add', change);
                } else if (change.operation === 'remove') {
                    if (this.players[change.path.id]) {
                        this.players[change.path.id].removeFromParent(true);
                        delete this.players[change.path.id];
                    }
                }
            });
            this.room.onStateChange.add((state) => {
                // console.log('onStateChange', state);
                for (let key in state.players) {
                    let obj = state.players[key];
                    // console.log('obj',obj);
                    // this.players[key].x = obj.x;
                    if (obj.dir) {
                        this.players[key].getChildByName('hero').scaleX = 1;
                    } else {
                        this.players[key].getChildByName('hero').scaleX = -1;
                    }
                    this.posMap[key] = cc.v2(obj.x, obj.y);

                }
            });

            this.room.onMessage.add((message) => {
                console.log("server just sent this message:", message);
            });
        });
        
    }

    start() {

    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch(event.keyCode) {
            case cc.macro.KEY.up:
            case cc.macro.KEY.w:
            {
                this.room.send({ y: 5 });
                break;
            }
            case cc.macro.KEY.down: 
            case cc.macro.KEY.s: 
            {
                this.room.send({ y: -5 });
                break;
            }
            case cc.macro.KEY.left: 
            case cc.macro.KEY.a: 
            {
                this.room.send({ x: -5 });
                break;
            }
            case cc.macro.KEY.right: 
            case cc.macro.KEY.d: 
            {
                this.room.send({ x: 5 });
                break;
            }
        }


    }

    onKeyUp(event: cc.Event.EventKeyboard) {


    }

    /**
     * 摇杆的回调
     * @param angle 角度
     * @param joystickDir 方向 八向多4个 
     * @param addPos 全向的时候的偏移值
     */
    JoystickCallback(angle:number, joystickDir: JoystickDirection, addPos: cc.Vec2) {

        switch(joystickDir) {
            case JoystickDirection.UP: {
                this.pos = cc.v2(0, 5); 
                break;
            }
            case JoystickDirection.DOWN: {
                this.pos = cc.v2(0, -5); 
                break;
            }
            case JoystickDirection.LEFT: {
                this.pos = cc.v2(-5, 0); 
                break;
            }
            case JoystickDirection.RIGHT: {
                this.pos = cc.v2(5, 0); 
                break;
            }
            case JoystickDirection.CENTER: {
                this.pos = cc.Vec2.ZERO;
                break;
            }
        }
        // this.player.position.addSelf(addPos); 

        // cc.log(angle)
        // cc.log(JoystickDirection[joystickDir]);
        // cc.log(addPos);

    }

    startInputTimer() {
        this.schedule(() => {
            this.room.send(this.pos);
        },0.016);
    }

    update(dt) {
        for (let key in this.players) {
            let obj = this.players[key];
            this.players[key].setPosition(this.players[key].position.lerp(this.posMap[key],0.15))
            // this.players[key].x = obj.x;
            // this.players[key].y = obj.y;
        }
    }
}
