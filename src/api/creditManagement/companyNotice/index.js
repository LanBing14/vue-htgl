import request from "@/utils/request";
import { fxb, ecm } from "@/utils/variables";
import {stringify} from "qs";

// 获取企业通知列表
export function Api_GetNoticeList(params) {
    return request(`/park/notice/noticeList`, {
        method: "get",
        params
    });
}

// 获取企业通知详情
export function Api_GetNoticeDetail(noitceId) {
    return request(`/park/notice/detail/${noitceId}`, {
        method: "get"
    });
}