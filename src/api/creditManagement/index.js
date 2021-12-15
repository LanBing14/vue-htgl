import request from '@/utils/request';
import { fxb, upms } from '@/utils/variables';

// 模糊搜索客户列表
export function Api_CustomerGetCustomerList(companyName) {
	return request(`${fxb}/ecm/customer/credit/customer`, {
		method: 'get',
		params: {
			companyName
		}
	});
}

// 获取当前企业下所有用户
export function Api_RecordUser() {
	return request(`${upms}/system/users/saas/list`, {
		method: 'get'
	});
}

// 获取图表模型
export function Api_EchartsModelDetail(id) {
	return request(`${upms}/chart/charts/model/${id}`, {
		method: 'get'
	});
}

// 发货登记、延长到期日、收款登记、开票申请点击时验证
export function Api_judgeOperateAccess(id) {
	return request(`${fxb}/ecm/contract-order-manage/judge-operate-access/${id}`, {
		method: 'get'
	});
}

// 首页
// 区域排名
export function Api_analysisResultsMap(date, params) {
	return request(`${fxb}/ecm/index/analysis/results/map/${date}`, {
		method: 'get',
		params
	});
}

// 区域排名
export function Api_analysisResultsArea(date, params) {
	return request(`${fxb}/ecm/index/analysis/results/area/${date}`, {
		method: 'get',
		params
	});
}

// 趋势分析
export function Api_analysisResultsTrend(date, params) {
	return request(`${fxb}/ecm/index/analysis/results/trend/${date}`, {
		method: 'get',
		params
	});
}

// 行业对比 按指数
export function Api_analysisResultsWork(date, params) {
	return request(`${fxb}/ecm/index/analysis/results/work/${date}`, {
		method: 'get',
		params
	});
}

// 行业对比 按趋势
export function Api_analysisResultsWorkTrend(date, params) {
	return request(`${fxb}/ecm/index/analysis/results/work/trend/${date}`, {
		method: 'get',
		params
	});
}

// 违约风险指数最新数据的月份
export function Api_analysisResultsMonth() {
	return request(`${fxb}/ecm/index/analysis/results/month`, {
		method: 'get'
	});
}
