import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import global from './modules/global'
import getters from './getters'
import contract from './modules/contract'
import onlineTest from './modules/onlineTest'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        errorLog,
        permission,
        tagsView,
        user,
        global,
        onlineTest,
        contract
    },
    getters
});

export default store