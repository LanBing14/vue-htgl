import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

// 列表
export function Api_GoodsPage(params) {
    return request(`${fxb}${ecm}/orderNoShip/getShipPage`, {
        method: "get",
        params
    });
}

// 待我处理
export function Api_GoodsCount(params) {
    return request(`${fxb}${ecm}/orderNoShip/getShipCount`, {
        method: "get",
        params
    });
}

// 发货时合同信息
export function Api_ContractInfo(id) {
    return request(`${fxb}${ecm}/goods/${id}`, {
        method: "get"
    });
}

// 监测是否不良客户
export function Api_ClientValid(id) {
    return request(`${fxb}${ecm}/goods/valid/${id}`, {
        method: "get"
    });
}

// 发货申请
export function Api_ShippingApplication(id, params) {
    return request(`${fxb}${ecm}/goods/${id}`, {
        method: "post",
        params
    });
}

// 详情
export function Api_GoodsInfo(id) {
    return request(`${fxb}${ecm}/goods/process/${id}`, {
        method: "get"
    });
}
export function Api_NewGoodsInfo(id, params) {
    return request(`${fxb}${ecm}/orderNoShip/arrivalDetail/${id}`, {
        method: "get",
        params
    });
}
// 到货登记
export function Api_NewGoosIn(params) {
    return request(`${fxb}${ecm}/orderNoShip/arrivalRegistration`, {
        method: "post",
        params
    });
}

// 出库 登记
export function Api_GoosOut(id, params) {
    return request(`${fxb}${ecm}/goods/out/${id}`, {
        method: "post",
        params
    });
}

// 入库 登记
export function Api_GoosIn(id, params) {
    return request(`${fxb}${ecm}/goods/arrival/${id}`, {
        method: "post",
        params
    });
}

// 删除
export function Api_OrderNoShip(id) {
    return request(`${fxb}${ecm}/orderNoShip/${id}`, {
        method: "delete"
    });
}

// 发货登记详情中的到货登记down
export function Api_ArrivalDetail(id) {
    return request(`${fxb}${ecm}/orderNoShip/shipDetail/arrivalDetail/${id}`, {
        method: "get"
    });
}

// 发货登记详情中的发货登记up
export function Api_ShipDetail(shipId, contractId) {
    return request(`${fxb}${ecm}/orderNoShip/shipDetail/shipDetail/${shipId}/${contractId}`, {
        method: "get"
    });
}
