import request from '@/utils/request'
import {upms} from '@/utils/variables'

// 提交用户反馈
export function Api_CommitFeedback(params) {
    return request(`${upms}/system/feedbacks`, {
        method: 'post',
        dataForm: true,
        params: params
    })
}
