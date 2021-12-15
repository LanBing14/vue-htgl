import request from "@/utils/request";
import { upms as modelBase, fs } from "@/utils/variables";

// 查询分页流程模型
export function Api_ActModelGetList(params) {
    return request(`${modelBase}/workflow/act-model/page`, {
        method: "get",
        params
    });
}

// 新增流程模型
export function Api_ActModelAdd(params) {
    return request(`${modelBase}/workflow/act-model`, {
        method: "post",
        params
    });
}

// 修改流程模型
export function Api_ActModelUpdate(id, params) {
    return request(`${modelBase}/workflow/act-model/${id}`, {
        method: "put",
        params
    });
}

// 删除流程模型
export function Api_ActModelDelete(id) {
    return request(`${modelBase}/workflow/act-model/${id}`, {
        method: "delete"
    });
}

// 部署流程模型
export function Api_ActModelDeployment(id) {
    return request(`${modelBase}/workflow/act-model/deploy/${id}`, {
        method: "post"
    });
}

// 复制流程模型
export function Api_ActModelClone(id) {
    return request(`${modelBase}/workflow/act-model/copy/${id}`, {
        method: "post"
    });
}

// 获取建模页面
export function Api_ActModelLinkUrlBuild(id) {
    return `${process.env.VUE_APP_BASE_API}${modelBase}/modeler.html?modelId=${id}`;
}

// 获取流程建模信息
export function Api_ActModelGetModel(id, type) {
    return request(`${fs}/fs/texts/${id}`, {
        method: "get",
        params: {
            type
        }
    });
}

// 更新建模
export function Api_ActModelGetModelUpdate(id, type, params) {
    return request(`${fs}/fs/texts/${id}/${type}`, {
        method: "post",
        dataForm: true,
        params
    });
}

// 获取审核人下拉框数据
export function Api_ActModelGetCheckPerson() {
    return request(`${modelBase}/system/users/saas/list`, {
        method: "get"
    });
}



// 部署流程
export function DeploymentProcess(id) {
    return request(`/upms/workflow/act-model/deploy/${id}`, {
        method: "post"
    });
}


//点击添加的时候获取圆跟线

export function getCircleAndLine(params) {
    return request(`/upms/workflow/act-model/line`, {
        method: "get",
        params
    });
}