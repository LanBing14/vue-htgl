import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 新增付款条件 & 查询
export function Api_PaymentConditionsList(params) {
  return request(`${fxb}/ecm/payment-conditions`, {
    method: "get",
    params
  });
}

// 新增付款条件 & 新增
export function Api_PaymentConditionsCreate(params) {
  return request(`${fxb}/ecm/payment-conditions`, {
    method: "post",
    params
  });
}

// 新增付款条件 & 获取详情
export function Api_PaymentConditionsDetail(id) {
  return request(`${fxb}/ecm/payment-conditions/${id}`, {
    method: "get"
  });
}

// 新增付款条件 & 修改
export function Api_PaymentConditionsEdit(id, params) {
  return request(`${fxb}/ecm/payment-conditions/${id}`, {
    method: "put",
    params
  });
}

// 新增付款条件 & 删除
export function Api_PaymentConditionsDel(id) {
  return request(`${fxb}/ecm/payment-conditions/${id}`, {
    method: "delete"
  });
}

// 新增付款条件 & 启用禁用
export function Api_PaymentConditionsEnable(id) {
  return request(`${fxb}/ecm/payment-conditions/${id}`, {
    method: "patch"
  });
}
