import request from "@/utils/request";
import {fxb, ecm} from '@/utils/variables';

// 获取催收总览详情分页列表
export function Api_CollectionOverviewPage(params) {
    return request(`${fxb}${ecm}/collection/total/page`, {
        method: 'get',
        params
    });
}
// 获取催收总览详情分页列表
export function Api_CollectionOverviewDetail(params) {
    return request(`${fxb}${ecm}/collection/total/detail`, {
        method: 'get',
        params
    });
}

// 催收总览-获取逾期账款明细分页列表
export function Api_CollectionOverviewOverdue(params) {
    return request(`${fxb}${ecm}/collection/total/detail/overdue`, {
        method: 'get',
        params
    });
}

// 催收总览-获取催收登记情况
export function Api_CollectionOverviewCollection(params) {
    return request(`${fxb}${ecm}/collection/total/detail/collection`, {
        method: 'get',
        params
    });
}
// 催收总览-催收期间逾期收款情况
export function Api_CollectionOverviewPay(params) {
    return request(`${fxb}${ecm}/collection/total/detail/pay`, {
        method: 'get',
        params
    });
}
