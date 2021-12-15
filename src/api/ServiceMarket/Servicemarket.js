import request from "@/utils/request";
import { fs } from "@/utils/variables";
/**图片上传 */
export function Api_fileUrl() {
    return `${fs}/fs/attachments/`;
}


// 文件上传
export function Api_upload(url, file) {
    return request(url, {
        method: "post",
        params: file
    });
}


/**报修申请接口*/
export function Api_baoxiuSq(query) {
    return request("/park/repair/add", {
        method: "post",
        params: query
    });
}


/**访客预约接口*/
export function Api_visitorSq(query) {
    return request("/park/visitor/add", {
        method: "post",
        params: query
    });
}


/** 装修申请*/
export function Api_getAddress() {
    return request("/park/decoration/getAddress", {
        method: "get"
    });
}


/**装修申请提交 */
export function Api_Decapplication(query) {
    return request("/park/decoration/add", {
        method: "post",
        params: query
    });
}



/**新增报修接口 */

/**新增报修园区接口 */
export function Api_getParks(query) {
    return request("/park/repair/getBusiness", {
        method: "get",
    });
}


export function Api_getRooms(query){
    return request("/park/repair/getAddress", {
        method: "get",
        params: query
    });
}


