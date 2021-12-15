import request from "@/utils/request";
import {fxb, ecm} from '@/utils/variables'

// 两企业最短路径
export function Api_RelationPath(params) {
    return request(`${fxb}${ecm}/graph/database/shortest-path`, {
        method: "get",
        params
    });
}

// 新增关系
export function Api_SubjectAdd(params) {
    return request(`${fxb}/enterprise-search/subject`, {
        method: "post",
        params
    });
}

// 关系列表
export function Api_SubjectGetList() {
    return request(`${fxb}/enterprise-search/subject`, {
        method: "get"
    });
}

// 关系列表
export function Api_SubjectDelete(id) {
    return request(`${fxb}/enterprise-search/subject/${id}`, {
        method: "delete"
    });
}
