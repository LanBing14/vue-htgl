import axios from "axios";
import {
    Message
} from "element-ui";
import router from "../router";
import store from "@/store";
import {
    getToken
} from "@/utils/auth";
import {
    removeToken
} from "./auth";
import PerLogin from "@/views/login/ploginexp";
import {
    stringify
} from "qs";
import vm from '../main.js'
const errStatusMsg = {
    401: "登录失效或无权限(401)",
    504: "资源请求超时(504)",
    500: "服务器异常(500)",
    502: "服务器异常(502)"
};

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url

    timeout: 1000 * 60 * 3, // request timeout
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache"
    }
});
console.log(service)
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        // if (store.getters.token) {
        //     // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        //     config.headers['X-Token'] = getToken()
        // }
        // config.headers['Authorization'] = getToken()
        return config;
    },
    error => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);
// 接口错误代码
const ErrorArray = [40301, 40101, 40500];
service.interceptors.response.use(
    response => {
        if (response.data.code === 478) {
            Message.error(response.data.msg);
            return Promise.reject(response.data.msg);
        }
        if (response.data.access_token) {
            return response.data;
        }
        if (response.data.error && response.data.error_description) {
            return Promise.reject(response.data.error_description);
        }

        if (response.data.success) {

            return response.data.data;
        }else{
            return Promise.reject(response.data.error || response.data.data);
        }
    },
    error => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        } else {
            const {
                response: {
                    status,
                    data
                }
            } = error;
            let msg = "";
            if (status === 401 || status === 502) {
                store.dispatch("FedLogOut").then(() => {
                    router.push('/login')
                });
            }
            if (errStatusMsg[status]) {
                msg = errStatusMsg[status];
            } else if (data.error && data.error_description) {
                msg = data.error_description;
            } else {
                msg = data;
            }
            return Promise.reject(msg);
        }
    }
);

const request = function(url, option) {
    const newOptions = {
        url,
        ...option
    };

    const method = newOptions.method.toLowerCase();
    newOptions.headers = {
        Authorization: "Bearer " + getToken(),
        "Content-Type": option.dataForm ?
            "application/x-www-form-urlencoded" : "application/json;charset=UTF-8",
        ...newOptions.headers
    };

    if (
        method === "post" ||
        method === "put" ||
        method === "patch" ||
        method === "delete"
    ) {
        newOptions.data = option.dataForm ?
            stringify(newOptions.params, {
                indices: false
            }) :
            newOptions.params;
        newOptions.method = "post";
        newOptions.params = {
            _method: method
        };
    }
    return new Promise((resolve, reject) => {
        return service(newOptions)
            .then(i => {
                resolve(i);
            })
            .catch(e => {
                reject(e);
            });
    });
};

export default request;