import request from '@/utils/request'

// 资金用途获和担保方式获取
export function Api_GetPurposeAndGuarantee(query) {
    return request('/user/center/financeApplication/getPurposeAndGuarantee', {
        method: 'get',
        params: query
    })
}

// 保存我要融资第一步和第二部信息
export function Api_SaveTemp(query) {
    return request('/user/center/financeApplication/saveTemp', {
        method: 'post',
        params: query
    })
}

// 提交我要融资
export function Api_save(query) {
    return request('/user/center/financeApplication/save', {
        method: 'get',
        params: query
    })
}
