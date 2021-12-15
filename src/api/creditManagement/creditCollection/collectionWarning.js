import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 预警 催收列表分页数据
export function Api_CollectionWarningPage(params) {
    return request(`${fxb}${ecm}/collection/collection/page/1`, {
        method: "get",
        params
    });
}

// 预警催收登记
export function Api_CollectionWarning(id, params) {
    return request(`${fxb}${ecm}/collection/warning/${id}`, {
        method: "post",
        params
    });
}

// 预警、逾期 催收详情
export function Api_CollectionWarningDetail(id) {
    return request(`${fxb}${ecm}/collection/collection/info/${id}`, {
        method: "get"
    });
}

// 获取 催收类型下拉
export function Api_CollectionWarningType() {
    return request(`${fxb}${ecm}/collection/type/1`, {
        method: "get"
    });
}
