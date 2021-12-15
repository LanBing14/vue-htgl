import request from '@/utils/request';
import {stringify} from 'qs';
import {upms, fs} from '@/utils/variables';

// 保存用户信息
export function Api_UpdateUserInfo(params) {
    return request(`${upms}/system/users/self`, {
        method: 'patch',
        dataForm: true,
        params
    });
}

// 修改密码
export function Api_ChangePwd(params) {
    return request(`${upms}/system/users/password`, {
        method: 'patch',
        params: params
    });
}

// 修改手机号
export function Api_EditPhoneNo(params) {
    return request(`${upms}/system/users/mobile`, {
        method: 'post',
        dataForm: true,
        params
    });
}
//校验企业是否存在于大数据中
export function Api_checkCompanyName(params) {
    return request(`${upms}/system/users/getCompany`, {
        method: 'get',
        params
    });
}
export function Api_checkCompanyId(id) {
    return request(`/fxb/ecm/credit/repair/company/${id}`, {
        method: 'get'
    });
}
//校验企业是否被验证过
export function Api_checkCompanyIsCheck(params) {
    return request(`/fxb/enterprise-cert/checkCompanyCert`, {
        method: 'get',
        params
    });
}
//提交信用修复
export function Api_checkCompanyRepair(params) {
    return request(`/fxb/ecm/credit/repair`, {
        method: 'post',
        dataForm: true,
        params
    });
}
// 注册用户
export function Api_RegisterFxbUser(params) {
    return request(`${upms}/system/users/register`, {
        method: 'post',
        dataForm: true,
        headers: {
            'Authorization': ''
        },
        params
    });
}

// 手机登录
export function Api_byPhone(params) {
    return request('/cauth/oauth/token', {
        method: 'post',
        dataForm: true,
        headers: {
            'Authorization': 'Basic YXBwOmFwcA=='
        },
        params
    });
}

// 判断手机号是否被注册了
export function Api_IsPhoneUsed(params) {
    return request('/user/center/xhsRest/isPhoneUsed', {
        method: 'get',
        params: params
    });
}

/**
 * 判断选中的企业是否已认证
 * 1是已认证
 */
export function API_GetStatusByCompanyId(params) {
    return request('/enterprise/detail/enterprise/certification/getStatusByCompanyId', {
        method: 'get',
        params: params
    });
}

// 获取当前用户的企业认证状态
export function API_GetInfoByCurrentUser(params) {
    return request('/enterprise/detail/enterprise/certification/getInfoByCurrentUser', {
        method: 'get',
        params: params
    });
}

// 保存企业认证
export function API_SaveEnterpriseCertification(params) {
    // return request('/enterprise/detail/enterprise/certification/saveCertification', {
    return request('/fxb/enterprise-cert', {
        method: 'post',
        // params: params
        dataForm: true,
        params
    });
}

// 获取最近企业认证历史
export function API_EnterpriseCertHistory() {
    return request(`/fxb/enterprise-cert/latest-history`, {
        method: 'get'
    });
}

