import request from '@/utils/request';
import { fxb, upms } from '@/utils/variables';

// 获取物业报修列表
export function Api_getRepairList(params) {
	return request(`/park/repair/page`, {
		method: 'get',
		params: params
	});
}
// 物业报修查看
export function Api_getRepairDetail(id) {
	return request(`/park/repair/info/${id}`, {
		method: 'get'
	});
}

//访客预约
export function Api_getVistorList(params) {
	return request(`/park/visitor/page`, {
		method: 'get',
        params: params
	});
}

//访客数量
export function Api_getVistorNum() {
	return request(`/park/visitor/count`, {
		method: 'get'
	});
}

// 访客预约详情
export function Api_getVistorDetail(id) {
	return request(`/park/visitor/detail/${id}`, {
		method: 'get'
	});
}

// 获取装修服务列表
export function Api_getDecorationList(params) {
	return request(`/park/decoration/page`, {
		method: 'get',
		params: params
	});
}
// 物装修服务撤销
export function Api_getDecorationDelete(id) {
	return request(`/park/decoration/delete/${id}`, {
		method: 'delete'
	});
}
// 物装修服务 查看
export function Api_getDecorationDetail(id) {
	return request(`/park/decoration/detail/${id}`, {
		method: 'get'
	});
}

// 装修服务里面 获取所在项目
export function Api_getBusiness(params) {
	return request(`/park/decoration/getBusiness`, {
		method: 'get',
		params: params
	});
}
// 企业管理绑定列表
export function Api_gusersAudit(params) {
	return request(`/upms/system/usersAudit/page`, {
		method: 'get',
		params: params
	});
}
// 企业绑定 驳回/审核
export function Api_usersAudit(id,status,params) {
	return request(`/upms/system/usersAudit/audit/${id}/${status}`, {
		method: 'patch',
		params
	});
}
// 获取所有部门
export function Api_getDepartmen() {
	return request(`/upms/system/departments/getDepartment`, {
		method: 'get'
	});
}

// 取消预约
export function Api_cancel(id) {
	return request(`/park/visitor/cancel/${id}`, {
		method: 'delete'
	});
}
