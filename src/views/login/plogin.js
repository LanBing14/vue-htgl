import LoginComponent from './index.vue'
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element, {
    size:'default',
});

LoginComponent.newInstance = options => {
    const _props = options || {}

    const instance = new Vue({
        data: _props,
        render(h) {
            return h(LoginComponent, {
                props: _props
            })
        }
    })

    const component = instance.$mount()
    document.body.appendChild(component.$el)
    const login = instance.$children[0]

    return {
        login() {
            login.dialogVisible = true
            login.loginShowType = 1
        },
        register() {
            login.dialogVisible = true
            login.loginShowType = 3
        },
        close() {
            login.dialogVisible = false
            login.loginShowType = 1
        },
        component: login
    }
}

export default LoginComponent
