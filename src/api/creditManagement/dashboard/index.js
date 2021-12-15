import request from "@/utils/request";
import {fxb, upms} from "@/utils/variables";
import {stringify} from "qs";

// 权限筛选
export function Api_GetWorkBenchAuthority() {
    return request(`${fxb}/ecm/workbench/getWorkBenchAuthority`, {
        method: "get"
    });
}

// 简报配置列表
export function Api_GetConfigList() {
    return request(`${fxb}/ecm/workbench/configList`, {
        method: "get"
    });
}

// 简报配置修改
export function Api_ChangeConfig(params) {
    return request(`${fxb}/ecm/workbench/changeConfig`, {
        method: "patch",
        params
    });
}

// 重置配置
export function Api_ResetConfig() {
    return request(`${fxb}/ecm/workbench/resetConfig`, {
        method: "put"
    });
}
//获取到期管理数量
export function Api_warnNum(){
    return request(`${fxb}/ecm/workbench/warn/count`, {
        method: "get",
    });
}

// 预警列表信息
export function Api_GetWarnPage(params) {
    return request(`${fxb}/ecm/workbench/getWarnPage`, {
        method: "get",
        params
    });
}

// 工作台简报信息
export function Api_GetBrief(params) {
    return request(`${fxb}/ecm/workbench/getBrief`, {
        method: "get",
        params
    });
}
