const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    status: state => state.user.status,
    roles: state => state.user.roles,
    setting: state => state.user.setting,
    menus: state => state.user.menus, // self
    menusStatus: state => state.user.menusStatus, // self
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    errorLogs: state => state.errorLog.logs,
    saasCode: state => state.user.userInfo.saasCode,
    // userInfo: state => {
    //     //  dayu修改  不存在就读缓存中的
    //     if (!state.user.userInfo.id) {
    //         if (localStorage.getItem("userInfo") != null) {
    //             return JSON.parse(localStorage.getItem("userInfo"))
    //         } else {
    //             return state.user.userInfo
    //         }

    //     } else {
    //         return state.user.userInfo
    //     }
    // },
    userInfo: state => state.user.userInfo,
    noticeMessageNums: state => state.global.noticeMessageNums,
    mailMessageNums: state => state.global.mailMessageNums,
    attentionGroup: state => state.global.attentionGroup,
    radioGroup: state => state.onlineTest.radioGroup,
    mulGroup: state => state.onlineTest.mulGroup,
    TFGroup: state => state.onlineTest.TFGroup,
    completionGroup: state => state.onlineTest.completionGroup,
    CompanyId: state=> state.user.CompanyId
};
export default getters