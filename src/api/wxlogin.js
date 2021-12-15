import request from '@/utils/request'
import { upms, fxb, ecm } from "@/utils/variables";

// 微信登录接口
export function Api_wxloginoauth2() {
    return request(`/cauth/wx/oauth2`, {
        method: 'get',
    })
}


export function Api_wxlogin(params) {
    return request(`/cauth/wx/callback`, {
        method: 'get',
        params
    })
}


// 微信手机号认证
export function Api_wxloginPhone(params) {
    return request(`/cauth/wx/validPhoneCode`, {
        method: 'get',
        params
    })
}



export function Api_wxSaveUserUnionId(params) {
    return request(`/cauth/wx/saveUserUnionId`, {
        method: 'post',
        params
    })
}

