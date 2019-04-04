const {ccclass, property} = cc._decorator;

/**
 * 触摸类型
 */
export enum JoystickTouchType{
    DEFAULT,
    FOLLOW
};

/**
 * 方向类型
 */
export enum JoystickDirectionType{
    FOUR,
    EIGHT,
    ALL
};

/**
 * 具体方位
 */
export enum JoystickDirection{
    CENTER,
    UP,
    DOWN,
    LEFT,
    RIGHT,
    UPPER_LEFT,
    UPPER_RIGHT,
    LOWER_LEFT,
    LOWER_RIGHT
}

@ccclass
export default class JoystickCtrl extends cc.Component {


    @property(cc.Node) target: cc.Node = null;

    @property(cc.Node) joystickBar:cc.Node = null;

    @property(cc.Node) joystickBG:cc.Node = null;

    @property(0) radius:number = 0;

    @property({
        tooltip:"触摸模式",
        type:cc.Enum(JoystickTouchType)
    })  touchType:JoystickTouchType = JoystickTouchType.DEFAULT;

    @property({
        tooltip:"方向模式",
        type:cc.Enum(JoystickDirectionType)
    })  directionType:JoystickDirectionType = JoystickDirectionType.ALL;
    
    @property([cc.Component.EventHandler]) joystickHandler:Array<cc.Component.EventHandler> = [];


    joystickDir: JoystickDirection = JoystickDirection.CENTER;
    
    _angle:number = 0;
    curAngle:number = 0;
    curDistance:number = 0;
    startPos:cc.Vec2 = cc.v2(0,0);
    _isOnTouchStart: boolean = false;

    onLoad () {
        if(this.radius == 0){
            this.radius = this.joystickBG.width/2
        }
        this.curDistance = 0
        this.curAngle = 0
        this.startPos = this.node.position
        this.node.opacity = 50;
    }

    start () {

    }

    /**
     * 注册输入
     */
    registerInput(){

        let self = this;
        this.target.on(cc.Node.EventType.TOUCH_START,(eventTouch: cc.Event.EventTouch) => {
            // let flag =  self.onTouchBegan(eventTouch)
            // if (!flag){
            //     eventTouch.stopPropagation();
            // }
        });

        this.target.on(cc.Node.EventType.TOUCH_MOVE,(eventTouch: cc.Event.EventTouch) => {
            self.onTouchMoved(eventTouch)
        });

        this.target.on(cc.Node.EventType.TOUCH_END,(eventTouch: cc.Event.EventTouch) => {
            self.onTouchEnded(eventTouch)
        });

        // this._listener = cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         return self.onTouchBegan(touch, event)
        //     },
        //     onTouchMoved: function(touch, event) {
        //         self.onTouchMoved(touch, event)
        //     },
        //     onTouchEnded: function(touch, event) {
        //         self.onTouchEnded(touch, event)
        //     }
        // },self.node);
    }

    onTouchBegan(eventTouch: cc.Event.EventTouch){
        //如果触摸类型为FOLLOW，则摇控杆的位置为触摸位置,触摸开始时候现形
        if(this.touchType == JoystickTouchType.FOLLOW){
            let touchPos = this.node.parent.convertToNodeSpaceAR(eventTouch.getLocation())
            this.node.setPosition(touchPos);
            this._isOnTouchStart = true;
        } else {                    
            //把触摸点坐标转换为相对与目标的模型坐标
            let touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
            //点与圆心的距离
            let distance =  touchPos.sub(cc.v2(0, 0)).mag();
            //如果点与圆心距离小于圆的半径,返回true
            if(distance < this.radius ) {
                if(distance>20){
                    this.node.opacity = 255
                    this.joystickBar.setPosition(touchPos);
                    //更新角度
                    this.getAngle(touchPos)
                }
                this._isOnTouchStart = true;
            }
        }
    }
    onTouchMoved(eventTouch: cc.Event.EventTouch){
            if (!this._isOnTouchStart){
                return;
            }

            //把触摸点坐标转换为相对与目标的模型坐标
            let touchPos = this.node.convertToNodeSpaceAR(eventTouch.getLocation())
            //点与圆心的距离
            let distance = touchPos.sub(cc.v2(0, 0)).mag();
    
            //如果点与圆心距离小于圆的半径,控杆跟随触摸点
            if(this.radius >= distance){
                if(distance>20){
                    this.node.opacity = 255;
                    this.joystickBar.setPosition(touchPos);
                    //更新角度
                    this.getAngle(touchPos)
                }else {
                    //this.node.opacity = 50
                    //摇杆恢复位置
                    this.joystickBar.setPosition(cc.v2(0,0));
                    this.curAngle = null;
                    //调用角度变化回调
                    cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
                    
                }
            }else{
                //触摸监听目标
                let x = Math.cos(this.getRadian(touchPos)) * this.radius;
                let y = Math.sin(this.getRadian(touchPos)) * this.radius;
                if(touchPos.x>0 && touchPos.y<0){
                    y *= -1;
                }else if(touchPos.x<0 && touchPos.y<0){
                    y *= -1;
                }
    
                this.joystickBar.setPosition(cc.v2(x, y));
                //更新角度
                this.getAngle(touchPos)
            }
    }
    onTouchEnded(eventTouch: cc.Event.EventTouch){
        if (!this._isOnTouchStart) {
            return;
        }
        this.joystickDir = JoystickDirection.CENTER;
        //如果触摸类型为FOLLOW，离开触摸后隐藏
        if(this.touchType == JoystickTouchType.FOLLOW){
            //this.node.position = this.startPos
        }
        let time = this.joystickBar.position.sub(cc.v2(0,0)).mag()/500;
        
        //摇杆恢复位置
        this.joystickBar.runAction(cc.sequence(
            cc.moveTo(Math.abs(time),cc.v2(0,0)),
            cc.callFunc(()=>{
                this.curAngle = null
                this.node.opacity = 50
                //调用角度变化回调
                cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
            })
        ));
        this._isOnTouchStart = false;
    }

    onTouchCancel(eventTouch: cc.Event.EventTouch){
        this.onTouchEnded(eventTouch);
    }

    //计算角度并返回
    getAngle(point:cc.Vec2){
        this._angle =  Math.floor(this.getRadian(point)*180/Math.PI);
        
        if(point.x>0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y<0){
            this._angle = 360 - this._angle;
        }else if(point.x<0 && point.y==0){
            this._angle = 180;
        }else if(point.x>0 && point.y==0){
            this._angle = 0;
        }else if(point.x==0 && point.y>0){
            this._angle = 90;
        }else if(point.x==0 && point.y<0){
            this._angle = 270;
        }
        this.updateCurAngle()
        return this._angle;
    }
    //计算弧度并返回
    getRadian(point:cc.Vec2){
        let curZ = Math.sqrt(Math.pow(point.x,2)+Math.pow(point.y,2));
        let radian = 0;
        if(curZ==0){
            radian = 0;
        }else {
            radian = Math.acos(point.x/curZ);
        }
        return radian;
    }

    updateCurAngle(){
        switch (this.directionType){
            case JoystickDirectionType.FOUR:
                this.curAngle = this.fourDirections();
                break;
            case JoystickDirectionType.EIGHT:
                this.curAngle = this.eightDirections();
                break;
            case JoystickDirectionType.ALL:
                this.joystickDir = JoystickDirection.CENTER;
                this.curAngle = this._angle
                break;
            default :
                this.curAngle = null
                break;
        }
        //调用角度变化回调
        cc.Component.EventHandler.emitEvents(this.joystickHandler, this.curAngle,this.joystickDir);
    }
    //四个方向移动(上下左右)
    fourDirections(){
        if(this._angle >= 45 && this._angle <= 135){
            this.joystickDir = JoystickDirection.UP;
            return 90
        }
        else if(this._angle >= 225 && this._angle <= 315){
            this.joystickDir = JoystickDirection.DOWN;
            return 270
        }
        else if(this._angle <= 225 && this._angle >= 180 || this._angle >= 135 && this._angle <= 180){
            this.joystickDir = JoystickDirection.LEFT;
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 315 || this._angle >= 0 && this._angle <= 45){
            this.joystickDir = JoystickDirection.RIGHT;
            return 0
        }
    }

    eightDirections(){
        if(this._angle >= 67.5 && this._angle <= 112.5){
            this.joystickDir = JoystickDirection.UP;
            return 90
        }
        else if(this._angle >= 247.5 && this._angle <= 292.5){
            this.joystickDir = JoystickDirection.DOWN;
            return 270
        }
        else if(this._angle <= 202.5 && this._angle >= 180 || this._angle >= 157.5 && this._angle <= 180){
            this.joystickDir = JoystickDirection.LEFT;
            return 180
        }
        else if(this._angle <= 360 && this._angle >= 337.5 || this._angle >= 0 && this._angle <= 22.5){
            this.joystickDir = JoystickDirection.RIGHT;
            return 0
        }
        else if(this._angle >= 112.5 && this._angle <= 157.5){
            this.joystickDir = JoystickDirection.UPPER_LEFT;
            return 135
        }
        else if(this._angle >= 22.5 && this._angle <= 67.5){
            this.joystickDir = JoystickDirection.UPPER_RIGHT;
            return 45
        }
        else if(this._angle >= 202.5 && this._angle <= 247.5){
            this.joystickDir = JoystickDirection.LOWER_LEFT;
            return 225
        }
        else if(this._angle >= 292.5 && this._angle <= 337.5){
            this.joystickDir = JoystickDirection.LOWER_RIGHT;
            return 315
        }
    }
    onEnable(){
        // this.registerInput();
        this.target.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable(){
        this.target.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    // update (dt) {},
}
