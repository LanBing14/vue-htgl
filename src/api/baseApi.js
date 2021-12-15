import request from "../utils/request";
import { upms, fs } from "@/utils/variables";

// 用户中心
const userCenter = "/user/center/";
// 企业详情
const enterpriseDetail = "/enterprise/detail/";

// 用户接口
export function userRequest(params, method, url) {
    return request(userCenter + url, {
        method: method,
        params: params
    });
}

// 图片接口
export function userPicture(params) {
    return request(`${fs}/fs/attachments/baseImage/0`, {
        method: 'post',
        params
    });
}

// 企业接口
export function enterpriseRequest(params, method, url) {
    return request(enterpriseDetail + url, {
        method: method,
        params: params
    });
}

// 获取用户所有消息
export function Api_GetCompanyInfoById(params) {
    return request("/user/center/fxbRest/getCompanyInfoById", {
        method: "get",
        params: params
    });
}

/* 以下为全局接口定义*/

// 文件上传
export function Api_upload(url, file) {
    return request(url, {
        method: "post",
        params: file
    });
}
// 附件上传的基础地址
export function Api_fileUrl() {
    return `${fs}/fs/attachments/`;
}

export function Api_fileUrl1() {
    return `${process.env.VUE_APP_BASE_API}${fs}/fs/attachments/`;
}
// 文件上传（CP）
export function Api_uploadCP(url, file, onUploadProgress) {
    return request(url, {
        method: "post",
        params: file,
        onUploadProgress
    });
}

// 查询字典select数据
export function Api_ComboboxDict(dictCode, exValue) {
    return request(`${upms}/combobox/${dictCode}`, {
        method: "get",
        params: {
            exValue
        }
    });
}

// 查询saas组合框
export function Api_Saas() {
    return request(`${upms}/system/saas`, {
        method: "get"
    });
}

// 查询数据权限名称清单
export function Api_GetDataAccessName() {
    return request(`/combobox/data-access-name/list`, {
        method: "get"
    });
}

// 查询字典表
export function Api_GetDicts(groupKey) {
    return request("/user/center/xhsRest/common/getDicts", {
        method: "get",
        params: {
            groupKey
        }
    });
}

/**
 * 下载文件
 * @param path 文件路径
 */
export function Api_DownloadFileByPath(path) {
    window.open(process.env.VUE_APP_BASE_API + "/user/center/file/downloadByPath?path=" + path, "_blank");
}

export function Api_PhoneExist(params) {
    return request("/user/center/fxbRest/fxbPhoneExist", {
        method: "get",
        params: params
    });
}

// 发送手机短信，加图形验证码校验
export function Api_Send(params) {
    return request("/cauth/auth/sms/code-kaptcha-check", {
        method: "get",
        headers: {
            Authorization: ""
        },
        params: params
    });
}

// 发送手机短信，加图形验证码校验
// export function Api_Send2(params) {
//     return request('/user/center/xhsRest/getSmsCode', {
//         method: 'get',
//         params: params
//     })
// }
// 获取短信验证码
export function Api_Send2(params) {
    return request("/cauth/auth/sms/code", {
        method: "get",
        headers: {
            Authorization: ""
        },
        params: params
    });
}
//获取短信验证码并校验手机号
export function Api_Send3(params) {
    return request(`${upms}/system/users/code`, {
        method: "get",
        params: params
    });
}

// 查询角色组合框
export function Api_RolesCombobox(params) {
    return request(`${upms}/system/roles/combobox`, {
        method: "get",
        params
    });
}

// 根据名称或着用户名获取同域下有效用户
export function Api_UsersConditionList(params) {
    return request(`${upms}/system/users/saas/conditionList`, {
        method: "get",
        params
    });
}

// 用户标记被引导
export function Api_MarkGuided(id) {
    return request(`${upms}/system/users/markGuided/${id}`, {
        method: "patch",
        params: { id }
    });
}

// 查询字典select数据
export function Api_comboboxDict(dictCode, ser = upms, exValue) {
    return request(`${ser}/combobox/${dictCode}`, {
        method: "get",
        params: {
            exValue
        }
    });
}