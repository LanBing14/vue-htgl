/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

// 统一正则表达式
export const patterns = {
    // 合同金额正则 数字带小数
    contractPrice: /^(([1-9]{1}\d*)|(0{1}))(\.\d*)?$/
};

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}
/* 只能有中文*/
export function validateChinese(str) {
    const reg = /^[\Α-\￥]+$/i
    return reg.test(str)
}
/* 禁止有中文*/
export function validateNoChinese(str) {
    const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/
    return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

// 验证身份证号方法
export function isIdCard(idcard) {
    if (!idcard) {
        return true;
    }
    const area = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: 'xinjiang',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
    };
    // let Y, JYM;
    // let S, M;
    let ereg;
    // let idcard_array = [];
    // idcard_array = idcard.split('');
    if (area[parseInt(idcard.substr(0, 2))] == null) { return false; }
    switch (idcard.length) {
        case 15:
            ereg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/; // 测试出生日期的合法性
            if (ereg.test(idcard)) { return true; } else { return false; }
        case 18:
            ereg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
            if (ereg.test(idcard)) {
                return true;
            } else {
                return false;
            }
        default:
            return false;
    }
}

// 验证数字的正则表达式集
// 验证数字：^[0-9]*$
// 验证n位的数字：^\d{n}$
// 验证至少n位数字：^\d{n,}$
// 验证m-n位的数字：^\d{m,n}$
// 验证零和非零开头的数字：^(0|[1-9][0-9]*)$
// 验证有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
// 验证有1-3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
// 验证非零的正整数：^\+?[1-9][0-9]*$
// 验证非零的负整数：^\-[1-9][0-9]*$
// 验证非负整数（正整数 + 0） ^\d+$
// 验证非正整数（负整数 + 0） ^((-\d+)|(0+))$
// 验证长度为3的字符：^.{3}$
// 验证由26个英文字母组成的字符串：^[A-Za-z]+$
// 验证由26个大写英文字母组成的字符串：^[A-Z]+$
// 验证由26个小写英文字母组成的字符串：^[a-z]+$
// 验证由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
// 验证由数字、26个英文字母或者下划线组成的字符串：^\w+$
// 验证用户密码:^[a-zA-Z]\w{5,17}$ 正确格式为：以字母开头，长度在6-18之间，只能包含字符、数字和下划线。
// 验证是否含有 ^%&',;=?$\" 等字符：[^%&',;=?$\x22]+
// 验证汉字：^[\u4e00-\u9fa5],{0,}$
// 验证Email地址：/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
// 验证InternetURL：^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$
// 验证电话号码：^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$：--正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX。
// 验证身份证号（15位或18位数字）：^\d{15}|\d{}18$
// 验证一年的12个月：^(0?[1-9]|1[0-2])$ 正确格式为：“01”-“09”和“1”“12”
// 验证一个月的31天：^((0?[1-9])|((1|2)[0-9])|30|31)$ 正确格式为：01、09和1、31。
// 整数：^-?\d+$
// 非负浮点数（正浮点数 + 0）：^\d+(\.\d+)?$
// 正浮点数 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
// 非正浮点数（负浮点数 + 0） ^((-\d+(\.\d+)?)|(0+(\.0+)?))$
// 负浮点数 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
// 浮点数 ^(-?\d+)(\.\d+)?$