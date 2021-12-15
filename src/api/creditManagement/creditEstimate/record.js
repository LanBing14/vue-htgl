import request from "@/utils/request";
import { fxb, ecm } from '@/utils/variables';

// 获取评估记录分页数据
export function Api_EvaluateRecordPage(params) {
  return request(`${fxb}${ecm}/evaluate/record/page`, {
    method: 'get',
    params
  });
}

// 判断是否有评估模型可用
export function Api_EvaluateRecordModel() {
  return request(`${fxb}${ecm}/evaluate/record/model`, {
    method: 'get'
  });
}

// 评估记录-添加记录
export function Api_EvaluateRecordAddition(params) {
  return request(`${fxb}${ecm}/evaluate/record/addition`, {
    method: 'post',
    params
  });
}

// 评估 置为无效
export function Api_setVoid(id) {
  return request(`${fxb}/ecm/evaluate/record/${id}`, {
    method: 'delete',
  });
}

// 评估记录-获取执行记录列表接口
export function Api_EvaluateRecordExecute(id, params) {
  return request(`${fxb}${ecm}/evaluate/record/execute/${id}`, {
    method: 'get',
    params
  });
}

// 评估记录- 评估记录执行
export function Api_EvaluateRecordExecuteAdd(id, status, params) {
  return request(`${fxb}${ecm}/evaluate/record/execute/${id}/${status}`, {
    method: 'post',
    params
  });
}
// 评估评估 --确认
export function Api_EvaluateRecordExecuteconfirm(id,  params) {
  return request(`${fxb}${ecm}/evaluate/record/execute/score/${id}`, {
    method: 'get',
    params
  });
}

// 执行评估 获取总分和各个指标得分
export function Api_EvaluateRecordExecuteScore(id) {
  return request(`${fxb}${ecm}/evaluate/record/execute/score/${id}`, {
    method: 'get'
  });
}

// 执行评估 获取总分和各个指标得分弹窗——保存/提交
export function Api_EvaluateRecordExecuteScoreSave(id, status) {
  return request(`${fxb}${ecm}/evaluate/record/execute/confirm/${id}/${status}`, {
    method: 'PATCH'
  });
}

// 评估记录- 获取历史记录
export function Api_EvaluateRecordHistory({ id }) {
  return request(`${fxb}${ecm}/evaluate/record/history/${id}`, {
    method: 'get'
  });
}