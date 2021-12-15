import request from "@/utils/request";
import { fxb } from "@/utils/variables";

// 待发货分页列表
export function Api_orderNoShipPage(params) {
    return request(`${fxb}/ecm/orderNoShip/page`, {
        method: "get",
        params
    });
}

// 待我处理以及即将过期数据统计
export function Api_orderNoShipCount(params) {
    return request(`${fxb}/ecm/orderNoShip/count`, {
        method: "get",
        params
    });
}

// 发货登记详情
export function Api_orderNoShipDetail(id, params) {
    return request(`${fxb}/ecm/orderNoShip/detail/${id}`, {
        method: "get",
        params
    });
}

// 发货登记操作
export function Api_shipmentRegistration(params) {
    return request(`${fxb}/ecm/orderNoShip/shipmentRegistration`, {
        method: "post",
        params
    });
}
