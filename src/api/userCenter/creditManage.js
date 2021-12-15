import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 获取关注列表信息
export function Api_GetAttentionList(params) {
    return request("/fxb/fxbRest/attention/getAttentionList", {
        method: "get",
        params: params
    });
}

// 获取企业分组信息
export function Api_GetAttentionGroup(params) {
    // return request('/ecm/attention/page', {
    //     method: 'get',
    //     params
    // })
    // return request('/fxb/fxbRest/attention/getGroupList', {method: 'get'})
}

// 批量移除关注
export function Api_RemoveAttention(params) {
    return request("/fxb/fxbRest/attention/removeAttention", {
        method: "get",
        params: params
    });
}

// 添加关注
export function Api_AddAttention(params) {
    // return request('/fxb/fxbRest/attention/addAttention', {
    return request(`${fxb}/ecm/attention/add`, {
        method: "post",
        dataForm: true,
        params: params
    });
}

// 取消关注
export function Api_AttentionCancel(id) {
    // return request('/fxb/fxbRest/attention/addAttention', {
    return request(`${fxb}/ecm/attention/cancel/${id}`, {
        method: "delete"
    });
}

// 修改关注
export function Api_UpdateAttention(params) {
    return request("/fxb/fxbRest/attention/updateAttention", {
        method: "post",
        params: params
    });
}

// 获取关注信息
export function Api_GetAttentionInfo(companyId) {
    return request("/fxb/fxbRest/attention/getAttentionByCompanyId", {
        method: "get",
        params: {
            companyId
        }
    });
}

// 保存自定义分组
export function Api_SaveGroup(name, groupType) {
    return request("/fxb/fxbRest/attention/saveGroup", {
        method: "post",
        params: {
            name: name,
            groupType: groupType
        }
    });
}

// 删除自定义分组
export function Api_DeleteGroup(groupId) {
    return request("/fxb/fxbRest/attention/deleteGroup", {
        method: "get",
        params: {
            groupId
        }
    });
}

// 修改自定义分组
export function Api_EditGroup(params) {
    return request("/fxb/fxbRest/attention/editGroup", {
        method: "post",
        params: params
    });
}

// 批量设置分组
export function Api_BatchSetGroup(params) {
    return request("/fxb/fxbRest/attention/batchSetGroup", {
        method: "post",
        params: params
    });
}

// 精确添加关注
export function Api_ExactAddAttention(params) {
    return request("/fxb/fxbRest/attention/exactAddAttention", {
        method: "post",
        params: params
    });
}

// 上传维诺健
export function Api_ImportAttention(params) {
    return request("/fxb/fxbRest/attention/importAttention", {
        method: "post",
        params: params
    });
}

// 分页查询客户负责人列表
export function Api_GetResponsiblePersonByPage(params) {
    return request("/fxb/infoMaintain/getResponsiblePersonByPage", {
        method: "post",
        params: params
    });
}

// 新增客户负责人
export function Api_AddResponsiblePerson(params) {
    return request("/fxb/infoMaintain/addResponsiblePerson", {
        method: "post",
        params: params
    });
}

// 编辑客户负责人
export function Api_EditResponsiblePerson(params) {
    return request("/fxb/infoMaintain/editResponsiblePerson", {
        method: "post",
        params: params
    });
}

// 删除客户负责人
export function Api_DeleteResponsiblePerson(params) {
    return request("/fxb/infoMaintain/deleteResponsiblePerson", {
        method: "get",
        params: params
    });
}

// 分页查询联络信息列表
export function Api_GetContactInfoByPage(params) {
    return request("/fxb/infoMaintain/getContactInfoByPage", {
        method: "post",
        params: params
    });
}

// 新增联络信息
export function Api_AddContactInfo(params) {
    return request("/fxb/infoMaintain/addContactInfo", {
        method: "post",
        params: params
    });
}
// 编辑联络信息
export function Api_EditContactInfo(params) {
    return request("/fxb/infoMaintain/editContactInfo", {
        method: "post",
        params: params
    });
}
// 删除联络信息
export function Api_DeleteContactInfo(params) {
    return request("/fxb/infoMaintain/deleteContactInfo", {
        method: "get",
        params: params
    });
}

// 分页查询银行账户信息列表
export function Api_GetBankAccountByPage(params) {
    return request("/fxb/infoMaintain/getBankAccountByPage", {
        method: "post",
        params: params
    });
}

// 新增银行账户信息
export function Api_AddBankAccount(params) {
    return request("/fxb/infoMaintain/addBankAccount", {
        method: "post",
        params: params
    });
}
// 编辑银行账户信息
export function Api_EditBankAccount(params) {
    return request("/fxb/infoMaintain/editBankAccount", {
        method: "post",
        params: params
    });
}
// 删除银行账户信息
export function Api_DeleteBankAccount(params) {
    return request("/fxb/infoMaintain/deleteBankAccount", {
        method: "get",
        params: params
    });
}

// 企业认证前提判断
export function Api_certJudgment(id, params) {
    return request(`/fxb/enterprise-cert/certJudgment/${id}`, {
        method: "get",
        params: params
    });
}
