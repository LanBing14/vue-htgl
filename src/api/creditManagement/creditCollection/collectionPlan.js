import request from "@/utils/request";
import {fxb, ecm} from '@/utils/variables';

// 催收方案设置列表
export function Api_CollectionPlanPage(params) {
    return request(`${fxb}${ecm}/collection/page`, {
        method: 'get',
        params
    });
}

// 催收方案新增
export function Api_CollectionPlanAdd(params) {
    return request(`${fxb}${ecm}/collection`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 催收方案修改
export function Api_CollectionPlanUpdate(id, params) {
    return request(`${fxb}${ecm}/collection/${id}`, {
        method: 'put',
        dataForm: true,
        params
    });
}

// 催收方案删除
export function Api_CollectionPlanDelete(id) {
    return request(`${fxb}${ecm}/collection/${id}`, {
        method: 'delete'
    });
}

// 催收方案启用、禁用
export function Api_CollectionPlanDisabled(status, id) {
    return request(`${fxb}${ecm}/collection/status/${id}`, {
        method: 'patch',
        dataForm: true,
        params: {
            status
        }
    });
}
// 催收方案详情
export function Api_CollectionPlanDetail(id) {
    return request(`${fxb}${ecm}/collection/${id}`, {
        method: 'get'
    });
}

// 催收方案模板列表
export function Api_CollectionPlanModel() {
    return request(`${fxb}${ecm}/collection/model`, {
        method: 'get'
    });
}

// 催收方案模板新增
export function Api_CollectionPlanModelAdd(params) {
    return request(`${fxb}${ecm}/collection/model`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 催收方案模板新增
export function Api_CollectionPlanModelUpdate(id, params) {
    return request(`${fxb}${ecm}/collection/model/${id}`, {
        method: 'put',
        dataForm: true,
        params
    });
}

// 催收函模板删除
export function Api_CollectionPlanModelDelete(id) {
    return request(`${fxb}${ecm}/collection/model/${id}`, {
        method: 'delete'
    });
}
