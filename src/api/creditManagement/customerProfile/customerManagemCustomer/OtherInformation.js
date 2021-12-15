import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";

export function Api_getContacts(params) {
    return request(`${fxb}${ecm}/customer/archives/getContacts/${params.companyId}`, {
        method: "get",
        params
    });
}

export function Api_getBankAccount(params) {
    return request(`${fxb}${ecm}/customer/archives/getBankAccount/${params.companyId}`, {
        method: "get",
        params
    });
}

export function Api_saveContacts(params) {
    return request(`${fxb}${ecm}/customer/archives/saveContacts`, {
        method: "post",
        params
    });
}

export function Api_editContacts(id, params) {
    return request(`${fxb}${ecm}/customer/archives/editContacts/${id}`, {
        method: "put",
        params
    });
}

export function Api_deleteContacts(id) {
    return request(`${fxb}${ecm}/customer/archives/deleteContacts/${id}`, {
        method: "delete"
    });
}

export function Api_saveBankAccount(params) {
    return request(`${fxb}${ecm}/customer/archives/saveBankAccount`, {
        method: "post",
        params
    });
}

export function Api_editBankAccount(id, params) {
    return request(`${fxb}${ecm}/customer/archives/editBankAccount/${id}`, {
        method: "put",
        params
    });
}

export function Api_deleteBankAcount(id) {
    return request(`${fxb}${ecm}/customer/archives/deleteBankAcount/${id}`, {
        method: "delete"
    });
}

// 发票抬头-列表
export function Api_InvoiceGetList({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getInvoice/${companyId}`, {
        method: "get"
    });
}

// 发票抬头-新增
export function Api_InvoiceAdd(params) {
    return request(`${fxb}${ecm}/customer/archives/saveInvoice`, {
        method: "post",
        params
    });
}

// 发票抬头-编辑
export function Api_InvoiceUpdate(id, params) {
    return request(`${fxb}${ecm}/customer/archives/editInvoice/${id}`, {
        method: "put",
        params
    });
}

// 发票抬头-删除
export function Api_InvoiceDelete(id) {
    return request(`${fxb}${ecm}/customer/archives/deleteInvoice/${id}`, {
        method: "delete"
    });
}

// 收货地址-列表
export function Api_ReceiverGetList({companyId}) {
    return request(`${fxb}${ecm}/customer/archives/getReceiver/${companyId}`, {
        method: "get"
    });
}

// 收货地址-新增
export function Api_ReceiverAdd(params) {
    return request(`${fxb}${ecm}/customer/archives/saveReceiver`, {
        method: "post",
        params
    });
}

// 收货地址-编辑
export function Api_ReceiverUpdate(id, params) {
    return request(`${fxb}${ecm}/customer/archives/editReceiver/${id}`, {
        method: "put",
        params
    });
}

// 收货地址-删除
export function Api_ReceiverDelete(id) {
    return request(`${fxb}${ecm}/customer/archives/deleteReceiver/${id}`, {
        method: "delete"
    });
}
