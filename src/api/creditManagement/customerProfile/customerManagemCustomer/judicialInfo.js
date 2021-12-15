import request from '@/utils/request';
import {fxb, ecm} from '@/utils/variables';

// cp客户档案-司法风险-分页查询被执行人信息
export function Api_GetExecutionInfoByPage({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getExecutionInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-司法风险-分页查询被执行人信息--新增
export function Api_ExecutionAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-execution/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页查询被执行人信息--修改
export function Api_ExecutionUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-execution/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页查询被执行人信息--删除
export function Api_ExecutionDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-execution/${companyId}/${id}`, {
        method: "delete"
    });
}

// cp客户档案-司法风险-分页失信被执行人信息
export function Api_GetBrokenPromiseInfoByPage({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getBrokenPromiseInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-司法风险-分页失信被执行人信息--新增
export function Api_BrokenPromiseAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-broken-promise/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页失信被执行人信息--修改
export function Api_BrokenPromiseUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-broken-promise/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页失信被执行人信息--删除
export function Api_BrokenPromiseDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-broken-promise/${companyId}/${id}`, {
        method: "delete",
    });
}

// cp客户档案-司法风险-分页裁判文书信息
export function Api_GetRefereeInfoByPage({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getRefereeInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-司法风险-分页裁判文书信息--新增
export function Api_RefereeAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-referee/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页裁判文书信息--修改
export function Api_RefereeUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-referee/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页裁判文书信息--删除
export function Api_RefereeDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-referee/${companyId}/${id}`, {
        method: "delete",
    });
}

// cp客户档案-司法风险-分页法院公告信息
export function Api_GetCourtNoticeInfoByPage({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getCourtNoticeInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-司法风险-分页法院公告信息--新增
export function Api_CourtNoticeAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-court-notice/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页法院公告信息--修改
export function Api_CourtNoticeUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-court-notice/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-司法风险-分页法院公告信息--删除
export function Api_CourtNoticeDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-court-notice/${companyId}/${id}`, {
        method: "delete",
    });
}
