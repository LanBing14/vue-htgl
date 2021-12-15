import request from "@/utils/request";
import { fxb, ecm, upms } from "@/utils/variables";

// 我的代办/申请列表 代办
export function Api_AgencyMattersTodo(params) {
    return request(`/upms/workflow/todo/page`, {
        method: "get",
        params
    });
}

// 我的代办/申请列表 已办
export function Api_AgencyMattersDone(params) {
    return request(`/upms/workflow/done/page`, {
        method: "get",
        params
    });
}


//获取信用管理数量
export function Api_credit() {
    return request(`/upms/workflow/count`, {
        method: "get",
    });
}


// 我的代办/申请列表 申请
export function Api_AgencyMattersMy(params) {
    return request(`/upms/workflow/my/page`, {
        method: "get",
        params
    });
}

// 合同详情
export function Api_AgencyMattersGetContractInfo(id, params) {
    return request(`${fxb}${ecm}/contract-order-manage/contract-his/${id}`, {
        method: "get",
        params
    });
}

// 代办签批
// export function Api_AgencyMattersAudit(id, params) {
//     return request(`${fxb}/agencyMatters/audit/${id}`, {
//         method: "put",
//         params
//     });
// }

// 签批信息列表
export function Api_AgencyMattersGetAuditPage(params) {
    // return request(`${fxb}/agencyMatters/getAuditList`, {
    return request(`${upms}/workflow/biz-history/list`, {
        method: "get",
        dataForm: true,
        params
    });
}

// 授信详情
export function Api_AgencyMattersGetCustomerCredit(id, params) {
    return request(`${fxb}/agencyMatters/getCustomerCredit/${id}`, {
        method: "get",
        params
    });
}

// 通用 处理
export function Api_AgencyMattersDeal(id, params) {
    return request(`/upms/processes/task-complete/${id}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// 通用 驳回
export function Api_AgencyMattersReject(id, params) {
    return request(`/upms/processes/task-reject/${id}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// 通用 退回
export function Api_AgencyMattersReturn(id, params) {
    return request(`/upms/processes/task-return/${id}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp获取企业认证历史
export function Api_EnterpriseCerthistory(id) {
    return request(`${fxb}/enterprise-cert/history/${id}`, {
        method: "get"
    });
}





// 获取逾期通报的数据
export function overDueNot() {
    return request(`${fxb}/ecm/workbench/lateNotification`, {
        method: "get"
    });
}


// 获取合同履约情况
export function conPerform() {
    return request(`${fxb}/ecm/workbench/performance`, {
        method: "get"
    });
}



// 信用评级接口
export function Api_getCreditScore({ companyId }) {
    return request(`${fxb}/eci/score-manage/${companyId}/credit-score`, {
        method: "get"
    });
}