import request from '@/utils/request';
import { upms, cauth } from '@/utils/variables';
import { getToken } from '@/utils/auth';

// 账号密码登录
export function Api_LoginByUsername(params) {
	return request('/cauth/oauth/token', {
		method: 'post',
		headers: {
			Authorization: 'Basic YXBwOmFwcA=='
		},
		dataForm: true,
		params
	});
}
// 短信验证码登录
export function Api_LoginByMsg(params) {
	return request('/cauth/oauth/token', {
		method: 'post',
		headers: {
			Authorization: 'Basic YXBwOmFwcA=='
		},
		dataForm: true,
		params
	});
}

// 忘记密码
export function Api_forgetPwd(params) {
	return request(`${upms}/system/users/password-set`, {
		method: 'post',
		dataForm: true,
		headers: {
			Authorization: ''
		},
		params
	});
}

// 用户信息
export function Api_UserSelfInfo(params) {
	return request(`${upms}/system/users/self`, {
		method: 'get',
		params: params
	});
}

// 设置新密码接口
export function Api_SetNewPwd(params) {
	return request('/user/center/fxbRest/setNewPwd', {
		method: 'post',
		params: params
	});
}
// 获取菜单
export function Api_GetMenus(saasCode) {
	return request(`${upms}/system/users/menus`, {
		method: 'get',
		params: {
			saasCode,
			roleType: 1
		}
	});
}
// 退出登录
export function Api_Logout() {
	return request(`${cauth}/token`, {
		method: 'delete',
		dataForm: true,
		params: {
			accessToken: getToken()
		}
	});
}

// 验证码地址
export function Api_getKaptcha() {
	return `${process.env.VUE_APP_BASE_API}${cauth}/auth/kaptcha/`;
}
