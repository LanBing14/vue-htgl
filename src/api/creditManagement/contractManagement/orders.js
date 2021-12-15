import request from "@/utils/request";
import { fxb } from "@/utils/variables";
import { stringify } from "qs";

// 列表
export function Api_orderGetList(params) {
    return request(`${fxb}/ecm/contract-order-manage/page`, {
        method: "get",
        params
    });
}

// 订单-保存
export function Api_NewOrderSave(params) {
    return request(`${fxb}/ecm/contract-order-manage/order/draft`, {
        method: "post",
        params
    });
}

// 订单-提交
export function Api_NewOrderSubmit(params) {
    return request(`${fxb}/ecm/contract-order-manage/order`, {
        method: "post",
        params
    });
}

// 订单-签约
export function Api_orderSign(id, params) {
    return request(`${fxb}/ecm/contract-order-manage/sign/${id}`, {
        method: "post",
        params
    });
}

// 订单-判断是否可以变更
export function Api_orderChangeJudge(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/judge-change-access/${id}`,
        { method: "get", params }
    );
}

// 订单-获取详情
export function Api_orderDetail(id, params) {
    return request(`${fxb}/ecm/contract-order-manage/${id}`, {
        method: "get",
        params
    });
}

// 订单-变更-保存
export function Api_orderChangeSave(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/order/change-apply/${id}/draft`,
        { method: "post", params }
    );
}

// 订单-变更-提交
export function Api_orderChangeSubmit(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/order/change-apply/${id}`,
        { method: "post", params }
    );
}

// 订单-履约完成/取消-保存
export function Api_orderOtherSave(id, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/order/other-apply/${id}/draft`,
        { method: "post", params }
    );
}

// 订单-履约完成/取消-提交
export function Api_orderOtherSubmit(id, params) {
    return request(`${fxb}/ecm/contract-order-manage/order/other-apply/${id}`, {
        method: "post",
        params
    });
}

// 合同/订单获取顶部统计
export function Api_contractOrderStatistics(params) {
    return request(`${fxb}/ecm/contract-order-manage/statistics`, {
        method: "get",
        params
    });
}

// 获取统计设置信息
export function Api_contractOrderStatisticsEdit(params) {
    return request(`${fxb}/ecm/contract-order-manage/statistics-model-info`, {
        method: "get",
        params
    });
}

// 保存统计设置信息
export function Api_contractOrderStatisticsSave(data, params) {
    return request(
        `${fxb}/ecm/contract-order-manage/statistics-model-info?${stringify(
            data
        )}`,
        {
            method: "post",
            params
        }
    );
}

// 待我处理数和快到期数
export function Api_contractOrderCount(params) {
    return request(`${fxb}/ecm/contract-order-manage/count`, {
        method: "get",
        params
    });
}

// 获取订单/合同的变更记录
export function Api_changeRecords(params) {
    return request(
        `${fxb}/ecm/contract-order-manage/change-apply-list/${params.id}`,
        {
            method: "get",
            params
        }
    );
}

// 合同/订单-详情-tab页，4个
export function Api_paymentDetailList(params) {
    return request(`${fxb}/ecm/payment/pay-plan/${params.id}`, {
        method: "get"
    });
}

//订单发货信息

export function Api_shipDetailOrder(params) {
    return request(`${fxb}/ecm/orderNoShip/getContractInfo/${params.id}`, {
        method: "get"
    });
}

export function Api_shipDetailList(params) {
    return request(`${fxb}/ecm/orderNoShip/ship-list/${params.id}`, {
        method: "get"
    });
}
export function Api_fingdByContractId(params) {
    return request(`${fxb}/ecm/payment/contract-registers/${params.id}`, {
        method: "get"
    });
}
export function Api_invoiceDetailList(params) {
    return request(`${fxb}/ecm/contract-invoice/detail/all/${params.id}`, {
        method: "get"
    });
}
export function Api_collectionDetailList(params) {
    return request(
        `${fxb}/ecm/collection/collection/info/contract/${params.id}`,
        {
            method: "get"
        }
    );
}

// 合同/订单删除待提交申请
export function Api_delApply(id) {
    return request(`${fxb}/ecm/contract-order-manage/del-apply/${id}`, {
        method: "delete"
    });
}
