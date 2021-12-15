import request from "@/utils/request";
const baseUrl = "park";
const baseUserUrl = "upms/system";

export function api_search(params){
    return request(`/${baseUrl}/payment/page`,{
        method: "get",
        params
    })
}
export function api_getProject(){
    return request(`/${baseUrl}/payment/getBusiness`,{
        method: "get"
    })
}
export function api_getBuilding(businessId){
    return request(`/${baseUrl}/payment/getBuilding?businessId=${businessId}`,{
        method: "get"
    })
}
export function api_getjsStatistics(id){
    return request(`/${baseUrl}/payment/jsStatistics/${id}`,{
        method: "get"
    })
}
export function api_getysBillList(id){
    return request(`/${baseUrl}/payment/ysBillList/${id}`,{
        method: "get"
    })
}
export function api_exportData(params){
    return request(`/${baseUrl}/payment/excel`,{
        method: "get",
        params
    })
}
export function api_getDunningNotice(params){
    return request(`/${baseUrl}/dunningNotice/page`,{
        method: "get",
        params
    })
}

export function api_getDunningNoticeDetail(id){
    return request(`/${baseUrl}/dunningNotice/toDetail?id=${id}`,{
        method: "get"
    })
}

export function api_downloadPreviewPdf(params){
    return request(`/${baseUrl}/dunningNotice/getPreviewPdf`,{
        method: "get",
        params
    })
}

//收款通知单 详情 下载地址
export function api_downloadCreateSktzs(params){
    return request(`/${baseUrl}/payment/createSktzs`,{
        method: "get",
        params
    })
}

//催款通知单 详情 下载地址
export function api_downloadgetPreviewPdf(params){
    return request(`/${baseUrl}/dunningNotice/getPreviewPdf`,{
        method: "get",
        params
    })
}

