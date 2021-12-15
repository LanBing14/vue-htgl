import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

export function Api_getEvaluationRecordPage(params) {
    return request(`${fxb}${ecm}/customer/archives/getEvaluationRecordPage`, {
        method: "get",
        params
    });
}

export function Api_getCustomerCreditRecordPage(params) {
    return request(`${fxb}${ecm}/customer/archives/getCustomerCreditRecordPage`, {
        method: "get",
        params
    });
}
