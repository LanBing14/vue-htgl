import request from "@/utils/request"
import { fxb, ecm } from '@/utils/variables'
// 获取初始化树形结构
export function Api_EvaluateEstimateKpiInitTree() {
    return request(`${fxb}${ecm}/evaluate/estimate/super`, {
        method: 'post'
    })
}
// 获取指标分类树形结构
export function Api_EvaluateEstimateTree() {
    return request(`${fxb}${ecm}/evaluate/estimate/tree`, {
        method: 'get'
    })
}

// 获取模态框树形结构
export function Api_EvaluateEstimateKpiTree() {
    return request(`${fxb}${ecm}/evaluate/estimate/kpi/tree`, {
        method: 'get'
    })
}



// 评估指标分类——新增接口
export function Api_EvaluateEstimateClassifyAdd(params) {
    return request(`${fxb}${ecm}/evaluate/estimate/classify`, {
        method: 'post',
        params
    })
}
// 评估指标分类——修改接口
export function Api_EvaluateEstimateClassifyUpdate(id, params) {
    return request(`${fxb}${ecm}/evaluate/estimate/classify/${id}`, {
        method: 'put',
        params
    })
}

// 评估指标分类——删除接口
export function Api_EvaluateEstimateClassifyDelete(id) {
    return request(`${fxb}${ecm}/evaluate/estimate/classify/${id}`, {
        method: 'delete'
    })
}

// 评估指标——新增接口
export function Api_EvaluateEstimateQuotaAdd(params) {
    return request(`${fxb}${ecm}/evaluate/estimate/quota`, {
        method: 'post',
        params
    })
}

// 评估指标——修改接口
export function Api_EvaluateEstimateQuotaUpdate(id, params) {
    return request(`${fxb}${ecm}/evaluate/estimate/quota/${id}`, {
        method: 'put',
        params
    })
}

// 评估指标——删除接口
export function Api_EvaluateEstimateQuotaDelete(id) {
    return request(`${fxb}${ecm}/evaluate/estimate/quota/${id}`, {
        method: 'delete'
    })
}

// 评估指标删除接口-判断指标是否被模型使用
export function Api_EvaluateEstimateIsUse(id) {
    return request(`${fxb}${ecm}/evaluate/estimate/is-use/${id}`, {
        method: 'get'
    })
}
