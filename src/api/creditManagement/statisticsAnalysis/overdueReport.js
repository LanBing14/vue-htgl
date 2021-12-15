import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 统计
export function Api_overdueReportPage(params) {
    return request(`${fxb}/ecm/overdue/report/page`, {
        method: "get",
        params
    });
}

// 列表
export function Api_overdueReportStatistics(params) {
    return request(`${fxb}/ecm/overdue/report/statistics`, {
        method: "get",
        params
    });
}
