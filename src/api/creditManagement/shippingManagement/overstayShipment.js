import request from '@/utils/request';
import { fxb, ecm } from '@/utils/variables';

// 列表
export function Api_specialSendList(params) {
	return request(`${fxb}/ecm/special/send/page`, {
		method: 'get',
		params
	});
}

// 数量
export function Api_specialSendCount(params) {
	return request(`${fxb}/ecm/special/send/count`, {
		method: 'get',
		params
	});
}

// 选择订单
export function Api_specialSendContract(params) {
	return request(`${fxb}/ecm/special/send/contract/${params.customerId}`, {
		method: 'get',
		params
	});
}

// 新增
export function Api_specialSendSubmit(params) {
	return request(`${fxb}/ecm/special/send`, {
		method: 'post',
		params
	});
}

// 编辑
export function Api_specialSendEdit(id, params) {
	return request(`${fxb}/ecm/special/send/${id}`, {
		method: 'put',
		params
	});
}

// 获取是否不良客户数据
export function Api_specialSendBad(companyId, params) {
	return request(`${fxb}/ecm/special/send/bad/customer/${companyId}`, {
		method: 'get',
		params
	});
}

// 详情
export function Api_specialSendDetail(id, params) {
	return request(`${fxb}/ecm/special/send/${id}`, {
		method: 'get',
		params
	});
}
