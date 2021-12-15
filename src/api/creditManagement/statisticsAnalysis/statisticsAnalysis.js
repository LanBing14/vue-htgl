import request from "@/utils/request";
import { fxb } from "@/utils/variables";
import { stringify } from "qs";

// 授信申请分析列表
export function Api_GetAnalysisPage(params) {
    return request(`${fxb}/ecm/credit-analysis/page`, {
        method: "get",
        params
    });
}
// 授信申请分析列表-统计
export function Api_GetAnalysisStatistics(params) {
    return request(`${fxb}/ecm/credit-analysis/statistics`, {
        method: "get",
        params
    });
}
// 客户用信分析列表
export function Api_GetOccupancyPage(params) {
    return request(`${fxb}/ecm/occupancy-analysis/page`, {
        method: "get",
        params
    });
}
// 客户用信分析列表-统计
export function Api_GetOccupancyStatistics(params) {
    return request(`${fxb}/ecm/occupancy-analysis/statistics`, {
        method: "get",
        params
    });
}
// 客户授信分析列表
export function Api_GetEffectPage(params) {
    return request(`${fxb}/ecm/credit-effect-analysis/page`, {
        method: "get",
        params
    });
}
// 客户授信分析列表-统计
export function Api_GetEffectStatistics(params) {
    return request(`${fxb}/ecm/credit-effect-analysis/statistics`, {
        method: "get",
        params
    });
}
// 客户信用预警列表
export function Api_GetWarningPage(params) {
    return request(`${fxb}/ecm/credit-effect-warning/page`, {
        method: "get",
        params
    });
}
// 客户信用预警列表-统计
export function Api_GetWarningStatistics(params) {
    return request(`${fxb}/ecm/credit-effect-warning/statistics`, {
        method: "get",
        params
    });
}
// 客户信用预警重新生成
export function Api_GetWarningRecreate() {
    return request(`${fxb}/ecm/credit-effect-warning/recreate`, {
        method: "post"
    });
}
