import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 列表
export function Api_ReconciliationPage(params) {
    return request(`${fxb}/ecm/reconciliation/page`, {
        method: "get",
        params
    });
}

// 统计
export function Api_ReconciliationCount(params) {
    return request(`${fxb}/ecm/reconciliation/dealCount`, {
        method: "get",
        params
    });
}

// 重新生成
export function Api_ReconciliationRe(id) {
    return request(`${fxb}/ecm/reconciliation/${id}`, {
        method: "patch",
    });
}

// 确认
export function Api_ReconciliationConfirm(id, params) {
    return request(`${fxb}/ecm/reconciliation/${id}`, {
        method: "post",
        params
    });
}

// 详情
export function Api_ReconciliationDetail(id, params) {
    return request(`${fxb}/ecm/reconciliation/${id}`, {
        method: "get",
        params
    });
}

// 下载 // ${process.env.VUE_APP_BASE_API}
export function Api_ReconciliationDownload(id) {
    return request(`${fxb}/ecm/reconciliation/download/${id}`, {
        method: "get"
    });
}

// 查看账单信息
export function Api_ReconciliationBill(id) {
    return request(`${fxb}/ecm/reconciliation/bill/${id}`, {
        method: "get"
    });
}
