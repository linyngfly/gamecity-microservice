"use strict";
/**
 * 这里引用了一个js库 需要作为插件加入ccc
 * polyglot.min.js
 * @author limo
 */
Object.defineProperty(exports, "__esModule", { value: true });
const polyglot = new Polyglot();
class I18n {
    /**
     * 初始化的方法
     *
     * @static
     * @param {object} [obj={}]
     * @memberof I18n
     */
    static init(obj = {}) {
        polyglot.extend(obj);
    }
    /**
     * 获取配置字符串的方法
     *
     * @static
     * @param {object} [obj={}]
     * @memberof I18n
     */
    static t(key, param) {
        if (param) {
            return polyglot.t(key, param);
        }
        else {
            return polyglot.t(key);
        }
    }
}
exports.I18n = I18n;
