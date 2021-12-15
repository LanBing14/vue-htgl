import request from '@/utils/request'
import {fxb} from '@/utils/variables'

/*
 * 监测信息相关接口
 */

/**
 * 获取监测信息列表
 * @param startDate 时间范围 （起）
 * @param endDate 时间范围 （止）
 * @param key 企业名称
 * @param pageNo
 * @param pageSize
 * @param type 0 查询该用户关注的所以企业的风险信息
 * @param typeCodeFirst 风险项
 * @param typeCodeSecond 子风险项
 * @param riskLevel 等级
 * @param groupId 企业分组
 */
export function Api_GetPageMonitor(startDate, endDate, key, pageNo, pageSize, type, typeCodeFirst, typeCodeSecond, riskLevel, groupId) {
    return request(`${fxb}/monitor/page`, {
        method: 'get',
        params: {
            startDate: startDate,
            endDate: endDate,
            key: key,
            pageNo: pageNo,
            pageSize: pageSize,
            type: type,
            typeCodeFirst: typeCodeFirst,
            typeCodeSecond: typeCodeSecond,
            riskLevel: riskLevel,
            groupId: groupId
        }
    })
}

export function Api_GetComPageMonitor(params) {
    return request(`${fxb}/monitor/page`, {
        method: 'get',
        params: params
    })
}

// 自身动态信息
export function Api_newGetComPageMonitor(params) {
    return request(`${fxb}/pageSupervise/getItsDynamicData`, {
        method: 'get',
        params: params
    })
}
// 企业关联动态信息
export function Api_newGetComPageMonitorCor(params) {
    return request(`${fxb}/pageSupervise/getAssDynamicData`, {
        method: 'get',
        params: params
    })
}

/**
 * 获取监督列表
 * @param companyName 公司名称
 * @param superviseGroupId 分组id
 * @param pageNo
 * @param pageSize
 */
export function Api_GetPageSupervise(companyName, superviseGroupId, pageNo, pageSize) {
    return request(`${fxb}/supervise/supervise-list`, {
        method: 'get',
        params: {companyName: companyName, pageNo: pageNo, pageSize: pageSize, superviseGroupId: superviseGroupId}
    })
}

/**
 * 批量移除企业监管
 * @param ids
 */
export function Api_RemoveSupervise(ids) {
    return request(`${fxb}/supervise`, {
        method: 'delete',
        params: ids
    })
}

/**
 * 通过企业名称搜索企业
 * @param queryValue 企业名称
 */
export function Api_CompanySearch(queryValue) {
    return request('/fxb/enterprise-search/list', {
        method: 'get',
        params: {queryValue: queryValue}
    })
}

/**
 *  * 添加/取消 监测
 * @param companyId
 * @param status (0:添加监测 ；-1：取消监测)
 * @param groupIdList 添加分组id
 */
export function Api_SuperviseCompany(companyId, status, groupIdList) {
    return request(`${fxb}/supervise`, {
        method: 'post',
        params: {companyId: companyId, status: status, groupIdList: groupIdList}
    })
}
export function Api_newSuperviseCompany(companyId, companyName, status, groupIdList) {
    return request(`${fxb}/pageSupervise`, {
        method: 'post',
        dataForm: true,
        params: {companyId: companyId, companyName, status: status, groupIds: groupIdList}
    })
}

/**
 * 判断企业是否监测
 * @param companyId
 */
export function Api_HasSupervise(companyId) {
    return request(`${fxb}/supervise/has-supervise`, {
        method: 'get',
        params: {companyId: companyId}
    })
}
export function Api_newHasSupervise(companyId) {
    return request(`${fxb}/pageSupervise/has-supervise`, {
        method: 'get',
        params: {companyId: companyId}
    })
}

/**
 * 批量添加企业监测
 * @param companyIds
 */
export function Api_AddSuperviseBatch(params) {
    return request(`${fxb}/supervise/supervise-batch`, {
        method: 'post',
        params
    })
}

/**
 * 获取当前企业的自身风险 和 关联风险的个数
 * @param companyId
 */
export function Api_GetCompanyRiskCount(companyId) {
    return request(`${fxb}/monitor/risk-count`, {
        method: 'get',
        params: {companyId: companyId}
    })
}

/**
 * 导入excel数据
 * @param path 文件地址
 */
export function Api_ImportSupervise(path) {
    return request(`${fxb}/supervise/supervise-import`, {
        method: 'post',
        params: {path: path}
    })
}

/**
 * 获取监测分组
 * @param flag 是否带数量 (0：不带；1：带数字)
 */
export function Api_GetSuperviseGroup(flag) {
    return request(`${fxb}/supervise/supervise-group`, {
        method: 'get',
        params: {flag: flag}
    })
}

/**
 * 保存监测分组
 * @param id
 * @param name
 */
export function Api_SaveSuperviseGroup(id, name) {
    return request(`${fxb}/supervise/supervise-group`, {
        method: 'post',
        params: {id: id, name: name}
    })
}

/**
 * 删除监测分组
 * @param id
 */
export function Api_DeleteSuperviseGroup(id) {
    return request(`${fxb}/supervise/supervise-group/${id}`, {
        method: 'get'
    })
}

/**
 * 更新监测分组关联
 * @param superviseId
 * @param superviseGroupList
 */
export function Api_UpDateSuperviseToGroup(superviseId, superviseGroupList) {
    return request(`${fxb}/supervise/supervise-to-group`, {
        method: 'put',
        params: {superviseId: superviseId, superviseGroupList: superviseGroupList}
    })
}

/**
 * 获取预警信息列表
 */
export function Api_GetWarningList(params) {
    return request(`${fxb}/ecm/company-monitor/warning-list`, {
        method: 'get',
        params: params
    })
}

/**
 * monitorSetting
 */

// 获取监测设置信息
export function Api_GetAllMonitor(params) {
    return request(`${fxb}/monitor/all-monitor-types`, {
        method: 'get',
        params: params
    })
}
export function Api_newGetAllMonitor(params) {
    return request(`${fxb}/pageSupervise/geTrisks`, {
        method: 'get',
        params: params
    })
}

/**
 * 获取系统预警规则 和 自定义预警规则
 * @params：
 *  id // 主键
 *  warningType: 1:系统预警  2:自定义预警 // 预警类型
 *  warningName // 预警名称
 *  ruleDesc // 规则描述
 *  warningLevel: 0:重大预警 1:警示预警 2:关注预警 3:提示预警 // 预警级别
 *  monitorTypeId // 监测类型主键
 *  timeRange: 0:自列入监测开始 1:近一个月 2:近三个月 3:近半年 4:近一年 // 时间范围
 *  warningItem: 0:次数 1:户数 // 预警指标
 *  ruleLimit // 规则限制
 *  status: 0:已启用 -1:已停用 // 状态
 *  isDisabled: 0:有效 1:删除了 // 是否删除
 *  createDate // 创建时间
 *  createBy // 创建人id
 *  updateDate // 更新时间
 *  updateBy // 更新人id
 */
export function Api_GetAllRules(params) {
    return request(`${fxb}/warning-rule/list`, {
        method: 'get',
        params: params
    })
}

/**
 * 启用和禁用预警规则
 * @params：
 *  status: 0：启用 -1：停用
 *  stateCode: "1"：成功；“ 0”：“ 系统错误”
 */
export function Api_ChangeRulesState(params) {
    return request(`${fxb}/warning-rule/enable-or-disable/${params.id}`, {
        method: 'patch',
        params: params
    })
}

/**
 * 删除预警规则
 * @params：
 *  status: 0：启用 -1：停用
 *  stateCode: "1"：成功；“ 0”：“ 系统错误”
 */
export function Api_DelRule(id) {
    return request(`${fxb}/warning-rule/${id}`, {
        method: 'delete'
    })
}

/**
 * 获取预警规则
 * 请求@params：
 *  warningRuleId： ''
 * -----------------------
 * 返回@params：
 *  stateCode: "1"：成功；“ 0”：“ 系统错误”
 */
export function Api_GetRules(id) {
    return request(`${fxb}/warning-rule/${id}`, {
        method: 'get'
    })
}

/**
 * 新增保存/编辑保存 预警规则 （post）
 * -----------------------
 * 返回@params：
 *  stateCode: "1"：成功；“ 0”：“ 系统错误”
 *
 */
export function Api_SaveCustomRules(params) {
    return request(`${fxb}/warning-rule`, {
        method: 'post',
        params: params
    })
}

/**
 * 获取预警事件 （get）
 * -----------------------
 * 返回@params：
 *  stateCode: "1"：成功；“ 0”：“ 系统错误”
 *
 */

export function Api_GetWarningEvent(params) {
    return request(`${fxb}/monitor/warning-monitor-type`, {
        method: 'get',
        params: params
    })
}

/**
 * 保存推送方式
 * mobile: '' / email: '',
 * pushWay: '' // mobile/email
 */

export function Api_SavePushWay(params) {
    return request(`${fxb}/warning-rule/push-way`, {
        method: 'post',
        params: params
    })
}

/**
 * 启用/禁用 推送方式
 */

export function Api_ChangePushWay(params) {
    return request(`${fxb}/warning-rule/push-way`, {
        method: 'patch',
        params: params
    })
}

/**
 * 获取推送方式
 */

export function Api_GetPushWay(params) {
    return request(`${fxb}/warning-rule/push-way`, {
        method: 'get',
        params: params
    })
}

export function Api_GetCompanyTag(params) {
    return request(`${fxb}/eci/baseMsg/getCompanyTag`, {
        method: 'post',
        params: params
    })
}

// 数据
export function Api_GetDataCount(params) {
    return request(`${fxb}/eci/baseMsg/getDataCount`, {
        method: 'post',
        params: params
    })
}
