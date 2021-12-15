import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";
import {stringify} from "qs";

// 获取所属机构列表
export function Api_GetCurrentMechain(entId) {
    return request(`/park/affiliatedInstitution/entInfo/currentInstitution?companyId=${entId}`, {
        method: "get",
    });
}

// 所属机构列表
export function Api_GetMechainList(entId) {
    return request(`/park/affiliatedInstitution/entInfo/institutions?entId=${entId}`, {
        method: "get",
    });
}

//机构关系绑定
export function Api_bindingMechain(params) {
    return request(`/park/affiliatedInstitution/entInfo/bind?entId=${params.entId}&code=${params.code}&type=${params.type}`, {
        method: "get",
    });
}

// 机构弹窗
export function Api_bindingModel(entId) {
    return request(`/park/affiliatedInstitution/entInfo/needBullet?entId=${entId}`, {
        method: "get",
    });
}