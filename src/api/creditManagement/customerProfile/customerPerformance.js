import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";
import { stringify } from "qs";

// 获取企业分组
export function Api_GetCustomerGroup(params) {
    return request(`${fxb}${ecm}/customer/archives/group`, {
        method: "get",
        params
    });
}

// 客户履约列表
export function Api_GetPerformList(params) {
    return request(`${fxb}${ecm}/company/perform/page`, {
        method: "get",
        params
    });
}

// 应收账款明细
export function Api_GetDetail(params) {
    return request(`${fxb}${ecm}/company/perform/page/${params.id}`, {
        method: "get"
    });
}
export function Api_NewGetDetail(id) {
    return request(`${fxb}${ecm}/payment/tracking/page/${id}`, {
        method: "get"
    });
}

// 列入不亮客户
export function Api_AddBadCustomer(id, params) {
    return request(`${fxb}${ecm}/bad/customer/${id}`, {
        method: "post",
        params
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // params: stringify(params, { indices: false })
    });
}

// 列入不良客户 - 非履约
export function Api_AddBadCustomerNormal(params) {
    return request(`${fxb}${ecm}/bad/customer/manual`, {
        method: "post",
        params
    });
}
