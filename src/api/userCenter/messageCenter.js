import request from '@/utils/request';
import {upms} from '@/utils/variables';

// 获取消息列表
export function Api_FindUserMessage(params) {
    return request(`${upms}/system/mail/inbox/page`, {
        method: 'get',
        params: params
    });
}

// 未读公告数量
export function Api_UserMessageCount() {
    return request(`${upms}/system/mail/inbox/count`, {
        method: 'get'
    });
}

// 获取详细详情
export function Api_GetMesDetailById(id) {
    return request(`${upms}/system/mail/inbox/${id}`, {
        method: 'get'
    });
    // return request('/user/center/myMessage/getMesDetailById', {
    //     method: 'get',
    //     params: params
    // })
}

// 批量标记已读
export function Api_EditPMesReadStatus(ids) {
    return request(`${upms}/system/mail/inbox/mark`, {
        method: 'patch',
        dataForm: true,
        params: {
            ids
        }
    });
}

// 删除消息接口
export function Api_DelPMessage(ids) {
    return request(`${upms}/system/mail/inbox`, {
        method: 'delete',
        dataForm: true,
        params: {
            ids
        }
    });
}

// 获取消息数量
export function Api_FindCCount(params) {
    return request('/user/center/myMessage/findCCount', {
        method: 'get',
        params: params
    });
}
