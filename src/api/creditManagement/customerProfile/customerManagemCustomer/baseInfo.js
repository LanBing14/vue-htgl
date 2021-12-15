import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// cp客户档案-客户概览-基础信息
export function Api_CustomerArchivesBaseInfo(companyId) {
    return request(`${fxb}${ecm}/customer/archives/overview/${companyId}`, {
        method: "get"
    });
}


// cp客户档案-基础档案-基础信息
export function Api_CustomerArchivesGetCompanyInfo(companyId) {
    return request(`${fxb}${ecm}/customer/archives/getCompanyInfo/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-基础档案-基础信息--新增
export function Api_CustomerArchivesCompanyInfoAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-base-info/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-基础档案-基础信息--修改
export function Api_CustomerArchivesCompanyInfoUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-base-info/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}


// cp客户档案-基础资料-股东信息
export function Api_CustomerArchivesGetPartners({ companyId }) {
    return request(`${fxb}${ecm}/customer/archives/getCompanyPartnersByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-基础资料-股东信息--新增
export function Api_CustomerArchivesPartnersAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-shareholder/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-股东信息--修改
export function Api_CustomerArchivesPartnersUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-shareholder/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-股东信息--删除
export function Api_CustomerArchivesPartnersDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-shareholder/${companyId}/${id}`, {
        method: "delete",
    });
}


// cp客户档案-基础资料-对外投资
export function Api_CustomerArchivesGetOperation({ companyId }) {
    return request(`${fxb}${ecm}/customer/archives/getOperationInvestInfoByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-基础资料-对外投资--新增
export function Api_CustomerArchivesOperationAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-foreign/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-对外投资--修改
export function Api_CustomerArchivesOperationUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-foreign/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-对外投资--删除
export function Api_CustomerArchivesOperationDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-foreign/${companyId}/${id}`, {
        method: "delete"
    });
}

// cp客户档案-基础资料-支付机构
export function Api_CustomerArchivesGetBranches({ companyId }) {
    return request(`${fxb}${ecm}/customer/archives/getCompanyBranchesByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-基础资料-支付机构--新增
export function Api_CustomerArchivesBranchesAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-batch/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-支付机构--修改
export function Api_CustomerArchivesBranchesUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-batch/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-支付机构--删除
export function Api_CustomerArchivesBranchesDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-batch/${companyId}/${id}`, {
        method: "delete"
    });
}


// cp客户档案-基础资料-变更记录
export function Api_CustomerArchivesGetChangeRecords({ companyId }) {
    return request(`${fxb}${ecm}/customer/archives/getCompanyChangeRecordsByPage/${companyId}`, {
        method: "get"
    });
}

// cp客户档案-基础资料-变更记录--新增
export function Api_CustomerArchivesChangeRecordsAdd(companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-record/${companyId}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-变更记录--修改
export function Api_CustomerArchivesChangeRecordsUpdate(id, companyId, params) {
    return request(`${fxb}${ecm}/customer/base/info/archives-record/${companyId}/${id}`, {
        method: "put",
        dataForm: true,
        params
    });
}

// cp客户档案-基础资料-变更记录--删除
export function Api_CustomerArchivesChangeRecordsDelete(id, companyId) {
    return request(`${fxb}${ecm}/customer/base/info/archives-record/${companyId}/${id}`, {
        method: "delete",
    });
}

// cp更新档案
export function Api_CustomerArchivesUpDate(companyId) {
    return request(`${fxb}${ecm}/customer/archives/archives/${companyId}`, {
        method: "post"
    });
}





/**新的API--------------------------------------------------- */
export function Api_baseInfo(companyId) {
    return request(`enterprise/base/information/info/${companyId}`, {
        method: "get"
    });
}

/**联系人信息 */
export function Api_contactInfo(params) {
    return request(`/enterprise/base/information/contacts`, {
        method: "get",
        params
    });
}

/**股权结构 */
export function Api_guQInfo(params) {
    return request(`/enterprise/base/information/structure`, {
        method: "get",
        params
    });
}


/**人力资源 */
export function Api_humanQInfo(params) {
    return request(`/enterprise/base/information/human`, {
        method: "get",
        params
    });
}

/**留学生 */
export function Api_studentInfo(params) {
    return request(`/enterprise/base/information/student`, {
        method: "get",
        params
    });
}


/**账单信息 */
export function Api_billsInfo(params) {
    return request(`/enterprise/rental/information/contract/bills`, {
        method: "get",
        params
    });
}
// 2021.9.25 最新账单信息接口 
export function Api_ysBillList(params) {
    return request(`/park/contract/ysBillList`, {
        method: "get",
        params
    });
}

// 2021.9.25 最新合同台账接口 
export function Api_contractList(params) {
    return request(`/park/contract/contractList`, {
        method: "get",
        params
    });
}

/**合同台账 */
export function Api_contractInfo(params) {
    return request(`/enterprise/rental/information/contract`, {
        method: "get",
        params
    });
}


/**人才项目 */
export function Api_rencaiInfo(params) {
    return request(`/enterprise/talentProject/talentProjectPage`, {
        method: "get",
        params
    });
}



/**招商信息 */
export function Api_investmentInformationInfoInfo(companyId) {
    return request(`/enterprise/investmentInformation/investmentInformationInfo/${companyId}`, {
        method: "get"
    });
}


/**科技项目 */
export function technologyProjectsInfo(params) {
    return request(`/enterprise/technologyProjects/technologyProjectsPage`, {
        method: "get",
        params
    });
}


/**行业领域下拉接口*/
export function Api_dictionary(params) {
    return request(`/enterprise/base/information/dictionary`, {
        method: "get",
        params
    });
}

/**下拉接口 */

export function Api_xiaLa(dictCode) {
    return request(`/upms/system/dictionaries/dictionary/${dictCode}`, {
        method: "get",
    });
}

//**判断有没有绑定园区 */
export function Api_entInfo(params) {
    return request(`/park/affiliatedInstitution/entInfo/institutions`, {
        method: "get",
        params
    });
}


/**当前所属机构 */
export function Api_isHasSuoShu(params) {
    return request(`/park/affiliatedInstitution/entInfo/currentInstitution`, {
        method: "get",
        params
    });
}

/**是否需要弹窗 */
export function Api_isNeedTan(params) {
    return request(`/park/affiliatedInstitution/entInfo/needBullet`, {
        method: "get",
        params
    });
}


/**发送请求绑定 */
export function Api_bind(params) {
    return request(`/park/affiliatedInstitution/entInfo/bind`, {
        method: "get",
        params
    });
}