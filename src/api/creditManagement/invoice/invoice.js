import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";
import {stringify} from "qs";

// 获取发票管理列表
export function Api_GetInvoiceList(params) {
    return request(`${fxb}${ecm}/contract-invoice/page`, {
        method: "get",
        params
    });
}
// 点击开票获取信息
export function Api_GetInvoiceInfo(contractId) {
    return request(`${fxb}${ecm}/contract-invoice/${contractId}`, {
        method: "get"
    });
}
// 点击开票获取信息编辑
export function Api_GetInvoiceInfoEdit(invoiceId) {
    return request(`${fxb}${ecm}/contract-invoice/apply/${invoiceId}`, {
        method: "get"
    });
}
// 开票申请
export function Api_ApplyInvoice(params) {
    return request(`${fxb}${ecm}/contract-invoice/apply`, {
        method: "post",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        params: stringify(params, { indices: false })
        // params
    });
}
// export function Api_NewApplyInvoice(params) {
//     return request(`${fxb}${ecm}/contract-invoice/addition`, {
//         method: "post",
//         dataForm: true,
//         params
//     });
// }
// 开票详情
export function Api_GetInvoiceDetail(contractId) {
    return request(`${fxb}${ecm}/contract-invoice/detail/${contractId}`, {
        method: "get"
    });
}
// 获取发票抬头
export function Api_GetInvoiceTitle(id) {
    return request(`${fxb}${ecm}/contract-invoice/archives/${id}`, {
        method: "get"
    });
}
// 发票抬头详情
export function Api_GetInvoiceTitleDetail(id) {
    return request(`${fxb}${ecm}/customer/archives/archive/${id}`, {
        method: "get"
    });
}
