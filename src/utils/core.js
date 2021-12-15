import Axios from 'axios';
// import * as lGet from 'lodash.get';

let configData = {};

export function bootstrap() {
    return Axios.request({
        url: './config.json?t=' + Date.now(),
        method: 'get'
    }).then((res) => {
        configData = res.data || {};
        document.getElementById('sys-loading').style.display = 'none';
        return true;
    }).catch((error) => {
        document.getElementById('sys-loading').style.display = 'none';
        console.log(error);
    });
}

// export function getConfig(path) {
//   return lGet(configData, path, null);
// }

const StorageCore = function() {};

StorageCore.prefix = 'PIOT';
StorageCore.separator = '_';
StorageCore.DefaultOption = {
    type: 'local',
    usePrefix: true
};
StorageCore.STORAGE_MAPS = {
    local: localStorage,
    session: sessionStorage
};

StorageCore.prototype.prefixKey = function(key, usePrefix) {
    let name = key || '';
    if (typeof usePrefix === 'boolean' && usePrefix) {
        name = StorageCore.prefix + StorageCore.separator + name;
    }
    return name;
};
StorageCore.prototype.useStorage = function(type) {
    return StorageCore.STORAGE_MAPS[type] || localStorage;
};
StorageCore.prototype.getOption = function(option) {
    return {...StorageCore.DefaultOption, ...option };
};
StorageCore.prototype.parseValue = function(value) {
    if (!value) {
        return value;
    }
    let val = value;
    try {
        val = JSON.parse(value);
    } catch (error) {
        // console.error(error);
    }
    return val;
};
StorageCore.prototype.setItem = function setStorage(key, value, stroageOption) {
    const option = this.getOption(stroageOption);
    let str = '';
    try {
        str = JSON.stringify(value);
    } catch (error) {
        throw Error(error);
    }
    this.useStorage(option.type).setItem(this.prefixKey(key, option.usePrefix), str);
};
StorageCore.prototype.getItem = function(key, stroageOption) {
    const option = this.getOption(stroageOption);
    const storage = this.useStorage(option.type);
    let value = null;
    value = storage.getItem(this.prefixKey(key, option.usePrefix));
    if (value === null && typeof option.defaultValue !== 'undefined') {
        value = option.defaultValue;
        this.setItem(key, option.defaultValue, stroageOption);
    }
    return this.parseValue(value);
};
StorageCore.prototype.removeItem = function(key, stroageOption) {
    const option = this.getOption(stroageOption);
    this.useStorage(option.type).removeItem(this.prefixKey(key, option.usePrefix));
};
StorageCore.prototype.clear = function(stroageOption) {
    const option = this.getOption(stroageOption);
    const storage = this.useStorage(option.type);
    const prefix = this.prefixKey('', option.usePrefix);
    Object.keys(storage).forEach(key => {
        if (key.indexOf(prefix) === 0) {
            storage.removeItem(key);
        }
    });
};
StorageCore.prototype.empty = function(stroageOption) {
    Object.values(StorageCore.STORAGE_MAPS).forEach((storage) => {
        if ('clear' in storage) {
            storage.clear();
        }
    });
};
let CtStorage = window['CtStorage'];
if (!CtStorage) {
    CtStorage = new StorageCore();
}
export { CtStorage };

const TOKEN_KEY = 'token';
const LOGIN_INFO_KEY = 'loginInfo';

export function isAuthenticated() {
    const token = CtStorage.getItem(TOKEN_KEY);
    const loginInfo = CtStorage.getItem(LOGIN_INFO_KEY);
    return token && loginInfo && typeof loginInfo === 'object';
}

export function getToken() {
    return CtStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    return CtStorage.setItem(TOKEN_KEY, token);
}

export function setLoginInfo(loginInfo) {
    return CtStorage.setItem(LOGIN_INFO_KEY, loginInfo);
}

export function exit() {
    CtStorage.removeItem(LOGIN_INFO_KEY);
    CtStorage.removeItem(TOKEN_KEY);
}