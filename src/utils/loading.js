import { Loading } from 'element-ui';

export default () => {
    const options = {
        lock: true,
        text: '加载中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    }
    const loadingInstance = Loading.service(options);
    return loadingInstance;
}