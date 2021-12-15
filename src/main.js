import "babel-polyfill";
import Vue from "vue";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import Element from "element-ui";
// import CKEditor from '@ckeditor/ckeditor5-vue';
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";
import moment from 'moment'

import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // permission control
import plugins from "./utils/plugins"; // 注册全局插件
import wholeComponents from "./components/index"; // 注册全局组件
import * as filters from "./filters"; // global filters
import Login from "./views/login/index";
import animated from "animate.css";
import VueVideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import {
    message
} from './utils/message';

Vue.use(Login);
Vue.use(plugins);
Vue.use(wholeComponents);
Vue.use(animated);
Vue.use(VueVideoPlayer);
Vue.use(VueAwesomeSwiper);
Vue.use(Element, {
    size: "default" // set element-ui default size
});
// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.prototype.$message = message;
Vue.prototype.$moment = moment;
/**
 * 设置页面的title，可拓展添加meta标签
 * router设置需要定义的title内容
 */
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    } else {
        document.title = "至信云创-企业中心平台";
    }
    next();
});

// Vue.prototype.$video = Video;
Vue.config.productionTip = false;

export default new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});
