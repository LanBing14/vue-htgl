import CryptoJS from 'crypto-js';

/**
 * md5加密方法
 * @param str
 * @returns {*}
 * @constructor
 */
export function MD5(str) {
    return CryptoJS.MD5(str).toString();
}

/**
 * 判断字符串是否为空
 * @param str
 * @returns {*}
 */
export function isNull(str) {
    return str === '' || undefined === str || str === ' ' || str === null;
}

/**
 * 判断数组是否为空
 * @param arr
 * @returns {*}
 */
export function arrayIsNull(arr) {
    return arr === '' || undefined === arr || arr === [] || arr === null || arr.length === 0;
}
