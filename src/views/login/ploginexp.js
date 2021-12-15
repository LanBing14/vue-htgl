import LoginCom from './plogin.js'

let loginInstance
const defaultOption = {}

function _getloginInstance() {
    loginInstance = loginInstance || LoginCom.newInstance(defaultOption)
    return loginInstance
}

const instance = _getloginInstance()

export default {
    login() {
        instance.login()
    },
    register() {
        instance.register()
    },
    close() {
        instance.close()
    }
}
