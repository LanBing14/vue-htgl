import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 获取发票跟踪列表
export function Api_GetTrackingList(params) {
    return request(`${fxb}${ecm}/invoice-follow/page`, {
        method: "get",
        params
    });
}
// 点击发票登记、发票领取、发票签收
export function Api_GetInvoiceTrackingInfo(invoiceId, status) {
    return request(`${fxb}${ecm}/invoice-follow/${invoiceId}`, {
        method: "get",
        params: {
            status: status
        }
    });
}
// 发票登记
export function Api_invoiceRegister(params) {
    return request(`${fxb}${ecm}/invoice-follow/register`, {
        method: "post",
        params
    });
}
// 发票待开-打回
export function Api_invoiceWaitBack(invoiceId, returnRemark) {
    return request(`${fxb}${ecm}/invoice-follow/wait-back/${invoiceId}`, {
        method: "post",
        dataForm: true,
        params: {
            returnRemark
        }
    });
}
// 待领取-打回
export function Api_invoiceReceiveBack(invoiceId, returnRemark) {
    return request(`${fxb}${ecm}/invoice-follow/receive-back/${invoiceId}`, {
        method: "post",
        dataForm: true,
        params: {
            returnRemark
        }
    });
}
// 作废
export function Api_invoiceInvalid(invoiceId) {
    return request(`${fxb}${ecm}/invoice-follow/cancel/${invoiceId}`, {
        method: "post"
    });
}

// 发票跟踪详情
export function Api_invoiceDetail(invoiceId) {
    return request(`${fxb}${ecm}/invoice-follow/detail/${invoiceId}`, {
        method: "get"
    });
}
// 发票领取
export function Api_invoiceReceive(params) {
    return request(`${fxb}${ecm}/invoice-follow/receive`, {
        method: "post",
        params
    });
}
// 发票签收
export function Api_invoiceSigned(params) {
    return request(`${fxb}${ecm}/invoice-follow/sign-for`, {
        method: "post",
        params
    });
}

// 发票跟踪代我处理的数量
export function Api_invoiceCount(params) {
    return request(`${fxb}${ecm}/invoice-follow/count`, {
        method: "get",
        params
    });
}
