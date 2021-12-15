import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 统计
export function Api_ReportStatistics(params) {
    return request(`${fxb}/ecm/receivable/report/statistics`, {
        method: "get",
        params
    });
}

// 列表
export function Api_ReportPage(params) {
    return request(`${fxb}/ecm/receivable/report/page`, {
        method: "get",
        params
    });
}

// 明细-统计
export function Api_ReportDetailStatistics(params) {
    return request(`${fxb}/ecm/receivable/report/detail/statistics`, {
        method: "get",
        params
    });
}

// 明细-列表
export function Api_ReportDetail(params) {
    return request(`${fxb}/ecm/receivable/report/detail`, {
        method: "get",
        params
    });
}

// 月度-列表
export function Api_ReportMonth(params) {
    return request(`${fxb}/ecm/receivable/report/month`, {
        method: "get",
        params
    });
}
