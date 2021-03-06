import { param2Obj } from '@/utils'
import {parse} from 'qs'

const userMap = {
    admin: {
        roles: ['admin'],
        access_token: 'admin',
        introduction: '我是超级管理员',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    editor: {
        roles: ['editor'],
        access_token: 'editor',
        introduction: '我是编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

export default {
    loginByUsername: config => {
        // const { username } = JSON.parse(config.body)
        const { username } = parse(config.body)
        return userMap[username]
    },
    getUserInfo: config => {
        const { token } = param2Obj(config.url)
        if (userMap[token]) {
            return userMap[token]
        } else {
            return false
        }
    },
    logout: () => 'success'
}
