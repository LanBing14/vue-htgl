import request from "@/utils/request";
const baseUrl = "park";
const baseUserUrl = "upms/system";

export function api_search(params){
    return request(`/${baseUrl}/cxcyActivity/page`,{
        method: "get",
        params
    })
}
export function api_activitiesDetail(id){
    return request(`/${baseUrl}/cxcyActivity/detail/${id}`,{
        method: "get"
    })
}
export function api_getEnterpriseUsers(){
    return request(`/${baseUserUrl}/users/getEnterprise/users`,{
        method: "get"
    })
}
export function api_comfirm(params){
    return request(`/${baseUrl}/cxcyActivity/signUp`,{
        method: "post",
        params,
        dataForm: true
    })
}


