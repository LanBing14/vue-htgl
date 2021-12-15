import request from '@/utils/request';
import { fxb } from '@/utils/variables';
import { stringify } from 'qs';

// 获取监测列表数据
export function Api_GetMonitorList(params) {
	return request(`${fxb}/ecm/company-monitor/page`, {
		method: 'get',
		params
	});
}
// 添加监测
export function Api_AddMonitorInfo(params) {
	return request(`${fxb}/ecm/company-monitor`, {
		method: 'post',
		dataForm: true,
		params
	});
}
// 变更分组
export function Api_EditMonitorInfo(id, params) {
	return request(`${fxb}/ecm/company-monitor/${id}`, {
		method: 'patch',
		dataForm: true,
		params
	});
}
// 动态接收设置
export function Api_SetMonitorInfo(id, params) {
	return request(`${fxb}/ecm/company-monitor/${id}`, {
		method: 'post',
		dataForm: true,
		params
	});
}
// 动态接收设置列表
export function Api_GetReceiverList(id) {
	return request(`${fxb}/ecm/company-monitor/receiver/${id}`, {
		method: 'get'
	});
}
// 移除监测
export function Api_DelMonitorList(id, params) {
	return request(`${fxb}/ecm/company-monitor/${id}`, {
		method: 'delete',
		params
	});
}

// 动态监测列表
export function Api_GetDynamicList(params) {
	return request(`${fxb}/ecm/company-monitor/dynamic/page`, {
		method: 'get',
		params
	});
}

// 舆情订阅列表
export function Api_GetSubscribeList() {
	return request(`${fxb}/ecm/dynamic-public-sentiment/subscribe`, {
		method: 'get'
	});
}
// 舆情订阅退订
export function Api_GetSubscribeDle(id) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/subscribe/${id}`, {
		method: 'delete'
	});
}
// 舆情订阅订阅
export function Api_GetSubscribeAdd(params) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/subscribe`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 舆情动态分页列表
export function Api_GetSentimentList(params) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/user-news`, {
		method: 'get',
		params
	});
}
// 新闻舆情-新闻列表
export function Api_GetNewsList(id, params) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/news/${id}`, {
		method: 'get',
		params
	});
}
// 新闻舆情-关联企业top10
export function Api_GetTopList(params) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/ref-company-top`, {
		method: 'get',
		params
	});
}

// 新闻舆情-新闻详情
export function Api_GetNewsInfo(id) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/news-info/${id}`, {
		method: 'get'
	});
}

// 监测动态-文书详情
export function Api_GetDocumentInfo(id, params) {
	return request(`${fxb}/ecm/dynamic-public-sentiment/document-info/${id}`, {
		method: 'get',
		params
	});
}

export function Api_GetRiskItems() {
	return request(`${fxb}/ecm/company-monitor/risk/list`, {
		method: 'get'
	});
}
