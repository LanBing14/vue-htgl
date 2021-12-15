import request from '@/utils/request'
import { fxb, ecm } from "@/utils/variables";

// 这里是监测概览所有的接口


// 监测动态统计
export function Api_GetmonitoringDy(query) {
    return request(`${fxb}${ecm}/company-monitor/monitoringDynamics`, {
        method: 'get',
        params: query
    })
}


// 负面信息分布
export function negativeInformation(query) {
    return request("/fxb/ecm/company-monitor/negativeMessage", {
        method: 'get',
        params: query
    })
}



// 监测企业排行
export function companyRank(query) {
    return request("/fxb/ecm/company-monitor/companyRank", {
        method: 'get',
        params: query
    })
}


// 风险趋势分析
export function getRiskTrend(query) {
    return request("/fxb/ecm/company-monitor/riskTrendAnalysis", {
        method: 'get',
        params: query
    })
}

// 预警趋势分析
export function getWarningTrend(query) {
    return request("/fxb/ecm/company-monitor/warningTrendAnalysis", {
        method: 'get',
        params: query
    })
}