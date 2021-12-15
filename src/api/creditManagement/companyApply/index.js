import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";
import {stringify} from "qs";

// 获取企业申报列表
export function Api_GetApplyList(params) {
    return request(`/park/report/list`, {
        method: "get",
        params
    });
}

// 获取企业申报详情
export function Api_GetApplyDetail(noitceId) {
    return request(`/park/report/detail/${noitceId}`, {
        method: "get"
    });
}

// 生成申报信息填报记录
export function Api_genFill(id, declarationId) {
    return request(`/park/report/genFill/${id}/${declarationId}`, {
        method: "POST"
    });
}

// 企业申报提交
export function Api_pushApplyDetail(id,num,params) {
    return request(`/park/report/save/${id}/${num}`, {
        method: "POST",
        params
    });
}

// 申报已读
export function Api_pushApplyRead(id) {
    return request(`/park/report/read/${id}`, {
        method: "PATCH"
    });
}
