import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 统计
export function Api_turnoverReportStatistics(params) {
    return request(`${fxb}/ecm/receivable/turnover/report/statistics`, {
        method: "get",
        params
    });
}

// 列表
export function Api_turnoverReportPage(params) {
    return request(`${fxb}/ecm/receivable/turnover/report/page`, {
        method: "get",
        params
    });
}
