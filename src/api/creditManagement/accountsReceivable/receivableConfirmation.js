import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 发货跟踪列表
export function Api_ReceivableApplyPage(params) {
    return request(`${fxb}/ecm/receivable-apply/page`, {
        method: "get",
        params
    });
}

// 查看详情
export function Api_ReceivableApplyDetail(id) {
    return request(`${fxb}/ecm/receivable-apply/${id}`, {
        method: "get"
    });
}
// 查看详情--待办
export function Api_ReceivableApplyDetailTodo(id) {
    return request(`${fxb}/ecm/receivable-apply/his/${id}`, {
        method: "get"
    });
}

// 查看详情
export function Api_ReceivableApplySubmit(id, params) {
    return request(`${fxb}/ecm/receivable-apply/${id}`, {
        method: "post",
        params
    });
}
