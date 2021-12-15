import Cookies from 'js-cookie'
import {Api_UserSelfInfo} from '@/api/login'
import {isNull} from "./commonUtils";
const TokenKey = 'token';
const RefTokenKey = 'refToken';
const UserInfo = '_user';
const JessionID = 'JessionID';
const userStoreKey = 'userStore';

/**
 * 判断用户是否登录。 返回 true 登录 false 未登录
 */
export function isLogin(callback) {
    Api_UserSelfInfo().then(data => {
        if (data.stateCode === '20111' || data.stateCode === '40500') {
            // 已登录
            callback(true);
        } else {
            // 用户 没有登陆 请登录账号
            callback(false);
        }
    });
}

export function setToken(token) {
    // return Cookies.set(TokenKey, token)
    localStorage.setItem(TokenKey, token)
}
export function setRefToken(token) {
    // return Cookies.set(TokenKey, token)
    localStorage.setItem(RefTokenKey, token)
}
export function getToken() {
    return localStorage.getItem(TokenKey) || ''
}
export function getRefToken() {
    return localStorage.getItem(RefTokenKey) || ''
}
export function removeToken() {
    // return Cookies.remove(TokenKey)
    localStorage.removeItem(TokenKey)
}
export function removeRefToken() {
    // return Cookies.remove(TokenKey)
    localStorage.removeItem(RefTokenKey)
}

export function getUserInfo() {
    return JSON.parse(localStorage.getItem(UserInfo)) || '';
}

export function setUserInfo(user) {
    localStorage.setItem(UserInfo, JSON.stringify(user))
}

/**
 * 获取用户角色权限信息
 * @param roleAuthInfo
 * @return object
 * role  用户角色 0:管理员 1:管理人员 2:财务人员 3:销售人员 4:采购人员.
 * viewPermission 查看权限 0:可查看全部 1:可查看本部门 2:仅查看自己.
 * editPermission 编辑权限 0:可编辑 1:仅查看.
 */
export function getRoleAuthInfo() {
    const userInfo = JSON.parse(localStorage.getItem(UserInfo)) || '';
    if (isNull(userInfo)) {
        return '';
    }
    return userInfo.roleAuthInfo;
}

/**
 * 获取是否有 编辑/新增/操作 权限
 * @return {{}|*}
 */
export function getAuthEdit() {
    const userInfo = getRoleAuthInfo()
    if (isNull(userInfo)) {
        return false;
    }
    if (isNull(userInfo.editPermission)) {
        return false;
    }
    return userInfo.editPermission === "0";
}

export function removeUserInfo() {
    localStorage.removeItem(UserInfo)
}

export function getJessionID() {
    // return Cookies.get(TokenKey)
    return Cookies.get(JessionID) || '';
}

export function setJessionID(uuid) {
    // return Cookies.set(TokenKey, token)
    return Cookies.set(JessionID, uuid)
}

export function setUserStore(userStore) {
    return sessionStorage.setItem(userStoreKey, JSON.stringify(userStore))
}

export function getUserStore() {
    return JSON.parse(sessionStorage.getItem(userStoreKey)) || ''
}
