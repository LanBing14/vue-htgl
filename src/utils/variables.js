// 纯提示性文字
export const wordTips = {
    drawerLeaveTip: "离开页面会丢失当前编辑的内容，确定要离开吗？"
};
// 正则规则
export const patterns = {
    phone: /^((\d{7,8})|(0\d{2,3}-\d{7,8})|(1[3|4|5|6|7|8|9]\d{9}))$/, // 电话号，包括手机各座机
    mobile: /^1[3|4|5|6|7|8|9]\d{9}$/, // 手机号
    // 电子邮箱正则表达式
    email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    cipint1: /^[0-9]*$/, // 正整数
    z0: /^[a-zA-Z0-9]*$/, // 英文和数字
    a0cn: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 大小写字母、数字、中文
    EXP_ENG_NUM: /^[A-Za-z0-9]+$/, // 允许大小写字母和数字
    EXP_ENG_NUM_0: /^[A-Za-z0-9\-]+$/, // 允许大小写字母、数字和“-”
    EXP_ENG_NUM_1: /^[a-zA-z0-9_]+$/, // 允许大小写字母、数字和“_”
    EXP_ENG_NUM_2: /^[A-Za-z0-9_\-]+$/, // 允许大小写字母、数字、“_”和“-”
    EXP_ENG_NUM_3: /^[A-Za-z0-9_\-\,\(\)]+$/, // 允许大小写字母、数字、“_”、“-”“,”和“()”
    EXP_ENG_NUM_4: /^[A-Za-z0-9_\-\(\)]+$/, // 允许大小写字母、数字、“_”、“-”和“()”
    numberFloat2: /^-?(100|(([1-9]\d|\d)(\.\d{1,2})?))$/ // 可以有两位小数的正数
};
// 允许大小写字母和数字
// String EXP_ENG_NUM = "^[A-Za-z0-9]+?";
//
// //允许大小写字母、数字和“-”
// String EXP_ENG_NUM_0 = "^[A-Za-z0-9\\-]+?";
//
// //允许大小写字母、数字和“_”
// String EXP_ENG_NUM_1 = "^[A-Za-z0-9_]+?";
//
// //允许大小写字母、数字、“_”和“-”
// String EXP_ENG_NUM_2 = "^[A-Za-z0-9_\\-]+?";
//
// //联系方式允许格式:13888888888、88888888或010-88888888
// String EXP_PHONE = "^((1[0-9]{2})+\\d{8})|((\\d{3,4}-?)?\\d{7,9}))?$";
//
// //手机号码允许格式:13888888888
// String EXP_MOBILE = "^((1[0-9]{2})+\\d{8})?$";
//
// //邮箱允许格式：xxx@xx.com
// String EXP_MAIL = "^([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)?$";

// api接口模块前辍
const apiFlag = process.env.VUE_APP_BASE_API === "/zuul";
export const fxb = apiFlag ? "/fxb" : "";
export const ecm = apiFlag ? "/ecm" : "";
export const upms = apiFlag ? "/upms" : "";
export const m = apiFlag ? "/m" : "";
export const quartz = apiFlag ? "/quartz" : "";
export const cms = apiFlag ? "/cms" : "";
export const fs = apiFlag ? "/fs" : "";
export const cauth = apiFlag ? "/cauth" : "";