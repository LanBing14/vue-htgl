import request from "@/utils/request";
import { fxb, ecm } from '@/utils/variables';

// 获取指标模型分页数据
export function Api_EvaluateModelPage(params) {
    return request(`${fxb}${ecm}/evaluate/model/page`, {
        method: 'get',
        params
    });
}

// 添加——指标模型数据(第一页)
export function Api_EvaluateModelFirst(params) {
    return request(`${fxb}${ecm}/evaluate/model/first`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 获取——指标模型数据(第一页)
export function Api_EvaluateModelFirstGet(id) {
    return request(`${fxb}${ecm}/evaluate/model/first/${id}`, {
        method: 'get'
    });
}

// 修改——指标模型数据(第一页)
export function Api_EvaluateModelFirstUpdate(id, params) {
    return request(`${fxb}${ecm}/evaluate/model/first/${id}`, {
        method: 'put',
        dataForm: true,
        params
    });
}

// 添加——指标模型数据(第二页)
export function Api_EvaluateModelSecond(id, params) {
    return request(`${fxb}${ecm}/evaluate/model/second/${id}`, {
        method: 'post',
        params
        // headers:{
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        // },
        // params: stringify(params, { indices: false })
    });
}

// 获取——指标模型数据(第二页)
export function Api_EvaluateModelSecondGet(id) {
    return request(`${fxb}${ecm}/evaluate/model/second/${id}`, {
        method: 'get'
    });
}

// 添加——指标模型数据(第三页)
export function Api_EvaluateModelThird(id, params) {
    return request(`${fxb}${ecm}/evaluate/model/third/${id}`, {
        method: 'post',
        params
    });
}

// 获取——指标模型数据(第三页)
export function Api_EvaluateModelThirdGet(id) {
    return request(`${fxb}${ecm}/evaluate/model/third/${id}`, {
        method: 'get'
    });
}

// 添加——指标模型数据(第三页)
export function Api_EvaluateModelFour(id, params) {
    return request(`${fxb}${ecm}/evaluate/model/four/${id}`, {
        method: 'post',
        params
    });
}




export function Api_xian() {
    return request(`${fxb}${ecm}/evaluate/model/super`, {
        method: 'post'
    });
}



// 获取——指标模型数据(第三页)
export function Api_EvaluateModelFourGet(id) {
    return request(`${fxb}${ecm}/evaluate/model/four/${id}`, {
        method: 'get'
    });
}

// 判断是否有别的模型正在启用
export function Api_EvaluateModelStatus(id) {
    return request(`${fxb}${ecm}/evaluate/model/status/${id}`, {
        method: 'get'
    });
}

// 启用/禁用模型
export function Api_EvaluateModelStatusUpdate(id, status) {
    return request(`${fxb}${ecm}/evaluate/model/status/${id}/${status}`, {
        method: 'put'
            // params
    });
}

// 发布模型
export function Api_publishModel(id) {
    return request(`${fxb}/ecm/evaluate/model/release/${id}`, {
        method: 'put'
            // params
    });
}

// 删除模型
export function Api_deleteModel(id) {
    return request(`${fxb}/ecm/evaluate/model/${id}`, {
        method: 'delete'
            // params
    });
}

// 复制模型
export function Api_EvaluateModelCopy(id, params) {
    return request(`${fxb}${ecm}/evaluate/model/copy/model/${id}`, {
        method: 'post',
        dataForm: true,
        params
    });
}

// 更新模型
export function Api_EvaluateModelRefresh(id) {
    return request(`${fxb}${ecm}/evaluate/model/refresh/${id}`, {
        method: 'put'
            // params
    });
}