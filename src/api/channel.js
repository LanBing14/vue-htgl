import request from "../utils/request";
import {fxb} from "@/utils/variables";

// 渠道合作申请
export function Api_SendCooperationMail(params) {
    return request(`${fxb}/ecm/channel/cooperation/sendCooperationMail`, {
        method: "post",
        dataForm: true,
        params
    });
}
