import CryptoJS from "crypto-js";
import { stringify } from "qs";
import { upms } from "./variables";
import { getToken } from "./auth";
import router from "../router";

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (("" + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return time_str;
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf("?") + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1;
        } else {
            len += 0.5;
        }
    }
    return Math.floor(len);
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) return "";
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return "";
            return (
                encodeURIComponent(key) + "=" + encodeURIComponent(json[key])
            );
        })
    ).join("&");
}

export function param2Obj(url) {
    const search = url.split("?")[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
        '"}'
    );
}

export function html2Text(val) {
    const div = document.createElement("div");
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

    if (typeof target !== "object") {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === "object") {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += "" + className;
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}

export const pickerOptions = [{
        text: "今天",
        onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().toDateString());
            end.setTime(start.getTime());
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近一周",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近一个月",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
        }
    },
    {
        text: "最近三个月",
        onClick(picker) {
            const end = new Date(new Date().toDateString());
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
        }
    }
];

export function getTime(type) {
    if (type === "start") {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function(...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== "object") {
        throw new Error("error arguments", "shallowClone");
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === "object") {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

// 获取随机数字符串
export function getRandomStr() {
    const curDateTime = new Date().getTime();
    const randomNum = parseInt(Math.random()) * 100000;
    return `${curDateTime + randomNum}`;
}

// 时间戳格式化
export function dateFormat(timeStamp, fmt = "yyyy-MM-dd") {
    // 转换日期是，对于空的或为null的直接返回空
    if (!timeStamp || timeStamp === "NULL" || timeStamp === "null") {
        return null;
    }
    const date = new Date(timeStamp);
    const o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ?
                o[k] :
                ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}

// 随机生成uuid
export function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

// 手机号验证
export function validPhone(phone) {
    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    return reg.test(phone);
}

// export function a(e) {
//     let g = c.enc.Utf8.parse(e);
//     let f = c.AES.encrypt(g, this.d, {
//       mode : c.mode.ECB,
//       padding : c.pad.Pkcs7
//     });
//     return f.toString();
// }

// 解密数据
export function decode(e) {
    const d = CryptoJS.enc.Latin1.parse("x89j30k23k5s2lln");
    const g = CryptoJS.AES.decrypt(e, d, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    const f = JSON.parse(CryptoJS.enc.Utf8.stringify(g).toString());
    return f;
}

/**
 * 格式化秒
 * @param int  seconds 总秒数
 * @return string result 格式化后的字符串
 */
export function formatSeconds(seconds) {
    const time = Number(seconds);
    let result = "";
    var h =
        Math.floor(time / 3600) < 10 ?
        "0" + Math.floor(time / 3600) :
        Math.floor(time / 3600);
    var m =
        Math.floor((time / 60) % 60) < 10 ?
        "0" + Math.floor((time / 60) % 60) :
        Math.floor((time / 60) % 60);
    var s =
        Math.floor(time % 60) < 10 ?
        "0" + Math.floor(time % 60) :
        Math.floor(time % 60);
    return (result += h + " : " + m + " : " + s);
}

/**
 * 数字保留n位小数
 * @param value 数字
 * @param n 小数位数
 * @returns {string|*}
 */
export function Fixed(value, n) {
    if (value && n) {
        // 截取当前数据到小数点后两位
        return parseFloat(value).toFixed(n);
    }
    return value;
}

/**
 * 去阿里pc支付方法
 * @param orderNo 订单编号
 * @return {string|*}
 */
export function toAliPay(orderNo) {
    const tempWindow = window.open();
    // tempWindow.location = process.env.VUE_APP_BASE_API + "/user/center/aliPay/pcPay?orderNo=" + orderNo;
    tempWindow.location =
        process.env.VUE_APP_BASE_API + `${upms}/pay/ali/pc/${orderNo}`;
}

/*
 * 判断obj是否为一个整数
 */
function isInteger(obj) {
    return Math.floor(obj) === obj;
}

/*
 * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
 * @param floatNum {number} 小数
 * @return {object}
 *   {times:100, num: 314}
 */
function toInteger(floatNum) {
    const ret = { times: 1, num: 0 };
    if (isInteger(floatNum)) {
        ret.num = floatNum;
        return ret;
    }
    const strfi = floatNum + "";
    const dotPos = strfi.indexOf(".");
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    const intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret;
}

/*
 * 核心方法，实现加减乘除运算，确保不丢失精度
 * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
 *
 * @param a {number} 运算数1
 * @param b {number} 运算数2
 * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
 * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
 *
 */
function operation(a, b, op) {
    const o1 = toInteger(a);
    const o2 = toInteger(b);
    const n1 = o1.num;
    const n2 = o2.num;
    const t1 = o1.times;
    const t2 = o2.times;
    const max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
        case "add":
            if (t1 === t2) {
                // 两个小数位数相同
                result = n1 + n2;
            } else if (t1 > t2) {
                // o1 小数位 大于 o2
                result = n1 + n2 * (t1 / t2);
            } else {
                // o1 小数位 小于 o2
                result = n1 * (t2 / t1) + n2;
            }
            return result / max;
        case "subtract":
            if (t1 === t2) {
                result = n1 - n2;
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2);
            } else {
                result = n1 * (t2 / t1) - n2;
            }
            return result / max;
        case "multiply":
            result = (n1 * n2) / (t1 * t2);
            return result;
        case "divide":
            result = (n1 / n2) * (t2 / t1);
            return result;
    }
}

// 加减乘除
export function add(a, b) {
    // 加
    return operation(a, b, "add");
}

export function subtract(a, b) {
    // 减
    return operation(a, b, "subtract");
}

export function multiply(a, b) {
    // 乘
    return operation(a, b, "multiply");
}

export function divide(a, b) {
    // 除
    return operation(a, b, "divide");
}

// 获取线段中点
export function getLineCenter(startPoint, endPoint) {
    const x = Math.abs(startPoint.x - endPoint.x);
    const y = Math.abs(startPoint.y - endPoint.y);
    const cx = parseInt(x / 2);
    const cy = parseInt(y / 2);
    let px = 0;
    let py = 0;
    if (startPoint.x > endPoint.x) {
        px = startPoint.x - cx;
    } else {
        px = startPoint.x + cx;
    }
    if (startPoint.y > endPoint.y) {
        py = startPoint.y - cy;
    } else {
        py = startPoint.y + cy;
    }
    return {
        x: px,
        y: py
    };
}

// 获取dom属性
export function getStyle(dom, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(dom)[prop];
    } else {
        return dom.currentStyle[prop];
    }
}

// 对象原型字符串
function getObjectProp(o) {
    return Object.prototype.toString
        .call(o)
        .toLowerCase()
        .slice(8, -1);
}

export function isObject(o) {
    return getObjectProp(o) === "object";
}

function getFloat(number, n) {
    n = n ? parseInt(n) : 0;
    if (n <= 0) {
        return Math.round(number);
    }
    number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); // 四舍五入
    number = Number(number).toFixed(n); // 补足位数
    return number;
}

// 将数字转换为金钱格式
export function toMoney(num, n = 2) {
    // 金钱数字为空时，将数字转为'-'
    if (num === null || num === undefined || num === "") {
        return "-";
    }
    num = Number(num);
    // num = divide(num, 100);
    const m2 = getFloat(num, n).split(".")[1];
    num = num.toFixed(n);
    num = parseFloat(num);
    num = num.toLocaleString();
    num = num.split(".")[0];
    return num + "." + m2; // 返回的是字符串23,245.12保留2位小数
}

/*
    处理金钱录入/读取时的转换
    num: 金额,
    type: true为录入，false为读取,
    turnPoint: 转换的位数
 */
export function turnMoney(num, type = true, turnPoint) {
    if (num === null || num === undefined || num === "") {
        return "";
    }
    num = Number(num);
    // num = type ? multiply(num, 100) : divide(num, 100);
    return num;
}

export function lastMonth(isDis) {
    const _year = new Date().getFullYear();
    const _month = new Date().getMonth();
    const _lastMonth = _month === 0 ? 12 : _month;
    return (
        (_month === 0 ? _year - 1 : _year) +
        (isDis ? "-" : "") +
        (_lastMonth.length !== 2 ? "0" + _lastMonth : _lastMonth)
    );
}
export function currentMonth() {
    return new Date().getFullYear() + "" + new Date().getMonth() + 1 + ""
}
// 简易版原生ajax
export function ajax({
    url,
    type = "get",
    data = {},
    dataType = "form",
    async = true,
    success,
    error
}) {
    if (!url) return;
    const xhr = new XMLHttpRequest();
    const dataStr = stringify(data);
    const setHeader = () => {
        xhr.setRequestHeader(
            "Content-type",
            "application/" +
            (dataType === "json" ? "json" : "x-www-form-urlencoded")
        );
        xhr.setRequestHeader("Authorization", "Bearer " + getToken());
    };
    url = process.env.VUE_APP_BASE_API + url;
    if (type === "get") {
        xhr.open("get", url + "?" + dataStr, async);
        setHeader();
        xhr.send();
    } else if (type === "post") {
        xhr.open("post", url, async);
        setHeader();
        xhr.send(dataStr);
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let d = xhr.responseText;
            if (dataType === "json" || dataType === "form") {
                try {
                    d = JSON.parse(d);
                } catch (e) {}
                if (d.success) {
                    success && success(d.data);
                } else {
                    error && error(d);
                }
            } else {
                success && success(d);
            }
        } else if (xhr.status !== 200) {
            error && error(xhr.status);
        }
    };
}

// 评估详情
export function gotoAssessmentDetail(id) {
    const newpage = router.resolve({
        name: "record",
        query: {
            id: id
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转客户档案
export function gotoCustomerDetail(companyId) {
    const newpage = router.resolve({
        name: "customerManagement",
        query: {
            id: companyId
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转合同
export function gotoContractDetail(contractID) {
    const newpage = router.resolve({
        name: "contractLedger",
        query: {
            id: contractID
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转订单
export function gotoOrderDetail(orderID) {
    const newpage = router.resolve({
        name: "orderManagement",
        query: {
            id: orderID
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转应收详情
export function gotoReceivablesDetail(receivableID) {
    const newpage = router.resolve({
        name: "receivableManagement",
        query: {
            id: receivableID
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转收款记录详情
export function gotoRecordsDetail(registerID) {
    const newpage = router.resolve({
        name: "receiptRecords",
        query: {
            id: registerID
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转发货详情
export function gotoShippingDetail(registerID, CID) {
    const newpage = router.resolve({
        name: "shippingTracking",
        query: {
            id: registerID,
            contract_id: CID
        }
    });
    window.open(newpage.href, "_blank");
}

// 跳转发票详情
export function gotoInvoiceDetail(invoiceID) {
    const newpage = router.resolve({
        name: "invoiceList",
        query: {
            id: invoiceID
        }
    });
    window.open(newpage.href, "_blank");
}

// 会员过期，开通会员
export function vipExpireConfirm() {
    this.$confirm(
        "您的会员权限已到期，到期后平台仍可访问，但部分功能不可使用，建议尽快购买正式版本。",
        "提示", {
            confirmButtonText: "前往开通会员",
            cancelButtonText: "取消",
            dangerouslyUseHTMLString: true,
            type: "warning",
        }
    ).then(() => {
        this.$router.push({ name: "buy" });
    }).catch(() => {})
}

export function getOffset(dom, offset = { left: 0, top: 0 }) {
    if (dom.nodeName === "BODY") {
        return offset;
    }
    const l = dom.offsetLeft;
    const t = dom.offsetTop;
    offset.left += l;
    offset.top += t;
    return getOffset(dom.offsetParent, offset);
}

export function isNull(value) {
    return value === null ? "-" : value;
}

// 获取会员版本权限
export function isVip() {
    // return this.$store.state.user.userInfo.versionOutFlag;
    return true
}

export function isMobile() {
    const userAgentInfo = navigator.userAgent;
    const Agents = ["Android", "iPhone", "iPad", "iPod"];
    return !!Agents.find(item => userAgentInfo.includes(item));
}


export function downloadFile(src, filename) {
    const a = document.createElement('a');
    a.setAttribute('download', filename || '');
    a.href = src;
    a.target = '_blank';
    a.click();
    a.remove();
}

export function saveFile(file, type, filename) {
    const blob = new Blob([file], {
        type
    });
    const src = window.URL.createObjectURL(blob);
    downloadFile(src, filename);
}


/**深拷贝*/
export function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result[key] = deepCopy(obj[key]); //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}