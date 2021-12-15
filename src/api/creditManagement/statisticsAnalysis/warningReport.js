import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 统计
export function Api_WarningReportStatistics(params) {
    return request(`${fxb}/ecm/receivable/warning/report/statistics`, {
        method: "get",
        params
    });
}

// 列表
export function Api_WarningReportPage(params) {
    return request(`${fxb}/ecm/receivable/warning/report/page`, {
        method: "get",
        params
    });
}
