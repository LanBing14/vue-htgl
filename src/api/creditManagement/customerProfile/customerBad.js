import request from "@/utils/request";
import { fxb, upms } from "@/utils/variables";
import { stringify } from "qs";

// 获取企业分组
export function Api_GetCustomerGroup(params) {
    return request(`${fxb}/ecm/customer/archives/group`, {
        method: "get",
        params
    });
}

// 获取不良客户
export function Api_GetCustomerBad(params) {
    return request(`${fxb}/ecm/bad/customer/page`, {
        method: "get",
        params
    });
}

// 查看详情
export function Api_GetCustomerDetail(id) {
    return request(`${fxb}/ecm/bad/customer/${id}`, {
        method: "get"
    });
}

// 处理办法变更
export function Api_GetCustomerEdit(id, params) {
    return request(`${fxb}/ecm/bad/customer/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// 移出不良客户
export function Api_customerRemove(id, params) {
    return request(`${fxb}/ecm/bad/customer/${id}`, {
        method: "DELETE",
        params
    });
}

// 查看详情
export function Api_GetCustomerDetailHis(id) {
    return request(`${fxb}/ecm/bad/customer/history/${id}`, {
        method: "get"
    });
}

// 判断
export function Api_idDadCustomer(procInstId) {
    return request(`${upms}/processes/process-params/${procInstId}`, {
        method: "get"
    });
}

// 获取不良客户列入记录列表
export function Api_customerRecord(params) {
    return request(`${fxb}/ecm/bad/customer/record/${params.id}`, {
        method: "get"
    });
}

// 获取失信列入不良客户记录
export function Api_customerBroken(params) {
    return request(`${fxb}/ecm/bad/customer/broken/${params.id}`, {
        method: "get"
    });
}

// 获取经营异常列入不良客户记录
export function Api_customerOperation(params) {
    return request(`${fxb}/ecm/bad/customer/operation/${params.id}`, {
        method: "get"
    });
}

// 获取逾期天数超标记录
export function Api_customerOverdueDay(params) {
    return request(`${fxb}/ecm/bad/customer/overdue/day/${params.id}`, {
        method: "get"
    });
}

// 获取逾期金额超标记录
export function Api_customerOverdueMoney(params) {
    return request(`${fxb}/ecm/bad/customer/overdue/money/${params.id}`, {
        method: "get"
    });
}
