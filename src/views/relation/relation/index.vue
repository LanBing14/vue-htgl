<template>
    <div>
        <div class="page-header">
            <h1 class="page-name">
                <span>关系探寻</span>
            </h1>
        </div>
        <div class="page-content">
            <div class="left">
                <el-card shadow="never" class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="flex">
                            <span class="flex-primary">关联主体列表</span>
                            <div class="action">
                                <el-button type="text" class="tree-btn-font" @click="addDept">添加主体
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div v-loading="listLoading" class="choose-list">
                        <el-scrollbar class="scrollbar-wrap scrollbar-x-hidden">
                            <div
                                v-for="(el, index) in list"
                                :key="index"
                                :class="{selected: selectedIds.indexOf(el.id)!==-1}"
                                class="item flex"
                                @click.prevent="toggleSelect(el)">
                                <div class="flex-primary" v-html="el.name">
                                    <!--                                <div v-if="el.queryType==='1'" v-html="el.name"></div>-->
                                    <!--                                <div v-else v-html="el.emname"></div>-->
                                    <!--                                <div class="info">-->
                                    <!--                                    <template v-if="el.queryType !== '1'">-->
                                    <!--                                        <div>{{ el.name }}</div>-->
                                    <!--                                    </template>-->
                                    <!--                                </div>-->
                                </div>
                                <div class="remove" @click.stop="removeBody(index, el)"><i class="el-icon-close"></i>
                                </div>
                            </div>
                            <el-alert
                                v-if="!list.length"
                                :closable="false"
                                title="请添加主体"
                                type="info"
                                show-icon>
                            </el-alert>
                        </el-scrollbar>
                    </div>
                    <el-button
                        v-loading="loading"
                        :disabled="!list.length"
                        type="primary"
                        style="display: block;width: 100%;margin-top: 20px;"
                        class="btn-started"
                        @click="start"
                    >
                        开始探寻 >>
                    </el-button>
                </el-card>
            </div>
            <div id="chart" ref="chart" v-loading="loading" class="chart-content">

            </div>
            <div v-loading="nodeLoading" v-drag v-show="selectedNode" class="info-wrap">
                <div class="flex close-area">
                    <span class="flex-primary"></span>
                    <i class="iconfont icon-close" style="font-size: 16px;cursor:pointer;"
                       @click="selectedNode=false"></i>
                </div>
                <h3 class="title flex">
                    <span class="flex-primary" @click="toDetail">{{ companyInfo.companyName }}</span>
                </h3>
                <div class="info-content flex">
                    <div class="num-wrap">
                        <span class="num font24">{{ companyInfo.ownRiskCount }}</span>
                        <p>自身风险</p>
                    </div>
                    <div class="num-wrap">
                        <span class="num font24">{{ companyInfo.relationRiskCount }}</span>
                        <p>关联风险</p>
                    </div>
                    <div class="info">
                        <p class="tip-last">最近动态：</p>
                        <template v-if="companyInfo.dtName">
                            <el-tooltip :content="companyInfo.dtName" placement="top">
                                <h5 class="dt-c">{{ companyInfo.dtName }}</h5>
                            </el-tooltip>
                            <p class="dt-d">{{ companyInfo.dtDate }}</p>
                        </template>
                        <div v-else class="no-dt">
                            暂无动态
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <Body ref="body" :data="list" @ok="onBodyOk"></Body>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import Body from './Body';
    import echartsResize from '@/mixins/echartsResize';
    import {Api_RelationPath, Api_SubjectGetList, Api_SubjectDelete} from '@/api/relation';
    import {
        Api_GetCompanyRiskCount,
        Api_GetComPageMonitor
    } from "@/api/creditMonitor";
    import {Api_newGetComPageMonitor} from "@/api/creditMonitor";

    export default {
        name: "RelationMain",
        components: {
            Body
        },
        mixins: [echartsResize],
        data() {
            return {
                chart: null, // 图表实例
                loading: false, // 图表loading
                list: [], // 主体列表
                selectedIds: [], // 已选中的数据
                nodes: [], // 所有节点数据
                companyInfo: { // 企业详情数据
                    companyName: '', // 企业名称
                    ownRiskCount: 0, // 自身风险个数
                    relationRiskCount: 0, // 关联风险个数
                    dtName: '', // 最新动态--名称
                    dtDate: '' // 最新动态--日期
                },
                selectedNode: null, // 选中的节点源数据
                nodeLoading: false, // 节点loading
                listLoading: false
            };
        },
        mounted() {
            const { left, top } = this.$getOffset(this.$refs.chart);
            const { width, height } = this.$refs.chart.getBoundingClientRect();
            const chart = this.chart = echarts.init(this.$refs.chart);
            chart.on('mouseup', (params) => {
                const option = chart.getOption();
                option.series[0].data[params.dataIndex].x = params.event.offsetX;
                option.series[0].data[params.dataIndex].y = params.event.offsetY;
                option.series[0].data[params.dataIndex].fixed = true;
                chart.setOption(option);
            });
            chart.on("click", (param) => {
                const {data} = param;
                const findRes = this.nodes.find(i => i.id === Number(data.id));
                if (findRes) {
                    this.selectedNode = findRes;
                    this.nodeLoading = true;
                    this.companyInfo.companyName = findRes.company_name;
                    // 获取企业的风险个数
                    Api_GetCompanyRiskCount(findRes.company_id).then(res => {
                        this.companyInfo.ownRiskCount = res.ownRiskCount;
                        this.companyInfo.relationRiskCount = res.relationRiskCount;
                        this.nodeLoading = false;
                    }).catch(() => {
                        this.nodeLoading = false;
                    });
                    Api_newGetComPageMonitor({
                        pageNo: 1,
                        pageSize: 10,
                        companyId: findRes.company_id
                    }).then(({result: data}) => {
                        if (data && data.length) {
                            this.companyInfo.dtName = data[0].content;
                            this.companyInfo.dtDate = this.$dateFormat(data[0].change_time);
                        } else {
                            this.companyInfo.dtName = '';
                            this.companyInfo.dtDate = '';
                        }
                        this.nodeLoading = false;
                    }).catch(() => {
                        this.nodeLoading = false;
                    });
                }
            });
            this.getLeftList()
        },
        methods: {
            getLeftList() {
                this.listLoading = true
                Api_SubjectGetList().then(res => {
                    this.list = res.map(item => ({
                        id: item.companyId,
                        name: item.companyName,
                        rowId: item.id
                    }))
                    this.listLoading = false
                }).catch(e => {
                    this.listLoading = false
                    this.$message.error(e)
                })
            },
            // 获取数据
            getData(searchKey, searchKeyTwo) {
                this.chart.clear()
                this.loading = true;
                Api_RelationPath({
                    searchKey,
                    searchKeyTwo
                }).then(res => {
                    if (!res.nodes.length) {
                        this.$message.warning('查找不到当前选择的企业间的关系！')
                    }
                    this.initCharts(res.nodes, res.links);
                    this.loading = false;
                }).catch(e => {
                    this.$message.error(e)
                    this.loading = false;
                });
            },
            initCharts(nodes, links) {
                const chart = this.chart;
                const area = {
                    width: chart.getWidth(),
                    height: chart.getHeight()
                };
                const spanX = area.width / nodes.length;
                const spanY = area.height / 2;

                this.nodes = nodes;

                const data = nodes.map((item, index) => {
                    const {id, type} = item;
                    let name = '';
                    switch (type) {
                        case "companyInfo":
                            name = item.company_name;
                            break;
                        case "employee":
                            name = item.name;
                            break;
                        case "partner":
                            name = item.stock_name;
                            break;
                        case "case":
                            name = item.casename;
                            break;
                        case "branch":
                            name = item.name;
                            break;
                        case "invest":
                            name = item.name;
                            break;
                    }
                    const style = {};
                    if (index === 0 || index === nodes.length - 1) {
                        style.itemStyle = {
                            normal: {
                                color: "#f35151"
                            }
                        };
                    }
                    return {
                        id: String(id),
                        name: name.replace(/(.{5})(?=.)/g, '$1\n'),
                        category: type,
                        symbolSize: 80,
                        draggable: true,
                        fixed: true,
                        x: spanX * index + spanX / 2,
                        y: index % 2 ? spanY - 100 : spanY + 100,
                        ...style
                    };
                });
                const edges = links.map(({source, target, type}) => {
                    return {
                        source: String(source),
                        target: String(target),
                        value: type
                    };
                });
                const option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        show: false
                    },
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12
                            }
                        }
                    },
                    legend: {
                        x: "center",
                        show: false,
                        data: ["夫妻", "战友", '亲戚']
                    },
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            symbolSize: 45,
                            // focusNodeAdjacency: true,
                            roam: true,
                            categories: [{
                                name: 'companyInfo',
                                itemStyle: {
                                    normal: {
                                        color: "#52A3EE"
                                    }
                                }
                            }, {
                                name: 'employee',
                                itemStyle: {
                                    normal: {
                                        color: "#728dc9"
                                    }
                                }
                            }, {
                                name: 'partner',
                                itemStyle: {
                                    normal: {
                                        color: "#65d289"
                                    }
                                }
                            }, {
                                name: 'case',
                                itemStyle: {
                                    normal: {
                                        color: "#a496c7"
                                    }
                                }
                            }, {
                                name: 'branch',
                                itemStyle: {
                                    normal: {
                                        color: "#ee7698"
                                    }
                                }
                            }, {
                                name: 'invest',
                                itemStyle: {
                                    normal: {
                                        color: "#f35151"
                                    }
                                }
                            }],
                            label: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 12
                                    }
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    brushType: 'both',
                                    borderColor: '#dfdfdf',
                                    borderWidth: 4
                                }
                            },
                            force: {
                                repulsion: 0,
                                edgeLength: 150
                            },
                            edgeSymbol: ['none', 'arrow'],
                            edgeSymbolSize: [6, 6],
                            edgeLabel: {
                                normal: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 10
                                    },
                                    formatter: "{c}"
                                }
                            },
                            data: data,
                            edges: edges,
                            lineStyle: {
                                normal: {
                                    opacity: 0.9,
                                    width: 1,
                                    curveness: 0
                                }
                            }
                        }
                    ]
                };
                chart.setOption(option);
            },
            // 添加主体
            addDept() {
                this.$refs.body.openModel();
            },
            // 移除主体
            removeBody(index, el) {
                const loading = this.$openLoading()
                Api_SubjectDelete(el.rowId).then(res => {
                    loading.close()
                    this.getLeftList()
                    this.$message.success(res)
                }).catch(e => {
                    loading.close()
                    this.$message.error(e)
                })
                // const delIndex = this.selectedIds.indexOf(el.id);
                // if (index !== -1) {
                //     this.selectedIds.splice(delIndex, 1);
                // }
                // this.list.splice(index, 1);
            },
            // 主体保存事件
            onBodyOk(arr) {
                // this.list = arr;
                this.getLeftList()
            },
            // 主体列表中的选择事件
            toggleSelect(el) {
                const index = this.selectedIds.indexOf(el.id);
                if (index === -1) {
                    this.selectedIds.push(el.id);
                } else {
                    this.selectedIds.splice(index, 1);
                }
            },
            // 开始探寻
            start() {
                if (!this.selectedIds.length || this.selectedIds.length === 1) {
                    this.$message.warning('至少选择两家企业再查询！');
                    return;
                }
                if (this.selectedIds.length > 2) {
                    this.$message.warning('暂时仅支持两家企业间关系查询！');
                    return;
                }
                const [searchKey, searchKeyTwo] = this.selectedIds;
                this.getData(searchKey, searchKeyTwo);
            },
            toDetail() {
                const id = this.selectedNode.company_id;
                window.open('/creditFile/dynamicMon?id=' + id);
            }
        },
        directives: {
            drag: {
                // 指令的定义
                bind: function (el) {
                    let odiv = el;   //获取当前元素
                    const pleft = document.getElementById('chart').offsetLeft;
                    const ptop = document.getElementById('chart').offsetTop;
                    const pwidth = document.getElementById('chart').offsetWidth;
                    const pheight = document.getElementById('chart').offsetHeight;
                    el.onmousedown = (e) => {
                        //算出鼠标相对元素的位置
                        let disX = e.clientX - odiv.offsetLeft;
                        let disY = e.clientY - odiv.offsetTop;
                        let left = '';
                        let top = '';
                        document.onmousemove = (e)=>{
                            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                            left = e.clientX - disX;
                            top = e.clientY - disY;
                            //绑定元素位置到positionX和positionY上面
                            //移动当前元素
                            if( (left > pleft) && ( left < (pwidth+pleft-odiv.offsetWidth) )){
                                odiv.style.left = left + 'px';
                            }
                            if( (top >= ptop) && ( top < pheight-odiv.offsetHeight )){
                                odiv.style.top = top + 'px';
                            }
                        };
                        document.onmouseup = (e) => {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    };
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    @import '~@/styles/element-variables.scss';

    .page-header {
        margin-bottom: 0;

    .page-name {
        margin-bottom: 0;
    }
    }

    .close-area {
        height: 40px;
        align-items: center;

    .icon-close {
        padding: 0 20px;
        color: #8f9da3;
    }
    }

    .scrollbar-wrap {
        height: 100%;

    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    }

    .page-header {
        margin-bottom: 20px;
    }

    .left {
        width: 300px;
        height: 100%;
        vertical-align: top;
        display: inline-block;

    .remove {
        padding: 0 4px;
        cursor: pointer;

    &:hover {
    i {
        color: red;
        font-weight: bold;
    }
    }
    }

    .item {
        padding: 10px;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 10px;

    /deep/ span {
        color: inherit !important;
    }

    &.selected {
         background-color: #4a9df2;
         color: #fff;
     }
    }
    }

    .chart-content {
        display: inline-block;
        width: calc(100% - 320px);
        border: 1px solid #ebeef5;
        float: right;
        height: 100%;
    }

    .page-content {
        height: calc(100% - 50px);
        position: relative;
    }

    /deep/ {
    .el-card__body {
        display: flex;
        flex-direction: column;

    .choose-list {
        flex: 1;
        overflow: auto;
    }
    }
    }

    .info-wrap {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 368px;
        height: 200px;
        background-color: #fff;
        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);

    .title {
        padding: 0 15px 15px 15px;
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 24px;

    span {
        cursor: pointer;

    &:hover {
         color: $--color-primary;
     }
    }
    }

    .num-wrap {
        width: 72px;
        text-align: center;
        background-color: #eaedf4;
        padding: 14px 0;
        margin-right: 15px;

    span {
        margin-bottom: 10px;
        display: inline-block;
        line-height: 20px;
        font-size: 24px;
        color: #3399e6;
    }

    p {
        font-size: 13px;
        color: #666;
    }
    }

    .info {
        width: calc(100% - 174px);

    .tip-last {
        font-size: 13px;
        color: #666;
    }
    }

    .dt-c {
        font-size: 14px;
        margin: 10px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .dt-d {
        font-size: 13px;
        color: #c0c4cc;
    }

    .no-dt {
        text-align: center;
        padding: 15px 0;
        color: #999;
    }
    }

    .info-content {
        padding: 0 20px;
    }

    /deep/ .el-input__icon {
        line-height: normal;
    }
</style>
