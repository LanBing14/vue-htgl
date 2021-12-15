import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 财务报表管理列表
export function Api_financialGetReportList(params) {
    return request(`${fxb}${ecm}/customer/financial/getReportList`, {
        method: "get",
        params
    });
}

// 财务报表管理列表
export function Api_financialGetEasyDetail(params) {
    return request(`${fxb}${ecm}/customer/financial/getReportEasyDetail`, {
        method: "get",
        params
    });
}

// 获取财务分析数据
export function Api_financialGetAnalysis(params) {
    return request(`${fxb}${ecm}/customer/financial/getAnalysis`, {
        method: "get",
        params
    });
}

// 获取破产风险预测数据
export function Api_getBankruptcyRiskPrediction(params) {
    return request(
        `${fxb}${ecm}/customer/financial/getBankruptcyRiskPrediction`,
        {
            method: "get",
            params
        }
    );
}

// 报表记录删除
export function Api_financialDelReport(params) {
    return request(`${fxb}${ecm}/customer/financial/delReport`, {
        method: "delete",
        dataForm: true,
        params
    });
}

// 附件下载
export function Api_financialGetFiles(params) {
    return request(`${fxb}${ecm}/customer/financial/getFiles`, {
        method: "get",
        params
    });
}

// 获取详情信息
export function Api_financialGetDetails(params) {
    return request(`${fxb}${ecm}/customer/financial/getDetails`, {
        method: "get",
        params
    });
}

// 新增报告-提交
export function Api_financialAddReports(params) {
    return request(`${fxb}${ecm}/customer/financial/addReports`, {
        method: "post",
        params
    });
}

// 新增报告-保存
export function Api_financialSaveReports(params) {
    return request(`${fxb}${ecm}/customer/financial/saveReports`, {
        method: "post",
        params
    });
}

// 修改报告
export function Api_financialEditReports(params) {
    return request(`${fxb}${ecm}/customer/financial/editReports`, {
        method: "post",
        params
    });
}

// Excel导入-资产负债
export function Api_financialImportDebtSheet(params) {
    return request(`${fxb}${ecm}/customer/financial/importDebtSheet`, {
        method: "get",
        params
    });
}

// Excel导入-利润表
export function Api_financialImportProfitSheet(params) {
    return request(`${fxb}${ecm}/customer/financial/importProfitSheet`, {
        method: "get",
        params
    });
}

// Excel导入-现金流量
export function Api_financialImportCashSheet(params) {
    return request(`${fxb}${ecm}/customer/financial/importCashSheet`, {
        method: "get",
        params
    });
}
