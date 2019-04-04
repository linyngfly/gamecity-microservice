"use strict";
/**
 * @author limo
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Http的基础操作类
 *
 * @export
 * @class Http
 */
var cc;
class Http {
}
/**
 * 基础的url
 *
 * @static
 * @type {string}
 * @memberof Http
 */
Http.BASE_URL = '';
/**
 * http get获取方法
 *
 * @static
 * @memberof Http
 */
Http.get = (route, param = {}, callback) => {
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 5000;
    let url = '';
    let paramStr = '';
    for (let key in param) {
        if (paramStr === '') {
            paramStr = '?';
        }
        if (paramStr !== '?') {
            paramStr += '&';
        }
        paramStr += key + '=' + param[key];
    }
    url = `${Http.BASE_URL}${route}${encodeURI(paramStr)}`;
    console.log('http get url:', url);
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (cc.sys.isNative) {
        xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            try {
                if (callback) {
                    callback(xhr.responseText);
                }
            }
            catch (e) {
                console.log("err:" + e);
            }
        }
    };
    xhr.send();
};
/**
 * http post 方法
 *
 * @static
 * @memberof Http
 */
Http.post = (route, param = {}, callback) => {
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.timeout = 5000;
    let url = '';
    let paramStr = '';
    for (let key in param) {
        if (paramStr !== '') {
            paramStr += '&';
        }
        paramStr += key + '=' + param[key];
    }
    url = `${Http.BASE_URL}${route}`;
    console.log('http post url:', url);
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (cc.sys.isNative) {
        // xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            try {
                if (callback) {
                    callback(xhr.responseText);
                }
            }
            catch (e) {
                console.log("err:" + e);
            }
        }
    };
    xhr.send(encodeURI(paramStr));
};
exports.Http = Http;
