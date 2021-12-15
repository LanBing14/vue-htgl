import request from '@/utils/request';
import { fxb, upms } from '@/utils/variables';

// 会员版本信息修改
export function Api_versionEdit(params) {
	return request(`${upms}/system/member/versions/edit`, {
		method: 'put',
		dataForm: true,
		params
	});
}

// 会员版本分页
export function Api_versionPage(params) {
	return request(`${upms}/system/member/versions/page`, {
		method: 'get',
		dataForm: true,
		params
	});
}

// 产品定价-产品信息
export function Api_versionProducts(params) {
	return request(`${upms}/system/member/versions/products`, {
		method: 'get',
		dataForm: true,
		params
	});
}

// 购买套餐/开通会员
export function Api_versionOrder(params) {
	return request(`${upms}/system/member/versions/version-order`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 会员功能授权
export function Api_versionPermissions(id, params) {
	return request(`${upms}/system/member/versions/${id}/permissions`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 查询会员菜单权限树
export function Api_versionPermissionsG(id, params) {
	return request(`${upms}/system/member/versions/${id}/permissions`, {
		method: 'get',
		dataForm: true,
		params
	});
}

// 会员信息
export function Api_getMemberInfos(params) {
	return request(`${upms}/system/member/versions/getMemberInfos`, {
		method: 'get',
		dataForm: true,
		params
	});
}

// 会员续费
export function Api_versionRenewalOrder(params) {
	return request(`${upms}/system/member/versions/version-renewal-order`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 会员升级
export function Api_versionUpgradeOrder(params) {
	return request(`${upms}/system/member/versions/version-upgrade-order`, {
		method: 'post',
		dataForm: true,
		params
	});
}
