<template>
    <div ref="mountNode" class="g6-container" v-on="$listeners" @mousewheel="mousewheel">
        <div v-if="menu" :style="{left: x + 'px', top: y + 'px'}" class="menu">
            <span v-if="curItemIsNode" @click.copy="copyItem">复制</span>
            <span @click.stop="delItem">删除</span>
        </div>
        <div :class="{show: showPer, hide: hidePer}" class="scale-per">
            {{ $multiply(zoom, 100) }}%
        </div>
    </div>
</template>

<script>
    import G6 from '@antv/g6';
    import behavior from './behavior';
    import flow from './flow';
    import cfg from './cfg';
    import {merge} from 'lodash';

    const {Grid} = G6;

    export default {
        name: 'G6Editor',
        props: {
            data: { // 数据源
                type: Object,
                default: () => ({})
            },
            width: Number,
            height: Number,
            disWidth: { // width要减去的差值
                type: Number,
                default: 0
            },
            disHeight: { // height要减去的差值
                type: Number,
                default: 0
            },
            view: Boolean, // 是否是只读查看，只保留放大、拖动画布功能
            grid: Boolean, // 是否生成网格
            lineType: { // 默认的连线类型
                type: String,
                default: () => 'line'
            }
        },
        data() {
            return {
                graph: null, // G6图形实例
                menu: false, // 是否显示右键菜单
                curItem: null, // 当前项，节点或线
                x: 0,
                y: 0,
                gridIns: null, // G6网络插件的实例
                timer: null, // 延时器
                zoom: 1,
                showPer: false,
                hidePer: false,
                timerShow: null, // 显示百分比延时器
                timerHide: null // 隐藏百分比延时器
            };
        },
        computed: {
            curItemIsNode() {
                if (this.curItem) {
                    return this.curItem.getType() === 'node';
                } else {
                    return false;
                }
            }
        },
        watch: {
            // 监测data数据变化，更新图形数据并渲染
            data(val) {
                this.graph.read(val);
            },
            grid(val) {
                if (val) {
                    this.gridIns = new Grid();
                    this.graph.addPlugin(this.gridIns);
                } else {
                    this.graph.removePlugin(this.gridIns);
                }
            },
            width(value) {
                // this.graph.changeSize(value, this.height);
            },
            height(value) {
                // this.graph.changeSize(this.width, value);
            }
        },
        mounted() {
            this.gridIns = new Grid();
            behavior(); // 注册自定义事件
            flow(); // 注册自定义节点
            this.init();
            window.addEventListener('resize', this.resize, false);
            this.graph.addPlugin(this.gridIns);
        },
        beforeDestroy() {
            clearTimeout(this.timer);
            clearTimeout(this.timerShow);
            clearTimeout(this.timerHide);
            window.removeEventListener('resize', this.resize);
        },
        methods: {
            resize() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    const {width, height} = this.$refs.mountNode.parentNode.getBoundingClientRect();
                    this.$emit('update:width', width - this.disWidth);
                    this.$emit('update:height', height - this.disHeight);
                }, 300);
            },
            // 获取图形中所有节点与线的数据
            getData() {
                const data = {
                    nodes: [],
                    edges: []
                };
                this.graph.getNodes().forEach(item => {
                    data.nodes.push(item.getModel());
                });
                this.graph.getEdges().forEach(item => {
                    const model = item.getModel();
                    delete model.startPoint;
                    delete model.endPoint;
                    delete model.x;
                    delete model.y;
                    delete model.type;
                    data.edges.push(model);
                });
                return merge({}, data);
            },
            // 初始实例化图形
            init() {
                const modes = {
                    default: ['drag-canvas', 'drag-node', 'click-select', 'zoom-canvas', 'lineNodeMove', 'hoverNode'],
                    addEdge: ['addEdge']
                };
                const graph = this.graph = new G6.Graph({
                    container: this.$refs.mountNode, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
                    width: this.width, // Number，必须，图的宽度
                    height: this.height, // Number，必须，图的高度
                    // plugins: [minimap, grid],
                    // linkCenter: true,
                    modes: this.view ? {
                        default: ['drag-canvas', 'zoom-canvas']
                    } : modes,
                    defaultNode: {
                        shape: 'rect'
                    },
                    defaultEdge: {
                        shape: this.lineType,
                        style: {
                            stroke: '#616161',
                            lineAppendWidth: 6,
                            lineWidth: 1,
                            endArrow: true
                        }
                    },
                    edgeStateStyles: {
                        selected: {
                            // selected 状态为 true 时的样式
                            stroke: cfg.edgeStateStyle.selected.stroke
                        }
                    }
                });
                graph.data(this.data); // 读取 Step 2 中的数据源到图上
                graph.render(); // 渲染图

                if (this.view) {
                    return;
                }
                this.bindEvents();
            },
            clear() {
                this.graph.clear();
            },
            // 显示右击菜单
            showMenu(ev) {
                ev.preventDefault();
                const {canvasX: x, canvasY: y, item} = ev;
                this.x = x;
                this.y = y;
                this.menu = true;
                this.curItem = item;
            },
            // 复制节点
            copyItem() {
                const model = this.curItem.getModel();
                delete model.id;
                model.x += 20;
                model.y += 20;
                this.addItem('node', model);
                this.menu = false;
            },
            // 删除节点或线
            delItem() {
                this.menu = false;
                const nodeType = this.curItem.getType();
                if (nodeType === 'node') {
                    const edges = this.curItem.getEdges();
                    edges.forEach(item => {
                        this.remove(item);
                    });
                }
                this.remove(this.curItem);
            },
            // 添加节点，type：节点类型(node或edge)，model:数据源
            addItem(type, model) {
                this.graph.addItem(type, model);
            },
            // 更新节点
            updateItem(itemId, model) {
                const item = this.graph.findById(itemId);
                const {centerX: x, centerY: y} = item.getBBox();
                this.graph.updateItem(item, {...model, x, y});
            },
            // 删除节点
            remove(item) {
                this.graph.remove(item);
            },
            // 绑定事件
            bindEvents() {
                const graph = this.graph;
                // 节点按下
                // graph.on('node:mousedown', ev => {
                //     const node = ev.item
                //     if (node.hasState('selected')) {
                //         this.graph.setMode('addEdge')
                //     } else {
                //         this.graph.setMode('default')
                //     }
                // })
                // 点击节点
                graph.on('node:click', ev => {
                    const node = ev.item;
                    const edges = graph.getEdges();
                    edges.forEach(e => {
                        e.setState('selected', false);
                    });
                    if (node.hasState('selected')) {
                        this.$emit('nodeSelect', null, '', false);
                    } else {
                        const {model} = node._cfg;
                        this.$emit('nodeSelect', model, model.shape, true);
                    }
                });
                // 点击连线
                graph.on('edge:click', ev => {
                    const edge = ev.item;
                    const flag = edge.hasState('selected');
                    const nodes = graph.getNodes();
                    nodes.forEach(n => {
                        n.setState('selected', false);
                    });
                    if (flag) {
                        this.$emit('nodeSelect', null, '', false);
                    } else {
                        const {model} = edge._cfg;
                        this.$emit('nodeSelect', model, 'line', true);
                    }
                    graph.setItemState(edge, 'selected', !flag);
                });
                // 节点右击
                graph.on('node:contextmenu', ev => {
                    this.showMenu(ev);
                });
                // 线右击
                graph.on('edge:contextmenu', ev => {
                    this.showMenu(ev);
                });
                // canvas点击
                graph.on('canvas:click', ev => {
                    const edges = graph.getEdges();
                    edges.forEach(e => {
                        e.setState('selected', false);
                    });
                    this.$emit('nodeSelect', null, '', false);
                });
            },
            mousewheel() {
                const zoom = this.graph.getZoom().toFixed(1);
                this.$emit('zoom', zoom);
                this.zoom = zoom;
                this.showPer = false;
                this.showPer = true;
                this.hidePer = false;
                clearTimeout(this.timerShow);
                clearTimeout(this.timerHide);
                this.timerShow = setTimeout(() => {
                    this.hidePer = true;
                    this.timerHide = setTimeout(() => {
                        this.showPer = false;
                        this.hidePer = false;
                    }, 1000);
                }, 1000);
            }
        }
    };
</script>

<style scoped lang="scss">
    .g6-container {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;

        /deep/ canvas {
            display: block;
        }

        .menu {
            position: absolute;
            left: 0;
            top: 0;
            width: 150px;
            box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4);
            background-color: #fff;

            span {
                display: block;
                padding: 6px 22px;
                cursor: pointer;
                transition: all 0.2s;

                &:hover {
                    background-color: #6ab7ff;
                    color: #fff;
                }

                & + span {
                    border-top: 1px solid #ddd;
                }
            }
        }
    }

    .scale-per {
        position: absolute;
        top: 15px;
        right: 15px;
        color: #fff;
        padding: 8px 18px;
        background-color: rgba(0, 0, 0, 0.65);
        display: none;

        &.show {
            display: block;
            opacity: 1;
        }

        &.hide {
            transition: opacity 1s;
            opacity: 0;
        }
    }
</style>
