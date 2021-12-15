import request from '@/utils/request'
import { fxb } from '@/utils/variables'

// 模糊搜索企业 合同管理详情
export function Api_CompanySearch(params) {
    return request('/fxb/enterprise-search/list', {
        method: 'get',
        params: params
    })
}

// 监管企业 {companyId: companyId}
export function Api_CreditRepairSave(params) {
    return request('/user/center/fxbCreditRepairApplication/save', {
        method: 'post',
        params: params
    })
}

// 获取行政处罚信息
export function Api_GetDetailOperationPenalt(params) {
    return request('/enterprise/detail/fxbRest/baseMsg/getDetailOperationPenaltyByPageCreditChina', {
        method: 'post',
        params: params
    })
}

// 保存行政处罚信息
export function Api_SaveCredit(params) {
    return request('/user/center/fxbCreditRepairApplication/save', {
        method: 'post',
        params: params
    })
}

// 获取行政处罚信息详情
export function Api_GetDetailOperationPenaltByCreditChina(params) {
    return request('/enterprise/detail/fxbRest/baseMsg/getDetailOperationPenaltyCreditChina', {
        method: 'post',
        params: params
    })
}

// 获取行政处罚信息详情
export function Api_GetTreeList(params) {
    return request('/user/center/fxbRegion/getTreeList', {
        method: 'get',
        params: params
    })
}

// 获取行政处罚信息详情
export function Api_GetTrainInfoList(params) {
    return request('/user/center/fxbCreditRepairTrain/getList', {
        method: 'get',
        params: params
    })
}
// 信用修复报告列表接口
export function Api_GetReportList(params) {
    return request(`${fxb}/credit-report/report-list`, {
        method: 'get',
        params: params
    })
}

// 信用修复报告列表接口
export function Api_GetPageList(params) {
    return request('user/center/fxbCreditRepairTrain/getPageList', {
        method: 'get',
        params: params
    })
}
