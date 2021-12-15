// import {Api_GetAttentionGroup} from "@/api/userCenter/creditManage";
import {Api_GetCustomerGroup} from "@/api/creditManagement/customerProfile/customerManagement";

const global = {
    state: {
        noticeMessageNums: null, // 未读的通知公告数量
        mailMessageNums: null, // 未读的系统消息数量
        attentionGroup: [], // 登录用户的关注分组
        setpData: {},
        isMobile: false
    },
    mutations: {
        SAVE_NOTICE_READNUMS: (state, num) => {
            state.noticeMessageNums = num
        },
        SAVE_MAIL_READNUMS: (state, num) => {
            state.mailMessageNums = num
        },
        SAVE_ATTENTION_GROUP: (state, list) => {
            state.attentionGroup = list;
        },
        SAVE_STEP_DATA: (state, option) => {
            state.setpData = option;
        },
        SAVE_IS_MOBILE: (state, isMobile) => {
            state.isMobile = isMobile
        }
    },
    actions: {
        updateAttentionGroup: ({commit}) => {
            Api_GetCustomerGroup().then(res => {
                if (res) {
                    commit('SAVE_ATTENTION_GROUP', res);
                    // res.data.forEach((item) => { item.checked = false });
                    // context.commit('SAVE_ATTENTION_GROUP', res.data);
                }
            });
        }
    }
};
export default global;
