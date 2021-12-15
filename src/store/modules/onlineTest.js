const onlineTest = {
    state: {
        radioGroup: {
            radioQuestionList: [],
            radioAnswerList: []
        },
        mulGroup: {
            mulQuestionList: [],
            mulAnswerList: []
        },
        TFGroup: {
            TFQuestionList: [],
            TFAnswerList: []
        },
        completionGroup: {
            completionQuestionList: [],
            completionAnswerList: []
        }
    },
    mutations: {
        RESET_ALL_ARR: state => {
            state.radioGroup.radioQuestionList = [];
            state.radioGroup.radioAnswerList = [];

            state.mulGroup.mulQuestionList = [];
            state.mulGroup.mulAnswerList = [];

            state.TFGroup.TFQuestionList = [];
            state.TFGroup.TFAnswerList = [];

            state.completionGroup.completionQuestionList = [];
            state.completionGroup.completionAnswerList = [];
        },
        /**
         *  *  * 命名规则 * * *
         * SAVE_自定义_QUESTIONS：记录未做题目，标记已做题目
         * EDIT_自定义_QUESTIONS：已做题目的修改答案
         * SAVE_自定义_ANS：根据index保存用户选择的答案
         */

        /**
         * 单选
         */
        SAVE_RADIO_QUESTIONS: (state, arr) => {
            state.radioGroup.radioQuestionList = arr;
        },
        EDIT_RADIO_QUESTIONS: (state, ans) => {
            state.radioGroup.radioQuestionList.splice(ans, 1, "true");
        },
        SAVE_RADIO_ANS: (state, ans) => {
            if (state.radioGroup.radioAnswerList.length > 0) {
                state.radioGroup.radioAnswerList.splice(
                    ans["index"],
                    1,
                    ans["val"]
                );
            } else {
                state.radioGroup.radioAnswerList.push(ans["val"]);
            }
        },
        /**
         * 判断
         */
        SAVE_TF_QUESTIONS: (state, arr) => {
            state.TFGroup.TFQuestionList = arr;
        },
        EDIT_TF_QUESTIONS: (state, ans) => {
            state.TFGroup.TFQuestionList.splice(ans, 1, "true");
        },
        SAVE_TF_ANS: (state, ans) => {
            if (state.TFGroup.TFAnswerList.length > 0) {
                state.TFGroup.TFAnswerList.splice(ans["index"], 1, ans["val"]);
            } else {
                state.TFGroup.TFAnswerList.push(ans["val"]);
            }
        },
        /**
         * 多选
         */
        SAVE_MUL_QUESTIONS: (state, arr) => {
            state.mulGroup.mulQuestionList = arr;
        },
        EDIT_MUL_QUESTIONS: (state, ans) => {
            if (ans["val"].length !== 0) {
                state.mulGroup.mulQuestionList.splice(ans["index"], 1, "true");
            } else {
                state.mulGroup.mulQuestionList.splice(ans["index"], 1, "false");
            }
        },
        SAVE_MUL_ANS: (state, ans) => {
            if (state.mulGroup.mulAnswerList.length > 0) {
                if (ans["val"].length !== 0) {
                    state.mulGroup.mulAnswerList.splice(
                        ans["index"],
                        1,
                        ans["val"]
                    );
                } else {
                    state.mulGroup.mulAnswerList.splice(ans["index"], 1);
                }
            } else {
                state.mulGroup.mulAnswerList.push(ans["val"]);
            }
        },
        /**
         * 问答
         */
        SAVE_COMPLETION_QUESTIONS: (state, arr) => {
            state.completionGroup.completionQuestionList = arr;
        },
        // EDIT_COMPLETION_QUESTIONS: (state, ans) => {
        //     if (ans["val"] !== "") {
        //         state.completionGroup.completionQuestionList.splice(
        //             ans["index"],
        //             1,
        //             "true"
        //         );
        //     } else {
        //         state.completionGroup.completionQuestionList.splice(
        //             ans["index"],
        //             1,
        //             "false"
        //         );
        //     }
        // },
        SAVE_COMPLETION_ANS: (state, ans) => {
            // 已有答案选项的时候
            if (state.completionGroup.completionAnswerList.length > 0) {
                if (ans["val"] !== "") {
                    state.completionGroup.completionAnswerList.splice(
                        ans["index"],
                        1,
                        [ans["val"], ans["id"]]
                    );
                    state.completionGroup.completionQuestionList.splice(
                        ans["index"],
                        1,
                        "true"
                    );
                } else {
                    state.completionGroup.completionAnswerList.splice(
                        ans["index"],
                        1
                    );
                    state.completionGroup.completionQuestionList.splice(
                        ans["index"],
                        1,
                        "false"
                    );
                }
                console.log(state.completionGroup.completionQuestionList);
            } else {
                state.completionGroup.completionAnswerList.push([
                    ans["val"],
                    ans["id"]
                ]);
                state.completionGroup.completionQuestionList.splice(
                    ans["index"],
                    1,
                    "true"
                );
            }
        }
    },
    actions: {
        SaveRadioQuestions({ commit }, arr) {
            commit("SAVE_RADIO_QUESTIONS", arr);
        },
        EditRadioQuestions({ commit }, ans) {
            commit("EDIT_RADIO_QUESTIONS", ans);
        },
        AddRadioAns({ commit }, ans) {
            commit("SAVE_RADIO_ANS", ans);
        },
        SaveTFQuestions({ commit }, arr) {
            commit("SAVE_TF_QUESTIONS", arr);
        },
        EditTFQuestions({ commit }, ans) {
            commit("EDIT_TF_QUESTIONS", ans);
        },
        AddTFAns({ commit }, ans) {
            commit("SAVE_TF_ANS", ans);
        },
        SaveMulQuestions({ commit }, arr) {
            commit("SAVE_MUL_QUESTIONS", arr);
        },
        EditMulQuestions({ commit }, ans) {
            commit("EDIT_MUL_QUESTIONS", ans);
        },
        AddMulAns({ commit }, ans) {
            commit("SAVE_MUL_ANS", ans);
        },
        SaveCompletionQuestions({ commit }, arr) {
            commit("SAVE_COMPLETION_QUESTIONS", arr);
        },
        EditCompletionQuestions({ commit }, ans) {
            commit("EDIT_COMPLETION_QUESTIONS", ans);
        },
        AddCompletionAns({ commit }, ans) {
            commit("SAVE_COMPLETION_ANS", ans);
        },
        ResetAllArr({ commit }) {
            commit("RESET_ALL_ARR");
        }
    }
};

export default onlineTest;
