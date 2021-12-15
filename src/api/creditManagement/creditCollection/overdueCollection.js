import request from "@/utils/request";
import {fxb, ecm} from '@/utils/variables';

// 逾期 催收列表分页数据
export function Api_CollectionOverduePage(params) {
    return request(`${fxb}${ecm}/collection/collection/page/0`, {
        method: 'get',
        params
    });
}

// 逾期催收登记
export function Api_CollectionOverdue(id, params) {
    return request(`${fxb}${ecm}/collection/overdue/${id}`, {
        method: 'post',
        params
    });
}
// 获取 催收类型下拉
export function Api_CollectionOverdueType() {
    return request(`${fxb}${ecm}/collection/type/0`, {
        method: 'get'
    });
}

// 生成催收函
export function Api_CollectionOverduePdf(id, params) {
    return request(`${fxb}${ecm}/collection/pdf/${id}`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 生成催收函--保存
export function Api_CollectionOverdueSave(id, params) {
    return request(`${fxb}${ecm}/collection/pdf/${id}`, {
        method: 'put',
        dataForm: true,
        params
    });
}

// 生成催收函--提交
export function Api_CollectionOverdueSubmit(id, params) {
    return request(`${fxb}${ecm}/collection/pdf/${id}`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 催收函--详情
export function Api_CollectionOverdueDetail(id) {
    return request(`${fxb}${ecm}/collection/text/${id}`, {
        method: 'get'
    });
}

// 获取待处理数量
export function Api_CollectionCollectionCount(type) {
    return request(`${fxb}${ecm}/collection/collection/count/${type}`, {
        method: 'get'
    });
}
