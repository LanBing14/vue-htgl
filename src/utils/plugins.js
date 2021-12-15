import { isIdCard } from './validate';
import {
    dateFormat,
    add,
    subtract,
    multiply,
    divide,
    getStyle,
    isObject,
    toMoney,
    turnMoney,
    lastMonth,
    currentMonth,
    gotoAssessmentDetail,
    gotoCustomerDetail,
    gotoContractDetail,
    gotoReceivablesDetail,
    gotoOrderDetail,
    gotoRecordsDetail,
    gotoShippingDetail,
    gotoInvoiceDetail,
    getOffset,
    isNull,
    isVip,
    vipExpireConfirm,
    deepCopy
} from './index';
import openLoading from './loading';

function createIdCardValidator(msg) {
    return function(rule, value, callback) {
        if (!isIdCard(value)) {
            callback(new Error(`${msg}不正确`));
        } else {
            callback();
        }
    };
}

export default {
    install(Vue) {
        // 添加实例方法
        // 创建表单验证规则
        Vue.prototype.$createRules = function({ msg = '', ...paramsRules }, trigger = 'change') {
            const defaultRules = {
                required: { required: true, message: `${msg}必填`, trigger },
                max: { max: 100, message: `${msg}最大长度为%s个字`, trigger },
                min: { max: 0, message: `${msg}最小长度为%s个字`, trigger },
                idCard: {
                    idCard: true,
                    validator: createIdCardValidator(msg),
                    trigger
                },
                phone: {
                    phone: true,
                    pattern: /^((\d{7,8})|(0\d{2,3}-\d{7,8})|(1[3|6|4|5|7|8|9]\d{9}))$/,
                    message: `${msg}不正确`,
                    trigger
                },
                mobile: {
                    phone: true,
                    pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                    message: `${msg}不正确`,
                    trigger
                },
                email: {
                    email: true,
                    type: 'email',
                    message: `${msg}不正确`,
                    trigger
                },
                isCode: {
                    isCode: true,
                    pattern: /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g,
                    message: `${msg}不正确`,
                    trigger
                },
                /**11位数字 */
                number11: {
                    number11: true,
                    pattern: /^\d{11}$/,
                    message: `${msg}必须为11位整数`,
                    trigger
                },
                cipint0: {
                    cipint0: true,
                    pattern: /^[1-9]\d*$/,
                    message: `${msg}必须为正整数`,
                    trigger
                },

                cipint1: {
                    cipint1: true,
                    pattern: /^[0-9]*$/,
                    message: `${msg}必须为数字`,
                    trigger
                },
                numberFloatUp: {
                    // 正数，两位小数
                    numberFloatUp: true,
                    pattern: /((^[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                    message: `${msg}必须为非负数，且最多有两位小数`,
                    trigger
                },
                numberFloat: {
                    // 数，两位小数
                    numberFloat: true,
                    pattern: /((^-?[1-9]\d*)|^0)(\.\d{1,2}){0,1}$/,
                    message: `${msg}最多有两位小数`,
                    trigger
                },
                numberTwo: {
                    // 0-100 两位小数
                    numberTwo: true,
                    pattern: /^(\d|[1-9]\d|100)(\.\d{1,2})?$/,
                    message: `${msg}必须为0-100，且最多有两位小数`,
                    trigger
                }
            };
            const rulesArr = [];

            Object.keys(paramsRules).map((key) => {

                if (defaultRules[key] && defaultRules[key].message && defaultRules[key].message.indexOf('%s') > 0) {
                    if (Number.isInteger(paramsRules[key])) {
                        defaultRules[key].message = defaultRules[key].message.replace('%s', paramsRules[key]);
                    } else {
                        defaultRules[key].message = defaultRules[key].message.replace('%s', defaultRules[key][key]);
                    }
                }
                const newRules = {
                    ...defaultRules[key],
                    [key]: paramsRules[key]
                };

                rulesArr.push(newRules);
            });
            return rulesArr;
        };
        // 时间格式化方法
        Vue.prototype.$dateFormat = dateFormat;
        // 打开loading层
        Vue.prototype.$openLoading = openLoading;
        // 加减乘除
        Vue.prototype.$add = add;
        Vue.prototype.$subtract = subtract;
        Vue.prototype.$multiply = multiply;
        Vue.prototype.$divide = divide;
        // 获取dom样式
        Vue.prototype.$getStyle = getStyle;
        // 检测变量是否是对象
        Vue.prototype.$isObject = isObject;
        // 将数字转换为金钱格式
        Vue.prototype.$toMoney = toMoney;
        Vue.prototype.$turnMoney = turnMoney;
        Vue.prototype.$lastMonth = lastMonth;
        Vue.prototype.$currentMonth = currentMonth;
        Vue.prototype.$gotoAssessmentDetail = gotoAssessmentDetail;
        Vue.prototype.$gotoCustomerDetail = gotoCustomerDetail;
        Vue.prototype.$gotoContractDetail = gotoContractDetail;
        Vue.prototype.$gotoReceivablesDetail = gotoReceivablesDetail;
        Vue.prototype.$gotoOrderDetail = gotoOrderDetail;
        Vue.prototype.$gotoRecordsDetail = gotoRecordsDetail;
        Vue.prototype.$gotoShippingDetail = gotoShippingDetail;
        Vue.prototype.$gotoInvoiceDetail = gotoInvoiceDetail;
        Vue.prototype.$getOffset = getOffset;
        Vue.prototype.$isNull = isNull;
        Vue.prototype.$isVip = isVip;
        Vue.prototype.$vipExpireConfirm = vipExpireConfirm
        Vue.prototype.$deepCopy = deepCopy
    }
};