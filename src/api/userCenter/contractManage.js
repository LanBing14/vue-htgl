import request from '@/utils/request'

// 事项管理 接口

/**
 * 分页获取 财务管理 列表 接口
 * @param pageNo 当前页.
 * @param pageSize 分页大小.
 * @param itemType 事项类型 0:发货 1:收货 2:其他
 * @param contractNameNo 合同名称/编号.
 * @param oppositeCompany 对方公司名称
 * @param completionStatus 完成状态 0:未完成 1:已完成.
 * @param estimatedDateStart 预计时间起.
 * @param estimatedDateEnd 预计时间止.
 */
export function Api_GetPageList(pageNo, pageSize, itemType, contractNameNo, oppositeCompany,
    completionStatus, estimatedDateStart, estimatedDateEnd) {
    return request('/user/center/itemManagement/getPageList', {
        method: 'post',
        params: {
            pageNo: pageNo, pageSize: pageSize, itemType: itemType,
            contractNameNo: contractNameNo, oppositeCompany: oppositeCompany, completionStatus: completionStatus,
            estimatedDateStart: estimatedDateStart, estimatedDateEnd: estimatedDateEnd
        }
    })
}

// 获取关注列表信息
export function Api_GetDetail(id) {
    return request('/user/center/itemManagement/getDetail', {
        method: 'get',
        params: { id: id }
    })
}

// 获取合同提醒列表
export function Api_ContractRemindPageList(params) {
    return request('/user/center/contractRemind/getPageList', {
        method: 'get',
        params: params
    })
}

// 财务管理 接口
/**
 * 分页获取 财务管理 列表 接口
 * @param pageNo 当前页.
 * @param pageSize 分页大小.
 * @param financialType 财务类型 0:回款 1:付款 2:开票 3:收票 4:其他.
 * @param contractNameNo 合同名称/编号.
 * @param oppositeCompany 对方公司名称
 * @param completionStatus 完成状态 0:未完成 1:已完成.
 * @param estimatedDateStart 预计时间起.
 * @param estimatedDateEnd 预计时间止.
 */

export function Api_FinancialPageList(pageNo, pageSize, financialType, contractNameNo, oppositeCompany,
    completionStatus, estimatedDateStart, estimatedDateEnd) {
    return request('/user/center/financialManagement/getPageList', {
        method: 'post',
        params: {
            pageNo: pageNo, pageSize: pageSize, financialType: financialType,
            contractNameNo: contractNameNo, oppositeCompany: oppositeCompany, completionStatus: completionStatus,
            estimatedDateStart: estimatedDateStart, estimatedDateEnd: estimatedDateEnd
        }
    })
}

// 合同管理 接口

/**
 * 分页获取合同管理列表 接口
 * @param pageNo 当前页.
 * @param pageSize 分页大小.
 * @param contractCategory 合同类别 0: 大宗商品交易  1:公共资源交易  2:商业合同.
 * @param contractNameNo 合同名称/编号.
 * @param contractClass 合同分类 0:销售合同 1:采购合同.
 * @param status 合同状态 0:签约 1:执行中 2:已完成.
 * @param oppositeCompany 对方公司名称
 * @param deptId 部门id
 * @param userId 负责人id
 */
export function Api_ContractPageList(pageNo, pageSize, contractCategory, contractNameNo, contractClass,
    status, oppositeCompany, deptId, userId) {
    return request('/user/center/contractManagement/getPageList', {
        method: 'post',
        params: {
            pageNo: pageNo, pageSize: pageSize, contractCategory: contractCategory,
            contractNameNo: contractNameNo, contractClass: contractClass, status: status,
            oppositeCompany: oppositeCompany, deptId: deptId, responsibilityUserId: userId
        }
    })
}

// 获取 合同
export function Api_ContractGetDetail(params) {
    return request('/user/center/contractManagement/getDetail', {
        method: 'get',
        params: params
    })
}

// 获取部门树
export function Api_GetDepartListUser(params) {
    return request('/user/center/department/getDepartListUser', {
        method: 'get',
        params: params
    })
}

//  获取 根据部门id获取部门下子部门 下面所有的用户
export function Api_GetUserByDeptId(params) {
    return request('/user/center/xhsRest/getUserByDeptId', {
        method: 'get',
        params: params
    })
}

// 模糊搜索企业 合同管理详情
export function Api_CompanySearch(params) {
    return request('/fxb/enterprise-search/list', {
        method: 'get',
        params: params
    })
}

//  保存 合同管理
export function Api_ContractSave(params) {
    return request('/user/center/contractManagement/save', {
        method: 'post',
        params: params
    })
}

//  获取 对方联系人列表
export function Api_LinkmanGetList(params) {
    return request('/user/center/oppositeLinkman/getPageList', {
        method: 'post',
        params: params
    })
}
//  保存 对方联系人
export function Api_LinkmanSave(params) {
    return request('/user/center/oppositeLinkman/save', {
        method: 'post',
        params: params
    })
}
// 获取 对方联系人详情
export function Api_LinkmanGetDetail(params) {
    return request('/user/center/oppositeLinkman/getDetail', {
        method: 'get',
        params: params
    })
}
// 删除 对方联系人
export function Api_LinkmanDelete(params) {
    return request('/user/center/oppositeLinkman/delete', {
        method: 'get',
        params: params
    })
}

//  获取 合同清单列表
export function Api_ListGetList(params) {
    return request('/user/center/contractList/getPageList', {
        method: 'post',
        params: params
    })
}
//  保存 合同清单
export function Api_ListSave(params) {
    return request('/user/center/contractList/save', {
        method: 'post',
        params: params
    })
}
// 获取 合同清单详情
export function Api_ListnGetDetail(params) {
    return request('/user/center/contractList/getDetail', {
        method: 'get',
        params: params
    })
}
// 删除 合同清单
export function Api_ListDelete(params) {
    return request('/user/center/contractList/delete', {
        method: 'get',
        params: params
    })
}

//  获取  财务管理列表
export function Api_FinancialGetList(params) {
    return request('/user/center/financialManagement/getPageListByContract', {
        method: 'post',
        params: params
    })
}
//  保存 财务管理
export function Api_FinancialSave(params) {
    return request('/user/center/financialManagement/save', {
        method: 'post',
        params: params
    })
}
// 获取 财务管理详情
export function Api_FinancialGetDetail(params) {
    return request('/user/center/financialManagement/getDetail', {
        method: 'get',
        params: params
    })
}
// 删除 财务管理
export function Api_FinancialDelete(params) {
    return request('/user/center/financialManagement/delete', {
        method: 'get',
        params: params
    })
}

//  获取  事项管理列表
export function Api_ItemGetList(params) {
    return request('/user/center/itemManagement/getPageListByContract', {
        method: 'post',
        params: params
    })
}
//  保存 事项管理
export function Api_ItemSave(params) {
    return request('/user/center/itemManagement/save', {
        method: 'post',
        params: params
    })
}
// 获取 事项管理详情
export function Api_ItemGetDetail(params) {
    return request('/user/center/itemManagement/getDetail', {
        method: 'get',
        params: params
    })
}
// 删除 事项管理
export function Api_ItemDelete(params) {
    return request('/user/center/itemManagement/delete', {
        method: 'get',
        params: params
    })
}

//  获取 违约登记列表
export function Api_DefaultGetList(params) {
    return request('/user/center/defaultRegistration/getPageList', {
        method: 'post',
        params: params
    })
}
//  保存 违约登记
export function Api_DefaultSave(params) {
    return request('/user/center/defaultRegistration/save', {
        method: 'post',
        params: params
    })
}
// 获取 违约登记详情
export function Api_DefaultGetDetail(params) {
    return request('/user/center/defaultRegistration/getDetail', {
        method: 'get',
        params: params
    })
}
// 删除 违约登记
export function Api_DefaultDelete(params) {
    return request('/user/center/defaultRegistration/delete', {
        method: 'get',
        params: params
    })
}

// 获取 裁判文书
export function Api_GetRefereeDocument(params) {
    return request('/user/center/defaultDetail/getRefereeDocument', {
        method: 'get',
        params: params
    })
}

// 获取 被执行人
export function Api_GetAssetZhiXing(params) {
    return request('/user/center/defaultDetail/getAssetZhiXing', {
        method: 'get',
        params: params
    })
}

// 获取 失信信息
export function Api_GetAssetShiXing(params) {
    return request('/user/center/defaultDetail/getAssetShiXing', {
        method: 'get',
        params: params
    })
}

// 保存 关联司法信息
export function Api_SaveJudicialInfo(params) {
    return request('/user/center/defaultDetail/saveJudicialInfo', {
        method: 'post',
        params: params
    })
}

//  解除 关联司法信息
export function Api_CancelJudicialInfo(params) {
    return request('/user/center/defaultDetail/cancelJudicialInfo', {
        method: 'get',
        params: params
    })
}

// 获取 关联司法信息
export function Api_GetJudicialList(params) {
    return request('/user/center/defaultDetail/getList', {
        method: 'get',
        params: params
    })
}

// 保存 手动录入的司法信息
export function Api_SaveManualJudicialInfo(params) {
    return request('/user/center/defaultDetail/saveManualJudicialInfo', {
        method: 'post',
        params: params
    })
}
