import request from "@/utils/request";
import {fxb, ecm} from "@/utils/variables";

// cp客户档案-经营风险-动产抵押
export function Api_CustomerArchivesMpledgeInfo({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getOperationMpledgeInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-经营风险-动产抵押--新增
export function Api_CustomerArchivesMpledgeAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-mpledge/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-动产抵押--修改
export function Api_CustomerArchivesMpledgeUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-mpledge/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-动产抵押--删除
export function Api_CustomerArchivesMpledgeDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-mpledge/${companyId}/${id}`, {
        method: "delete"
    });
}

// cp客户档案-经营风险-股权出质
export function Api_CustomerArchivesPledgeInfo({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getOperationPledgeInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-经营风险-股权出质--新增
export function Api_CustomerArchivesPledgeAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-pledge/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-股权出质--修改
export function Api_CustomerArchivesPledgeUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-pledge/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-股权出质--删除
export function Api_CustomerArchivesPledgeDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-pledge/${companyId}/${id}`, {
        method: "delete"
    });
}


// cp客户档案-经营风险-经营异常名录
export function Api_CustomerArchivesOpexceptionInfo({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getCompanyOpexceptionInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-经营风险-经营异常名录--新增
export function Api_CustomerArchivesOpexceptionAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-company-opexception/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-经营异常名录--修改
export function Api_CustomerArchivesOpexceptionUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-company-opexception/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-经营异常名录--删除
export function Api_CustomerArchivesOpexceptionDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-company-opexception/${companyId}/${id}`, {
        method: "delete"
    });
}

// cp客户档案-经营风险-行政处罚信息
export function Api_CustomerArchivesPenaltyInfo({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getOperationPenaltyInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-经营风险-行政处罚信息--新增
export function Api_CustomerArchivesPenaltyAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-penalty/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-行政处罚信息--修改
export function Api_CustomerArchivesPenaltyUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-penalty/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-行政处罚信息--删除
export function Api_CustomerArchivesPenaltyDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-penalty/${companyId}/${id}`, {
        method: "delete"
    });
}

// cp客户档案-经营风险-清算信息
export function Api_CustomerArchivesLiquidationInfo({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getOperationLiquidationInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-经营风险-清算信息--新增
export function Api_CustomerArchivesLiquidationAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-liquidation/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-清算信息--修改
export function Api_CustomerArchivesLiquidationUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-liquidation/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-经营风险-清算信息--删除
export function Api_CustomerArchivesLiquidationDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-operation-liquidation/${companyId}/${id}`, {
        method: "delete"
    });
}
