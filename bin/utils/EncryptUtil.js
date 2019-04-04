"use strict";
/**
 * 这里引用了一个js库 需要作为插件加入ccc
 * crypto-js.min.js
 * @author limo
 */
Object.defineProperty(exports, "__esModule", { value: true });
// 加密密钥
const SECRET_KEY = 'aoiwenx1fdse';
class EncryptUtil {
    /**
     * AES256位简单加密
     * @param dataString 需要加密的文本
     */
    static AESEncode(dataString) {
        const retStr = CryptoJS.AES.encrypt(dataString, SECRET_KEY, 256);
        return retStr.toString();
    }
    /**
     * AES256位简单解密
     * @param cipherText 解密后的文本
     */
    static AESDecode(cipherText) {
        const retStr = CryptoJS.AES.decrypt(cipherText, SECRET_KEY, 256);
        return retStr.toString(CryptoJS.enc.Utf8);
    }
}
exports.EncryptUtil = EncryptUtil;
