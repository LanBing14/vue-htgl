import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 统计
export function Api_receiveReportStatistics(params) {
    return request(`${fxb}/ecm/expect/receive/report/statistics`, {
        method: "get",
        params
    });
}

// 列表
export function Api_receiveReportPage(params) {
    return request(`${fxb}/ecm/expect/receive/report/page`, {
        method: "get",
        params
    });
}
