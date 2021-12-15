import request from '@/utils/request';
import { fxb } from '@/utils/variables';

// 款记录管理列表
export function Api_collectionRecordPage(params) {
	return request(`${fxb}/ecm/collection-record/page`, {
		method: 'get',
		params
	});
}

// 款记录管理条数统计
export function Api_collectionRecordCount(params) {
	return request(`${fxb}/ecm/collection-record/count`, {
		method: 'get',
		params
	});
}

// 根据客户选择应收编码
export function Api_getPayPlanCode(params) {
	return request(`${fxb}/ecm/payment/getPayPlanCode`, {
		method: 'get',
		params
	});
}

// 根据应收编码获取-当前应收账款及已收账款情况
export function Api_getCurrentReceivableAccounts(id) {
	return request(`${fxb}/ecm/payment/getCurrentReceivableAccounts/${id}`, {
		method: 'get'
	});
}

// 收款登记-保存/提交
export function Api_paymentSave(id, params) {
	return request(`${fxb}/ecm/payment/${id}`, {
		method: 'post',
		params
	});
}

// 收款登记-删除
export function Api_paymentDelete(id, params) {
	return request(`${fxb}/ecm/collection-record/delete/${id}`, {
		method: 'delete',
		params
	});
}

// 收款登记-保存详情
export function Api_paymentReview(id, params) {
	return request(`${fxb}/ecm/payment/findPayRegister/${id}`, {
		method: 'get',
		params
	});
}

// 核销-保存
export function Api_cancellationSave(id, params) {
	return request(`${fxb}/ecm/payment/saveCancellation/${id}`, {
		method: 'post',
		params
	});
}

// 核销-提交
export function Api_cancellationSubmit(id, params) {
	return request(`${fxb}/ecm/payment/cancellation/${id}`, {
		method: 'post',
		params
	});
}

// 核销-回显
export function Api_queryCancellation(registersId, params) {
	return request(`${fxb}/ecm/payment/queryCancellation/${registersId}`, {
		method: 'get',
		params
	});
}

// 收款记录详情
export function Api_collectionRcordDetails(id) {
	return request(`${fxb}/ecm/payment/collectionRcordDetails/${id}`, {
		method: 'get'
	});
}

// 现金折扣方案不分页列表
export function Api_moneyDiscountList(params) {
	return request(`${fxb}/ecm/credit/money/discount/list`, {
		method: 'get',
		params
	});
}

// 获取折扣率
export function Api_getDiscountPer(params) {
	return request(`${fxb}/ecm/payment/getDiscountPer`, {
		method: 'get',
		params
	});
}
