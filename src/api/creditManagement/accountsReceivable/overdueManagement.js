import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 列表
export function Api_PlanDelaypage(params) {
    return request(`${fxb}${ecm}/plan-delay/page`, {
        method: "get",
        params
    });
}

// 申请
export function Api_PlanDelayApp(id, params) {
    return request(`${fxb}${ecm}/plan-delay/${id}`, {
        method: "post",
        params
    });
}

// 详情
export function Api_PlanDelayDetail(id) {
    return request(`${fxb}${ecm}/plan-delay/${id}`, {
        method: "get"
    });
}

// 详情
export function Api_PlanDelayDetailTodo(id) {
    return request(`${fxb}${ecm}/plan-delay/delay/${id}`, {
        method: "get"
    });
}

// 延期-回显
export function Api_delayReview(id) {
    return request(`${fxb}/ecm/plan-delay/findBy/${id}`, {
        method: "get"
    });
}
