import request from '@/utils/request';
import { fxb, ecm } from '@/utils/variables';


// 知识产权概览
export function Api_IntellectualProBasicInfo(companyId) {
	return request(`/enterprise/businessInformation/intellectualProBasicInfo/${companyId}`, {
		method: 'get'
	});
}

// 发明专利 列表
export function Api_InventionPatentPage(params) {
	return request(`/enterprise/businessInformation/inventionPatentPage`, {
		method: 'get',
		params
	});
}

// 发明专利 详情
export function Api_InventionPatentDetail(params) {
	return request(`/enterprise/businessInformation/inventionPatentDetail`, {
		method: 'get',
		params
	});
}

// 软著 列表
export function Api_SoftWorkPage(params) {
	return request(`/enterprise/businessInformation/softWorkPage`, {
		method: 'get',
		params
	});
}
// 软著 详情
export function Api_SoftWorkDetail(params) {
	return request(`/enterprise/businessInformation/softWorkDetail`, {
		method: 'get',
		params
	});
}
// 商标 列表
export function Api_TrademarkDetailsPage(params) {
	return request(`/enterprise/businessInformation/trademarkDetailsPage`, {
		method: 'get',
		params
	});
}
// 商标 详情
export function Api_TrademarkDetailsDetail(params) {
	return request(`/enterprise/businessInformation/trademarkDetailsDetail`, {
		method: 'get',
		params
	});
}

