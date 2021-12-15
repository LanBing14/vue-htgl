import { Api_GetMenus, Api_LoginByUsername, Api_Logout, Api_UserSelfInfo } from '@/api/login';
import {
    getJessionID,
    getToken,
    getUserInfo,
    removeToken,
    removeRefToken,
    removeUserInfo,
    setJessionID,
    setToken,
    setUserInfo,
    setUserStore
} from '../../utils/auth';
import { uuid } from '@/utils/index';
import CryptoJS from 'crypto-js';
import store from "../index";

// 获取randomStr
const randomStr = uuid();

const user = {
    state: {
        HeadImage: '',
        companyId: '',
        IsShowF: false,
        user: '',
        userType: '',
        status: getToken(),
        code: '',
        token: '',
        refresh_token: '',
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        },
        loginInfo: {
            jessionID: getJessionID(),
            userName: '',
            password: CryptoJS.MD5('').toString(),
            captcha: '',
            code: ''
        },
        codeUrl: process.env.VUE_APP_BASE_API + '/auth/captcha.jpg?JessionID=',
        menus: [],
        userInfo: {
            guided: true
        }, // 用户信息

        menusStatus: false, // 是否已经获取完菜单
        menusLoading: false, // 获取菜单loading
        CompanyId:null,// 企业id
    },

    mutations: {
        SET_HeadImage(state, HeadImage) {
            state.HeadImage = HeadImage;
        },
        SET_IsShowF(state, IsShowF) {
            state.IsShowF = IsShowF;
        },
        SET_CompanyId(state, companyId) {
            state.companyId = companyId;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_MD5: (state, code) => {
            state.loginInfo.password = CryptoJS.MD5(code).toString();
        },
        SET_USERTYPE: (state, type) => {
            state.userType = type;
        },
        SET_USERID: (state, type) => {
            state.userId = type;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_USERNAME: (state, userName) => {
            state.userName = userName;
        },
        SET_COMPANYNAME: (state, companyName) => {
            state.companyName = companyName;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus;
        },
        SET_RANDOMSTR: (state) => {
            // state.loginInfo.randomStr = getRandomStr();
            state.loginInfo.randomStr = uuid();
        },
        SET_JESSIONID: (state) => {
            state.loginInfo.jessionID = getJessionID() ? getJessionID() : setJessionID(randomStr);
        },
        // 保存用户信息
        SET_USERINFO: (state, data) => {
            state.userInfo = data;

            // dayu添加 保存到localStorage中
            // localStorage.setItem('userInfo', JSON.stringify(data))
        },
        // 更改菜单的获取状态
        SET_MENUSSTATUS: (state, status) => {
            state.menusStatus = status;
        },
        // 更改菜单的loading
        SET_MENUSLOADING: (state, status) => {
            state.menusLoading = status;
        },
        SET_COMPANYID:(state,companyId) => {
            state.CompanyId = companyId
        },
        // 保存登录返回的refresh_token
        SAVE_refresh_token: (state, data) => {
            state.refresh_token = data;
        },
        // 更新引导页状态
        UPDATE_GUIDE: (state, status) => {
            state.userInfo.guided = status
        }
    
    },

    actions: {
        // 用户名登录
        LoginByUsername({ commit, state }, userInfo) {
            const { loginInfo } = state;
            userInfo.password = CryptoJS.MD5(userInfo.password).toString();
            return new Promise((resolve, reject) => {
                Api_LoginByUsername({...loginInfo, ...userInfo }).then(response => {
                    resolve(response);
                }).catch(error => {
                    commit('SET_RANDOMSTR');
                    reject(error);
                });
            });
        },

        // 获取菜单
        GetSysMenus({ commit }, saasCode) {
            return new Promise((resolve, reject) => {
                commit('SET_MENUSLOADING', true)
                Api_GetMenus(saasCode).then(response => {
                    commit('SET_MENUS', response);
                    commit('SET_MENUSLOADING', false)
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                Api_UserSelfInfo().then(res => {
                    commit('SET_COMPANYID',res.companyId)
                    commit('SET_USERINFO', res);
                    commit('SET_HeadImage', res.headPortrait ? res.headPortrait.url : '')
                    resolve(res);
                }).catch(e => {
                    reject(e);
                });
                
            });
        },

        // 登出
        LogOut({ commit, dispatch }) {
            return new Promise((resolve, reject) => {
                Api_Logout(getToken()).then(() => {
                    dispatch('FedLogOut')
                    removeUserInfo();
                    sessionStorage.removeItem("userStore");
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({ commit, dispatch }) {
            return new Promise(resolve => {
                commit('SET_ROLES', []);
                commit('SET_USERINFO', {});
                commit('SET_creditManagement_ROUTERS', []);
                commit('SET_settings_ROUTERS', []);
                commit('SET_MENUSSTATUS', false);
                sessionStorage.removeItem('menus')
                removeToken();
                removeRefToken;
                resolve()
            })
        }
    }
};

export default user;