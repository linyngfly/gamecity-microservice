
import { EventEmitter } from "./EventEmitter";

/**
 * WebSocket的工具类
 *依赖于之前的EventEmitter工具类
 *实现WebSockt的绑定
 * @export
 * @class WS
 * @extends {EventEmitter}
 */
var WebSocket:any;

export class WS extends EventEmitter {
    // 单例
    public static readonly INS: WS = new WS();
    // socket实例
    // private _sock: WebSocket = null;
    private _sock: any = null;
    // 是否连接成功
    private _isConnected: boolean = false;

    /**
     * 连接状态类型
     *
     * @static
     * @memberof WS
     */
    public static EventType = {
        OPEN: 'open',
        ERROR: 'error',
        CLOSE: 'close',
        MESSAGE: 'message',
    }

    private constructor() {
        super();
    }

    /**
     * 连接的方法
     *
     * @param {string} url
     * @memberof WS
     */
    connect(url: string): WS{
        if (!this._sock || this._sock.readyState !== 1){
            this._sock = new WebSocket(url);
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onerror = this._onError.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
        }
        return this;
    }

    /**
     * 开始连接的方法
     *
     * @private
     * @memberof WS
     */
    private _onOpen(event: any) {
    // private _onOpen(event: MessageEvent) {
        this._isConnected = true;
        this.emit(WS.EventType.OPEN, event);   
    }

    /**
     * 错误的方法
     *
     * @private
     * @memberof WS
     */
    private _onError(event: any) {
    // private _onError(event: MessageEvent) {
        this._isConnected = false;
        this.emit(WS.EventType.ERROR, event);
    }

    /**
     * 关闭的方法
     *
     * @private
     * @memberof WS
     */
    private _onClose(event: any) {
    // private _onClose(event: MessageEvent) {
        this._isConnected = false;
        this.emit(WS.EventType.CLOSE, event);  
    }

    /**
     * 信息的方法
     *
     * @private
     * @param {MessageEvent} event
     * @memberof WS
     */
    private _onMessage(event: any) {
    // private _onMessage(event: MessageEvent) {
        this._isConnected = false;
        this.emit(WS.EventType.MESSAGE, event);    
    }

    /**
     * 发送数据
     *
     * @param {(string | object)} message
     * @memberof WS
     */
    send(message: string | object) {
        if(!this._isConnected) {
            return;
        }
        if(typeof message === 'string') {
            this._sock.send(message);
        } else if(typeof message === 'object') {
            let jsonStr = JSON.stringify(message);
            this._sock.send(jsonStr);
        }
    }

    /**
     * 关闭连接
     *
     * @memberof WS
     */
    close(){
        this._sock.close();
        this._isConnected = false;
    }

}


// 简单的连接测试
// WS.INS.connect('ws://echo.websocket.org');
// WS.INS.on(WS.EventType.OPEN, () => {
//     console.log('open');
//     WS.INS.send('hello');
// });

// WS.INS.on(WS.EventType.MESSAGE, (event: MessageEvent) => {
//     console.log('message', event.data);
// });