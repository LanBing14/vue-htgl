import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 销售合同台账列表
export function Api_ContractGetList(params) {
    return request(`${fxb}/ecm/contract-order-manage/page`, {
        method: "get",
        params
    });
}

// 合同/订单-获取编号
export function Api_getNewContractCode(params) {
    return request(`${fxb}/ecm/contract-order-manage/code`, {
        method: "get",
        params
    });
}

// 合同-提交
export function Api_NewContractSubmit(params) {
    return request(`${fxb}/ecm/contract-order-manage/contract`, {
        method: "post",
        params
    });
}

// 合同-保存
export function Api_NewContractSave(params) {
    return request(`${fxb}/ecm/contract-order-manage/contract/draft`, {
        method: "post",
        params
    });
}

// 合同变更判断
export function Api_ChangeContractJudge(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/judge-change-access/${id}`, {
            method: "get",
            params
        }
    );
}

// 合同变更-保存
export function Api_ChangeContractSave(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/contract/change-apply/${id}/draft`, {
            method: "post",
            params
        }
    );
}

// 合同变更-提交
export function Api_ChangeContractSubmit(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/contract/change-apply/${id}`, {
            method: "post",
            params
        }
    );
}

// 合同履约/取消-保存
export function Api_OtherContractSave(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/contract/other-apply/${id}/draft`, {
            method: "post",
            params
        }
    );
}

// 合同履约/取消-提交
export function Api_OtherContractSubmit(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/contract/other-apply/${id}`, {
            method: "post",
            params
        }
    );
}

// 合同签约
export function Api_ChangeContractSign(id, params) {
    return request(`${fxb}/ecm/contract-order-manage/sign/${id}`, {
        method: "post",
        params
    });
}

// 合同完成/取消申请
export function Api_ContractCompleteCancel(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/contract/other-apply/${id}`, {
            method: "post",
            params
        }
    );
}

// 合同详情
export function Api_ContractDetail(id) {
    return request(`${fxb}/ecm/contract-order-manage/${id}`, {
        method: "get"
    });
}

// 合同详情
export function Api_getContractGoods(id) {
    return request(`${fxb}/ecm/contract-order-manage/goods-list/${id}`, {
        method: "get"
    });
}

// 付款计划跟踪查询列表
export function Api_PaymentGetList(params) {
    return request(`${fxb}/ecm/payment/page`, {
        method: "get",
        params
    });
}

// 付款计划跟踪统计
export function Api_PaymentStatistics() {
    return request(`${fxb}/ecm/payment/statistics`, {
        method: "get"
    });
}

// 收款登记
export function Api_PaymentRegister(id, params) {
    return request(`${fxb}/ecm/payment/${id}`, {
        method: "post",
        params
    });
}

// 收款详情
export function Api_PaymentDetails(id) {
    return request(`${fxb}/ecm/payment/${id}`, {
        method: "get"
    });
}

// 收款详情
export function Api_PaymentCancellation(id, params) {
    return request(`${fxb}/ecm/payment/cancellation/${id}`, {
        method: "post",
        params
    });
}

// 客户账龄信息查询列表
export function Api_AccountAgeGetList(params) {
    return request(`${fxb}/ecm/analyse-account-age/page`, {
        method: "get",
        params
    });
}

// 获取信用等级及授信情况
export function Api_CreaditRating(id) {
    return request(`${fxb}/ecm/customer/credit/grade/credit/${id}`, {
        method: "get"
    });
}

// 获取客户列表
export function Api_ClientGetList(params) {
    return request(`${fxb}/ecm/customer/credit/customer`, {
        method: "get",
        params
    });
}

// 获取包含已删除的客户列表
export function Api_ClientGetListAll(params) {
    return request(`${fxb}/ecm/customer/credit/customerIncludeRemove`, {
        method: "get",
        params
    });
}

// 合同作废
export function Api_CancelContract(id) {
    return request(`${fxb}/ecm/contract-order-manage/${id}`, {
        method: "delete"
    });
}

// 获取核销登记信息
export function Api_PaymentCancellationDetail(id) {
    return request(`${fxb}/ecm/payment/cancellation/${id}`, {
        method: "get"
    });
}

// 获取图片
export function Api_GetPictrues(type, linkId) {
    return request(`/fs/fs/attachments/${type}/${linkId}`, {
        method: "get"
    });
}

// 应收账款管理-快捷筛选-统计
export function Api_getPaymentCount(params) {
    return request(`${fxb}/ecm/payment/count`, {
        method: "get",
        params
    });
}

// 当前合同付款履约情况
export function Api_CurrentContractPayment(id) {
    return request(`${fxb}/ecm/contract-order-manage/current/${id}`, {
        method: "get"
    });
}

// 判断当前客户是否存在当前用户所负责的待提交的合同/订单
export function Api_judgeTodoContractOrder(customerId, responseId, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/judge-todo-contract-order/${customerId}/${responseId}`, {
            method: "get",
            params
        }
    );
}

// 下载模版
export function Api_contractOrderModelDownload(params) {
    return request(`${fxb}/ecm/contract-order-manage/download`, {
        method: "post",
        dataForm: true,
        params
    });
}