import request from '@/utils/request';
import { fxb, ecm } from '@/utils/variables';

// 搜索企业
export function Api_SearchCompany(params) {
  return request(`${fxb}/ecm/customer/archives/company`, {
    method: 'get',
    params
  });
}

// 校验该企业是否存在风信标库中
export function Api_CheckCompany(params) {
  return request(`${fxb}/ecm/customer/archives/fxb/company`, {
    method: 'get',
    params
  });
}

// 获取客户分组
export function Api_GetCustomerGroup(params) {
  return request(`${fxb}/ecm/customer/archives/group`, {
    method: 'get',
    params
  });
}

// 校验该分组下是否有企业
export function Api_GetCustomerGroupJudge(id, params) {
  return request(`${fxb}/ecm/customer/archives/existUserInGroup/${id}`, {
    method: 'get',
    params
  });
}

// 获取客户分组
export function Api_GetCustomerGroupSave(params) {
  return request(`${fxb}/ecm/customer/archives/editGroup`, {
    method: 'post',
    params
  });
}

// 添加企业
export function Api_SaveCustomer(params) {
  return request(`${fxb}/ecm/customer/archives/customer`, {
    method: 'post',
    params
  });
}
export function Api_SaveCustomerId(params) {
  return request(`${fxb}/ecm/customer/archives/customer/credit`, {
    method: 'post',
    params
  });
}

// 客户管理列表
export function Api_GetCustomerPage(params) {
  return request(`${fxb}/ecm/customer/archives/page`, {
    method: 'get',
    params
  });
}

// 添加客户分组
export function Api_AddGroup(params) {
  return request(`${fxb}/ecm/customer/archives/group`, {
    method: 'post',
    params
  });
}

// 删除客户分组
export function Api_DeleteGroup(id) {
  return request(`${fxb}/ecm/customer/archives/group/${id}`, {
    method: 'delete'
  });
}

// 修改分组
export function Api_EditGroup(id, params) {
  return request(`${fxb}/ecm/customer/archives/group/${id}`, {
    method: 'put',
    params
  });
}

// 移除监测
export function Api_RemoveCustomer(id) {
  return request(`${fxb}/ecm/customer/archives/customer/${id}`, {
    method: 'delete'
  });
}

// 列入监测
export function Api_AddSuperviseBatch(params) {
  return request(`${fxb}/supervise/supervise-batch`, {
    method: 'post',
    params
  });
}

// 获取监测分组
export function Api_GetSuperviseGroup() {
  return request(`${fxb}/supervise/supervise-group`, {
    method: 'get',
    params: {
      flag: 0
    }
  });
}

// 获取集团下拉列表
export function Api_GetGroups() {
  return request(`${fxb}/ecm/customer/archives/groups`, {
    method: 'get'
  });
}

// 获取集团下成员列表
export function Api_GetGroupsMembers(params) {
  return request(`${fxb}/ecm/customer/archives/members/${params.id}`, {
    method: 'get',
    params
  });
}

// 获取集团下成员列表
export function Api_SearchGroupsMembers(id, params) {
  return request(`${fxb}/ecm/customer/archives/customer/${id}`, {
    method: 'get',
    params
  });
}

// 集团 关联
export function Api_RelateGroup(memberId, params) {
  return request(`${fxb}/ecm/customer/archives/group/relations-gl/${memberId}`, {
    method: 'put',
    dataForm: true,
    params
  });
}

// 集团 解除关联
export function Api_CancelRelateGroup(memberId) {
  return request(`${fxb}/ecm/customer/archives/group/relations-jc/${memberId}`, {
    method: 'put'
  });
}

// 列表中 修改分组
export function Api_QuickEditGroup(id, params) {
  return request(`${fxb}/ecm/customer/archives/customer/${id}`, {
    method: 'put',
    dataForm: true,
    params
  });
}

//
export function Api_GetContractList(params) {
  return request(`${fxb}/ecm/contract-order-manage/contract/list`, {
    method: 'get',
    params
  });
}

// 我的关注-列表
export function Api_getMyConcernList(params) {
  return request(`${fxb}/ecm/attention/page`, {
    method: 'get',
    params
  });
}

// 我的关注-取消关注
export function Api_getMyConcernCancel(id, params) {
  return request(`${fxb}/ecm/attention/cancel/${id}`, {
    method: 'delete',
    params
  });
}

// 加入客户之前的检验
export function Api_attentionCheck(params) {
  return request(`${fxb}/ecm/attention/check`, {
    method: 'get',
    params
  });
}

// 判断时候已经列入监测
export function Api_checkMonitoring(params) {
  return request(`${fxb}${ecm}/company-monitor/valid`, {
    method: 'get',
    params
  });
}

// 跟踪调查新增或修改
export function Api_trackingSurvey(params) {
  return request(`${fxb}/ecm/customer/archives/trackingSurvey`, {
    method: 'post',
    params
  });
}

// 跟踪调查分页列表
export function Api_trackingSurveyTable(params) {
  return request(`${fxb}/ecm/customer/archives/trackingSurvey/${params.id}`, {
    method: 'get',
    params
  });
}

// 跟踪调查分页列表
export function Api_trackingSurveyDel(id, params) {
  return request(`${fxb}/ecm/customer/archives/trackingSurvey/${id}`, {
    method: 'delete',
    params
  });
}

// 跟踪调查分页列表
export function Api_trackingSurveyState(id, params) {
  return request(`${fxb}/ecm/customer/archives/trackingSurvey/${id}`, {
    method: 'put',
    params
  });
}

// 跟踪调查分页列表
export function Api_trackingSurveyDetail(id, params) {
  return request(`${fxb}/ecm/customer/archives/trackingSurveyDetail/${id}`, {
    method: 'get',
    params
  });
}

// 批量添加客户
export function Api_batchAddCustomers(params) {
  return request(`${fxb}/ecm/customer/archives/batchCustomer`, {
    method: 'post',
    params
  });
}

// 批量添加监测
export function Api_batchAddMonitor(params) {
  return request(`${fxb}/ecm/company-monitor/batchMonitor`, {
    method: 'post',
    params
  });
}