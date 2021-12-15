import request from "@/utils/request";
import { upms, fxb, ecm } from "@/utils/variables";

// 获取31个省市数据
export function Api_Province() {
    return request(`${upms}/system/areas/provinces`, {
        method: "get"
    });
}

// 获取20个行业类别
export function Api_IndustryCategory() {
    return request(`${upms}/combobox/industry`, {
        method: "get"
    });
}

/**
 * 历史搜索
 * @param params 查询关键词
 * @constructor
 */
export function Api_HistorySearch(params) {
    return request(`${fxb}/enterprise-search/query-history`, {
        method: "get",
        params
    });
}

// 高级搜索
export function Api_AdvanceSearch(params, type) {
    return request(
        `${fxb}/enterprise-search/subjectQueryList`,
        {
            method: "get",
            params
        },
        type || "1"
    );
}

// 高级搜索
export function Api_QueryHot(params) {
    return request(`${fxb}/enterprise-search/query-hot`, {
        method: "get",
        params
    });
}

// 信用文档
// { companyId:'', companyName:''}
export function Api_getCteditCompanyInfo(params) {
    return request(`${fxb}/eci/baseMsg/getCompanyInfo`, {
        method: "post",
        params: params
    });
}

// 信用评价
export function Api_getCreditScore({ companyId }) {
    return request(`${fxb}/eci/score-manage/${companyId}/credit-score`, {
        method: "get"
    });
}

// 档案信息
export function Api_getBasicInfo(type, params) {
    let url = `${fxb}/eci/baseMsg`;
    switch (type) {
        case 1: // 股权结构
            url += "/getCompanyPartnersByPage";
            break;
        case 2: // 对外投资
            url += "/getOperationInvestInfoByPage";
            break;
        case 3: // 分支机构
            url += "/getCompanyBranchesByPage";
            break;
        case 4: // 工商记录变更
            url += "/getCompanyChangeRecordsByPage";
            break;
        case 5: // 经营范围变更
            url += "/getCompanyChangeScopeByPage";
            break;
        case 6: // 专利信息
            url += "/getAssetPatentDetailByPage";
            break;
        case 7: // 软件著作权信息
            url += "/getOperationSoftwareCopyrightsByPage";
            break;
        case 8: // 商标信息
            url += "/getAssetTmInfoByPage";
            break;
        case 9: // 动产抵押
            url += "/getOperationMpledgeByPage";
            break;
        case 10: // 股权出质
            url += "/getOperationPledgeByPage";
            break;
        case 11: // 工商异常名录
            url += "/getCompanyOpexceptionByPage";
            break;
        case 12: // 被执行人信息
            url += "/getAssetZhiXingByPage";
            break;
        case 13: // 失信被执行信息
            url += "/getAssetShiXinByPage";
            break;
        case 14: // 裁判文书信息
            url += "/getAssetCaseByPage";
            break;
        case 15: // 法院公告信息
            url += "/getAssetChinacourtByPage";
            break;
        case 16: // 企业舆情信息
            url += "/getOperationNewsInfoByPage";
            break;
        case 17: // 招聘类信息
            url += "/getOperationRecruitInfoByPage";
            break;
        case 18: // 清算信息
            url += "/getOperationLiquidationByPage";
            break;
        case 19: // 招投标信息
            url += "/getOperationTenderInfoByPage";
            break;
        case 20: // 作品著作权信息
            url += "/getOperationCopyrightByPage";
            break;
        case 21: // 网站信息
            url += "/getOperationWebsiteByPage";
            break;
        case 22: // 证书信息
            url += "/getAssetCertificationByPage";
            break;
        case 23: // 融资信息
            url += "/getOperationFinancingByPage";
            break;
        case 24: // 财务总览信息
            url += "/getOperationFinancingTaxByPage";
            break;
        case 25: // 产品信息
            url += "/getOperationProductByPage";
            break;
        case 26: // 抽查信息
            url += "/getOperationSpotcheckByPage";
            break;
        case 27: // 行政处罚信息
            url += "/getDetailOperationPenaltyByPage";
            break;
    }

    return request(url, {
        method: "post",
        params: params
    });
}

// 企业图谱 {companyId: thiss.companyId}
export function Api_getTuPuDatas(companyId) {
    return request(`${fxb}/eci/enter-map/tupu-datas/${companyId}`, {
        method: "get"
    });
}

// 关联链图数据 {companyId: this.companyId}
export function Api_getLinkDatas(companyId) {
    return request(`${fxb}/eci/enter-map/link-datas/${companyId}`, {
        method: "get"
    });
}

// 股权结构数据 {companyId: this.companyId}
export function Api_getGUQuanDatasByQcc(companyId) {
    return request(`${fxb}/eci/enter-map/guquan-datas/${companyId}`, {
        method: "get"
    });
}

// 生成下载报告的订单信息
export function Api_GenReportOrder(params) {
    return request(`${fxb}/credit-report/report-order`, {
        method: "post",
        params: params
    });
}

// 获取下载报告
export function Api_DownloadReportPDF(params) {
    return request(`${fxb}/credit-report/credit-report`, {
        method: "post",
        params: params
    });
}

// 获取报告类型信息
export function Api_GetReportType(params) {
    return request(`${fxb}/credit-report/report-type`, {
        method: "get",
        params: params
    });
}

// 获取免费次数
export function Api_GetFreeNum() {
    return request(`${upms}/pay/orders/getTimesBySaas`, {
        method: "get"
    });
}

// cp企业图谱
export function Api_GraphBasic(searchKey) {
    return request(`${fxb}${ecm}/graph/database/basic`, {
        method: "get",
        params: {
            searchKey
        }
    });
}

// cp关联链图
export function Api_GraphDeep(searchKey, deep = 3) {
    return request(`${fxb}${ecm}/graph/database/deep`, {
        method: "get",
        params: {
            searchKey,
            deep
        }
    });
}

// cp股权结构
export function Api_GraphPartner(searchKey) {
    return request(`${fxb}${ecm}/graph/database/partner`, {
        method: "get",
        params: {
            searchKey
        }
    });
}

// cp收益股东
export function Api_earningShareholder(searchKey, deep) {
    return request(`${fxb}${ecm}/graph/database/benefit`, {
        method: "get",
        params: {
            searchKey,
            deep
        }
    });
}

// 获取关键词
export function Api_earningQueryKey() {
    return request(`${fxb}/enterprise-search/query-key`, {
        method: "get"
    });
}

// 最新风险
export function Api_earningQueryRisk(params) {
    return request(`${fxb}/enterprise-search/query-risk`, {
        method: "get",
        params
    });
}
