import request from '@/utils/request';
import { fxb, ecm } from '@/utils/variables';

// 经营概括 列表
export function Api_EconomicOverviewPage(params) {
	return request(`/enterprise/businessInformation/economicOverviewPage`, {
		method: 'get',
		params
	});
}
// 经营概括 详情
export function Api_EconomicOverviewDetail(params) {
	return request(`/enterprise/businessInformation/economicOverviewDetail/${params}`, {
		method: 'get'
	});
}
// 财务信息 列表
export function Api_FinancialInformationPage(params) {
	return request(`/enterprise/businessInformation/financialInformationPage`, {
		method: 'get',
		params
	});
}

// 财务信息 详情
export function Api_FinancialInformationDetail(params) {
	return request(`/enterprise/businessInformation/financialInformationDetail/${params}`, {
		method: 'get'
	});
}
// 资质证书 列表
export function Api_QualificationCertificatePage(params) {
	return request(`/enterprise/businessInformation/qualificationCertificatePage`, {
		method: 'get',
		params
	});
}
// 资质证书 详情
export function Api_QualificationCertificateDetail(params) {
	return request(`/enterprise/businessInformation/qualificationCertificateDetail/${params}`, {
		method: 'get'
	});
}
// 融资信息
export function Api_FinancingSituationPage(params) {
	return request(`/enterprise/businessInformation/financingSituationPage/${params}`, {
		method: 'get'
	});
}

// 合作情况 列表
export function Api_CooperationPage(params) {
	return request(`/enterprise/businessInformation/cooperationPage`, {
		method: 'get',
		params
	});
}
// 合作情况 详情
export function Api_CooperationDetail(params) {
	return request(`/enterprise/businessInformation/cooperationDetail/${params}`, {
		method: 'get'
	});
}

// 企业资质 列表
export function Api_enterpriseQualificationPage(params) {
	return request(`/enterprise/businessInformation/enterpriseQualificationPage`, {
		method: 'get',
		params
	});
}

// 企业资质 详情
export function Api_enterpriseQualificationDetail(params) {
	return request(`/enterprise/businessInformation/enterpriseQualificationDetail/${params}`, {
		method: 'get'
	});
}

// 产品信息

export function Api_enterpriseProductPage(params) {
	return request(`/park/productInformation/productList`, {
		method: 'get',
		params
	});
}


// -------------------------------------------------------

// cp客户档案-知识产权-分页获取专利信息
export function Api_GetPatentDetailByPage(params) {
	return request(`${fxb}${ecm}/customer/archives/getPatentDetailByPage/${params.companyId}`, {
		method: 'get',
		params
	});
}

// cp客户档案-知识产权-分页获取专利信息-新增
export function Api_PatentDetailAdd(companyId, params) {
	return request(`${fxb}${ecm}/customer/base/info/archives-patent/${companyId}`, {
		method: 'post',
		dataForm: true,
		params
	});
}

// cp客户档案-知识产权-分页获取专利信息-修改
export function Api_PatentDetailUpdate(id, companyId, params) {
	return request(`${fxb}${ecm}/customer/base/info/archives-patent/${companyId}/${id}`, {
		method: 'put',
		dataForm: true,
		params
	});
}

// cp客户档案-知识产权-分页获取专利信息-删除
export function Api_PatentDetailDelete(id, companyId) {
	return request(`${fxb}${ecm}/customer/base/info/archives-patent/${companyId}/${id}`, {
		method: 'delete'
	});
}

// cp客户档案-知识产权- 分页获取作品著作权信息
export function Api_GeCopyrightInfoByPage(params) {
	return request(`${fxb}${ecm}/customer/archives/geCopyrightInfoByPage/${params.companyId}`, {
		method: 'get',
		params
	});
}

// cp客户档案-知识产权-分页获取网站信息
export function Api_GetWebsiteInfoByPage(params) {
	return request(`${fxb}${ecm}/customer/archives/getWebsiteInfoByPage/${params.companyId}`, {
		method: 'get',
		params
	});
}

// cp客户档案-知识产权-分页获取证书信息
export function Api_GetCertificateInfoByPage(params) {
	return request(`${fxb}${ecm}/customer/archives/getCertificateInfoByPage/${params.companyId}`, {
		method: 'get',
		params
	});
}

// cp客户档案-知识产权-分页获取商标信息
export function Api_GetTmInfoByPage(params) {
	return request(`${fxb}${ecm}/customer/archives/getTmInfoByPage/${params.companyId}`, {
		method: 'get',
		params
	});
}

// /////////// 软件著作权 新增&编辑&删除
export function Api_archivesSoftwareCopyrightAdd(companyId, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-software-copyright/${companyId}`, {
		dataForm: true,
		method: 'post',
		params
	});
}
export function Api_archivesSoftwareCopyrightEdit(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-software-copyright/${companyId}/${id}`, {
		dataForm: true,
		method: 'put',
		params
	});
}
export function Api_archivesSoftwareCopyrightDel(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-software-copyright/${companyId}/${id}`, {
		dataForm: true,
		method: 'delete',
		params
	});
}
// /////////// 作品著作权信息 新增&编辑&删除
export function Api_archivesCopyrightAdd(companyId, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-copyright/${companyId}`, {
		dataForm: true,
		method: 'post',
		params
	});
}
export function Api_archivesCopyrightEdit(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-copyright/${companyId}/${id}`, {
		dataForm: true,
		method: 'put',
		params
	});
}
export function Api_archivesCopyrightDel(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-copyright/${companyId}/${id}`, {
		dataForm: true,
		method: 'delete',
		params
	});
}
// /////////// 网站信息 新增&编辑&删除
export function Api_archivesWebsiteAdd(companyId, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-website/${companyId}`, {
		dataForm: true,
		method: 'post',
		params
	});
}
export function Api_archivesWebsiteEdit(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-website/${companyId}/${id}`, {
		dataForm: true,
		method: 'put',
		params
	});
}
export function Api_archivesWebsiteDel(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-website/${companyId}/${id}`, {
		dataForm: true,
		method: 'delete',
		params
	});
}
// /////////// 证书信息 新增&编辑&删除
export function Api_archivesCertificateAdd(companyId, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-certificate/${companyId}`, {
		dataForm: true,
		method: 'post',
		params
	});
}
export function Api_archivesCertificateEdit(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-certificate/${companyId}/${id}`, {
		dataForm: true,
		method: 'put',
		params
	});
}
export function Api_archivesCertificateDel(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-certificate/${companyId}/${id}`, {
		dataForm: true,
		method: 'delete',
		params
	});
}
// /////////// 商标信息 新增&编辑&删除
export function Api_archivesTmAdd(companyId, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-tm/${companyId}`, {
		dataForm: true,
		method: 'post',
		params
	});
}
export function Api_archivesTmEdit(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-tm/${companyId}/${id}`, {
		dataForm: true,
		method: 'put',
		params
	});
}
export function Api_archivesTmDel(companyId, id, params) {
	return request(`${fxb}/ecm/customer/base/info/archives-tm/${companyId}/${id}`, {
		dataForm: true,
		method: 'delete',
		params
	});
}
