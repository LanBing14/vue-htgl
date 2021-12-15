import request from '@/utils/request';
import { fxb, ecm } from '@/utils/variables';

// 获取授信管理统计信息
export function Api_GetStatistics() {
	return request(`${fxb}${ecm}/customer/credit/statistics`, {
		method: 'get'
	});
}

// 授信管理列表
export function Api_CreditCustomerGetPage(params) {
	return request(`${fxb}${ecm}/customer/credit/page`, {
		method: 'get',
		params
	});
}

// 判断当前是否有启用的模型
export function Api_CreditCustomerCheckModel() {
	return request(`${fxb}${ecm}/customer/credit/model`, {
		method: 'get'
	});
}

// 判断是否是第一次配置授信策略
export function Api_CreditCustomerCheckFirst() {
	return request(`${fxb}${ecm}/customer/credit/first`, {
		method: 'get'
	});
}

// 评估等级变更，初始化授信策略等级接口
export function Api_CreditPlanChange(id,modelHisId) {
	return request(`${fxb}${ecm}/customer/credit/grade/new/${id}`, {
		method: 'post',
        dataForm: true,
        params: {
		    'id':id,
		    'modelHisId':modelHisId
		}

	});
}

// 获取授信策略方案列表
export function Api_CreditPlan(param) {
	return request(`${fxb}${ecm}/customer/credit/grade/page/${param.id}`, {
		method: 'get'
	});
}

// 判断当前授信策略使用模型等级与当前启用状态模型的信用等级是否一致
export function Api_CreditCustomerCheckGrade() {
	return request(`${fxb}${ecm}/customer/credit/grade`, {
		method: 'get'
	});
}

// 获取信用等级
export function Api_CreditCustomerGetGradeList() {
	return request(`${fxb}${ecm}/customer/credit/grade/list`, {
		method: 'get'
	});
}

// 新增授信策略
export function Api_CreditCustomerSaveCreditStrategy(params) {
	return request(`${fxb}${ecm}/customer/credit/strategy`, {
		method: 'post',
		params
	});
}
// 编辑授信策略
export function Api_CreditCustomerEditCreditStrategy(id, params) {
	return request(`${fxb}${ecm}/customer/credit/strategy/${id}`, {
		method: 'put',
		// headers: {
		//     'Content-Type': 'application/x-www-form-urlencoded'
		// },
		// dataForm: true,
		params
	});
}

// 新增授信时校验是否有待审核授信
export function Api_CreditCustomerCheckCredit(companyId) {
	return request(`${fxb}${ecm}/customer/credit/record`, {
		method: 'get',
		params: {
			companyId
		}
	});
}

// 获取企业信用数据
export function Api_CreditCustomerGetCustomerCredit(companyId) {
	return request(`${fxb}${ecm}/customer/credit/grade/credit/${companyId}`, {
		method: 'get'
	});
}

// 保存授信
export function Api_CreditCustomerSaveCreditCustomer(params) {
	return request(`${fxb}${ecm}/customer/credit/credit`, {
		method: 'post',
		params
	});
}

// 提交授信
export function Api_CreditCustomerSubCreditCustomer(params) {
	return request(`${fxb}${ecm}/customer/credit/credit/submission`, {
		method: 'post',
		params
	});
}
// 授信管理详情-编辑内容
export function Api_getCreditDetai(customerId) {
	return request(`${fxb}${ecm}/customer/credit/info/${customerId}`, {
		method: 'get'
	});
}

// 固定/临时授信历史
export function Api_CreditCustomerGetCreditPage(params) {
	return request(`${fxb}${ecm}/customer/credit/his-credit`, {
		method: 'get',
		params
	});
}

// new
export function Api_CreditCustomerGetGradeRecord(customerId, params) {
	return request(`${fxb}${ecm}/customer/credit/grade-credit/${customerId}`, {
		method: 'get',
		params
	});
}

// 最新一条授信记录
export function Api_CreditCustomerGetLatestRecord(customerId, params) {
	return request(`${fxb}${ecm}/customer/credit/latest-credit/${customerId}`, {
		method: 'get',
		params
	});
}
export function Api_NewCreditCustomerGetLatestRecord(id, type) {
	return request(`${fxb}${ecm}/customer/credit-apply/audit/${id}/${type}`, {
		method: 'get'
	});
}

// 根据企业信用等级获取授信策略方案等级配置
export function Api_CreditCustomerGetGradeScheme(companyId) {
	return request(`${fxb}${ecm}/customer/credit/grade/scheme`, {
		method: 'get',
		params: {
			companyId
		}
	});
}

// 根据授信记录查看授信建议
export function Api_CreditCustomerGetGradeSchemeHis(creditId) {
    return request(`${fxb}${ecm}/customer/credit/grade/schemeHis`, {
        method: 'get',
        params: {
            creditId
        }
    });
}

// 查看授信策略
export function Api_CreditCustomerGetCreditStrategy() {
	return request(`${fxb}${ecm}/customer/credit/strategy`, {
		method: 'get'
	});
}

// 集团客户授信--成员列表
export function Api_getMemberDetai(customerId) {
	return request(`${fxb}${ecm}/customer/credit/members/${customerId}`, {
		method: 'get'
	});
}

// 授信申请列表
export function Api_ApplicationGetList(params) {
	return request(`${fxb}${ecm}/customer/credit-apply/page`, {
		method: 'get',
		params
	});
}

// 模糊搜索客户列表
export function Api_CustomerGetCustomerList(companyName) {
	return request(`${fxb}${ecm}/customer/credit/customer`, {
		method: 'get',
		params: {
			companyName
		}
	});
}

// 保存申请
export function Api_ApplicationSave(params) {
	return request(`${fxb}${ecm}/customer/credit-apply/draft`, {
		method: 'post',
		params
	});
}

// 编辑保存申请
export function Api_ApplicationSaveEdit(id, params) {
	return request(`${fxb}${ecm}/customer/credit-apply/draft/${id}`, {
		method: 'put',
		params
	});
}

// 提交申请
export function Api_ApplicationSubmit(params) {
	return request(`${fxb}${ecm}/customer/credit-apply`, {
		method: 'post',
		params
	});
}

// 授信申请详情
export function Api_ApplicationDetai(id) {
	return request(`${fxb}${ecm}/customer/credit-apply/${id}`, {
		method: 'get'
	});
}

// 删除申请
export function Api_ApplicationDetele(id) {
	return request(`${fxb}${ecm}/customer/credit-apply/${id}`, {
		method: 'delete'
	});
}

// 授信初审列表
export function Api_TrialGetList(params) {
	return request(`${fxb}${ecm}/customer/credit-apply/audit-page`, {
		method: 'get',
		params
	});
}

// 授信初审保存
export function Api_ApprovalSave(id, params) {
	return request(`${fxb}${ecm}/customer/credit-apply/cs-draft/${id}`, {
		method: 'post',
		params
	});
}
// 授信初审提交
export function Api_ApprovalSubmit(id, params) {
	return request(`${fxb}${ecm}/customer/credit-apply/cs-approve/${id}`, {
		method: 'post',
		params
	});
}

// 授信初审详情
export function Api_ApprovalDetail(id) {
	return request(`${fxb}${ecm}/customer/credit-apply/audit/${id}`, {
		method: 'get'
	});
}
// 驳回
export function Api_ApprovalDelete(id, params) {
	return request(`${fxb}${ecm}/customer/credit-apply/cs-reject/${id}`, {
		method: 'post',
		dataForm: true,
		params: {
			remark: params
		}
	});
}

// 授信额度占用/释放明细
export function Api_GetDetail(params) {
	return request(`${fxb}${ecm}/customer/credit/detail/page`, {
		method: 'get',
		params
	});
}

// 授信额度占用/释放明细
export function Api_GetAccounts(customerId, params) {
	return request(`${fxb}${ecm}/customer/credit/accounts/${customerId}`, {
		method: 'get',
		params
	});
}

// 获取授信历史
export function Api_GetHistory(id) {
	return request(`${fxb}${ecm}/customer/credit-apply/history/company/${id}`, {
		method: 'get'
	});
}

// 实时发起时初审时终审时
export function Api_GetCreditHis(businessKey) {
	return request(`${fxb}${ecm}/customer/credit/grade/credit-his/${businessKey}`, {
		method: 'get'
	});
}

// 获取评估详情
export function Api_GetAssessmentDetail(id) {
	return request(`${fxb}${ecm}/evaluate/record/execute/history/${id}`, {
		method: 'get'
	});
}

// 授信待我处理的数量
export function Api_GetCount(params) {
	return request(`${fxb}${ecm}/customer/credit-apply/count`, {
		method: 'get',
		params
	});
}

// 临时授信时能否循环授信
export function Api_isCycle(companyId) {
	return request(`${fxb}${ecm}/customer/credit-apply/history/real/${companyId}`, {
		method: 'get'
	});
}

// 修改授信策略总额
export function Api_CreditCustomerTotal(id, params) {
	return request(`${fxb}${ecm}/customer/credit/strategy/${id}`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 修改授信策略方案
export function Api_CreditCustomerPlan(id, params) {
	return request(`${fxb}${ecm}/customer/credit/grade/${id}`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// 现金折扣方案列表
export function Api_DiscountPlan() {
	return request(`${fxb}${ecm}/credit/money/discount/page`, {
		method: 'get'
	});
}
// 新增现金折扣方案
export function Api_AddCreditCustomerPlan(params) {
	return request(`${fxb}${ecm}/credit/money/discount`, {
		method: 'post',
		params
	});
}
// 编辑现金折扣方案
export function Api_EditCreditCustomerPlan(id, params) {
	return request(`${fxb}${ecm}/credit/money/discount/${id}`, {
		method: 'put',
		params
	});
}
// 启用、禁用现金折扣方案
export function Api_DiscountPlanOn(params, id) {
	return request(`${fxb}${ecm}/credit/money/discount/${id}`, {
		method: 'patch',
		dataForm: true,
		params
	});
}
// 获取折扣方案详情
export function Api_GetDiscountPlan(id) {
	return request(`${fxb}${ecm}/credit/money/discount/${id}`, {
		method: 'get'
	});
}
// 删除现金折扣方案
export function Api_GdelDiscountPlan(id) {
	return request(`${fxb}${ecm}/credit/money/discount/${id}`, {
		method: 'delete'
	});
}

// 信用检查规则列表
export function Api_CreditRule() {
	return request(`${fxb}${ecm}/credit/check/rule/page`, {
		method: 'get'
	});
}

// 新增信用检查
export function Api_AddCreditCustomerRule(params) {
	return request(`${fxb}${ecm}/credit/check/rule`, {
		method: 'post',
		dataForm: true,
		params
	});
}
// 获取信用检查详情
export function Api_GetDiscountRule(id) {
	return request(`${fxb}${ecm}/credit/check/rule/${id}`, {
		method: 'get'
	});
}
// 编辑信用检查
export function Api_EditCreditCustomerRule(id, params) {
	return request(`${fxb}${ecm}/credit/check/rule/${id}`, {
		method: 'put',
		dataForm: true,
		params
	});
}
// 启用、禁用信用规则
export function Api_DiscountRuleOn(params, id) {
	return request(`${fxb}${ecm}/credit/check/rule/${id}`, {
		method: 'patch',
		dataForm: true,
		params
	});
}
// 删除信用检查
export function Api_GdelDiscountRule(id) {
	return request(`${fxb}${ecm}/credit/check/rule/${id}`, {
		method: 'delete'
	});
}
