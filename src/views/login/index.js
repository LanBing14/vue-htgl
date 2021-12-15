import Vue from 'vue'
import Element from 'element-ui'
import LoginComponent from './ploginexp'

Vue.use(Element, {
    size: 'default',
});

const Login = {};

Login.install = function(Vue) {
    // const LoginConstructor = Vue.extend(LoginComponent)
    // const instance = new LoginConstructor();
    // instance.$mount(document.createElement('div'))
    // document.body.appendChild(instance.$el)

    Vue.prototype.$login = {
        close() {
            LoginComponent.close()
        },
        login() {
            LoginComponent.login()
        },
        register() {
            LoginComponent.register()
        }
    }

    Vue.nextTick(() => {

    })
}

export default Login