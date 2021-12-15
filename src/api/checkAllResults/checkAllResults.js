//  这是搜索结果页面的所有接口
import request from "@/utils/request";
import { fxb, ecm } from '@/utils/variables'

export function changeCompanyName(params) {
    return request(`${fxb}/enterprise-search/getEnterpriseByName`, {
        method: "get",
        params: params
    });
}


export function exportExcel(params) {
    return request(`${fxb}/enterprise-search/excel`, {
        method: "post",
        params: params,
        responseType: "blob"
    });
}