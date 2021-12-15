import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 异常发货 列表
export function Api_getAbnormalPage(params) {
    return request(`${fxb}/ecm/abnormal/send/deal/getAbnormalPage`, {
        method: "get",
        params
    });
}

// 异常发货 数量
export function Api_getAbnormalCount(params) {
    return request(`${fxb}/ecm/abnormal/send/deal/count`, {
        method: "get",
        params
    });
}

// 异常发货 异常处理
export function Api_abnormalDeal(id, params) {
    return request(`${fxb}/ecm/abnormal/send/deal/${id}`, {
        method: "post",
        params
    });
}

// 异常发货 详情
export function Api_getAbnormalDetail(id) {
    return request(`${fxb}/ecm/abnormal/send/deal/${id}`, {
        method: "get"
    });
}
