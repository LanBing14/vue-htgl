import request from "@/utils/request";
import { fxb } from "@/utils/variables";

//
export function Api_situationStatisticsOverMoney(params) {
    return request(`${fxb}/ecm/situation/statistics/over/money`, {
        method: "get",
        params
    });
}

// 客户应收未收金额TOP10
export function Api_situationStatisticsOweMoney(params) {
    return request(`${fxb}/ecm/situation/statistics/owe/money`, {
        method: "get",
        params
    });
}

// 客户逾期金额TOP10
export function Api_situationStatisticsOverdueMoneyTop(params) {
    return request(`${fxb}/ecm/situation/statistics/overdue/money/top`, {
        method: "get",
        params
    });
}

// 客户授信集中度top10
export function Api_situationStatisticsCreditCrn(params) {
    return request(`${fxb}/ecm/situation/statistics/credit/crn`, {
        method: "get",
        params
    });
}

// 客户信用预警统计
export function Api_situationStatisticsCreditApply(type) {
    return request(`${fxb}/ecm/situation/statistics/credit/apply/${type}`, {
        method: "get"
    });
}
