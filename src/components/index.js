// import imageViewer from 'element-ui/packages/image/src/image-viewer'
import Drawer from './Drawer';
import Pagination from './Pagination';
import TableWrapper from './TableWrapper';
import Dialog from './Dialog';
import ButtonDropdown from './ButtonDropdown';

const components = [
    Drawer,
    Pagination,
    TableWrapper,
    Dialog,
    ButtonDropdown,
    // imageViewer
]
export default {
    install(Vue) {
        components.forEach(component => {
            Vue.component(component.name, component)
        })
    },
    ...components
}
