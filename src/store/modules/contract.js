const contract = {
    state: {
        contractinfo: {}
    },
    mutations: {
        CONTRACT_INFO: (state, info) => {
            state.contractinfo = info;
        }
    },
    actions: {
        AddContractInfo({ commit }, info) {
            commit('CONTRACT_INFO', info)
        }
    }
}

export default contract
