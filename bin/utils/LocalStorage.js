"use strict";
/**
 * @author limo
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 用户本地数据操作类
 *
 * @export
 * @class UserData
 */
var cc;
class UserData {
    /**
     * 获取数据
     * @param key 键
     */
    static get(key) {
        return cc.sys.localStorage.getItem(key);
    }
    /**
     * 保存数据
     * @param key 键
     * @param value 值
     */
    static put(key, value) {
        cc.sys.localStorage.setItem(key, value);
    }
    /**
     * 删除数据
     * @param key 键
     */
    static remove(key) {
        cc.sys.localStorage.removeItem(key);
    }
}
exports.UserData = UserData;
