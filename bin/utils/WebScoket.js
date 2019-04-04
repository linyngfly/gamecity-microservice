"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter_1 = require("./EventEmitter");
/**
 * WebSocket的工具类
 *依赖于之前的EventEmitter工具类
 *实现WebSockt的绑定
 * @export
 * @class WS
 * @extends {EventEmitter}
 */
var WebSocket;
class WS extends EventEmitter_1.EventEmitter {
    constructor() {
        super();
        // socket实例
        // private _sock: WebSocket = null;
        this._sock = null;
        // 是否连接成功
        this._isConnected = false;
    }
    /**
     * 连接的方法
     *
     * @param {string} url
     * @memberof WS
     */
    connect(url) {
        if (!this._sock || this._sock.readyState !== 1) {
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
    _onOpen(event) {
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
    _onError(event) {
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
    _onClose(event) {
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
    _onMessage(event) {
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
    send(message) {
        if (!this._isConnected) {
            return;
        }
        if (typeof message === 'string') {
            this._sock.send(message);
        }
        else if (typeof message === 'object') {
            let jsonStr = JSON.stringify(message);
            this._sock.send(jsonStr);
        }
    }
    /**
     * 关闭连接
     *
     * @memberof WS
     */
    close() {
        this._sock.close();
        this._isConnected = false;
    }
}
// 单例
WS.INS = new WS();
/**
 * 连接状态类型
 *
 * @static
 * @memberof WS
 */
WS.EventType = {
    OPEN: 'open',
    ERROR: 'error',
    CLOSE: 'close',
    MESSAGE: 'message',
};
exports.WS = WS;
// 简单的连接测试
// WS.INS.connect('ws://echo.websocket.org');
// WS.INS.on(WS.EventType.OPEN, () => {
//     console.log('open');
//     WS.INS.send('hello');
// });
// WS.INS.on(WS.EventType.MESSAGE, (event: MessageEvent) => {
//     console.log('message', event.data);
// });
