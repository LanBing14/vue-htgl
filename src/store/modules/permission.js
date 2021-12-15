import { constantRouterMap, menuIdComponents, asyncComponents } from '@/router';
import { isExternal } from '@/utils';
// import settingsIds from "../../router/routerGroup/settingsIds";

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        return true;
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */


function filterAsyncRouter(menus) {
    const routerResult = []
    menus.forEach(menu => {
        let route = menuIdComponents[menu.key];
        if (menu.url && route) {
            route = route();
            route.path = menu.url
            route.meta = {
                title: menu.name,
                icon: menu.icon
            };
            if (menu.children && menu.children.length > 0 ) {
                const childFirstMenu = menu.children[0]
                childFirstMenu && (route.redirect = childFirstMenu.url)
                routerResult.push({
                    ...route,
                    children: filterAsyncRouter(menu.children)
                })
            } else {
                routerResult.push(route)
            }
        }
    });
    return routerResult;
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: [],
        creditManagementRouters: [], // 信用管理菜单路由
        settingsRouters: [] // 设置中心菜单路由
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
        },
        SET_creditManagement_ROUTERS: (state, routers) => {
            state.creditManagementRouters = [].concat(routers);
        },
        SET_settings_ROUTERS: (state, routers) => {
            state.settingsRouters = [].concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, menus) {
            return new Promise(resolve => {
                commit('SET_ROUTERS', []);
                const accessedRouters = [];
                if (menus.length) {
                    const mainMenus = menus[0].children;
                    mainMenus.forEach(i => {
                        if (i.name == '左侧菜单') {

                            const creditManagementMain = menuIdComponents.creditManagement();

                            const creditManagementRouters = filterAsyncRouter(i.children);
                            const arr = [{
                                ...creditManagementMain,
                                children: [
                                    ...creditManagementRouters
                                ]
                            }];
                            commit('SET_creditManagement_ROUTERS', arr);
                            accessedRouters.push(...arr);
                        }
                        if (i.name === '设置中心') {
                            const settingsMain = menuIdComponents.settings();
                            // i.children.forEach(child => {
                            //     child.layout = settingsMain.component;
                            // });
                            const settingsRouters = filterAsyncRouter(i.children);
                            const arr = [{
                                ...settingsMain,
                                children: [
                                    ...settingsRouters
                                ]
                            }];
                            commit('SET_settings_ROUTERS', arr);
                            accessedRouters.push(...arr);
                        }
                    });
                }
                commit('SET_ROUTERS', accessedRouters);
                resolve(accessedRouters);
            });
        },
        setRouters({ commit }) {
            return new Promise(resolve => {
                commit('SET_ROUTERS', asyncComponents);
                resolve();
            });
        }
    }
};

export default permission;
