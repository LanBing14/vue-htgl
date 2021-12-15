import request from "@/utils/request";

// 获取考试试卷信息
export function Api_GetExampaper(id) {
    return request("/user/center/exampaper/getExampaper", {
        method: "get",
        params: {
            id
        }
    });
}

// 提交试卷
export function Api_SubmitPapers(params) {
    return request("/user/center/exampaper/submitPapers", {
        method: "post",
        params: params
    });
}

// 获取考试时间倒计时
export function Api_GetExamDuration(params) {
    return request("/user/center/exampaper/getExamDuration", {
        method: "get",
        params: params
    });
}

// 获取考试时间倒计时
export function Api_GenExamination(params) {
    return request("/user/center/exampaper/genExamination", {
        method: "post",
        params: params
    });
}
