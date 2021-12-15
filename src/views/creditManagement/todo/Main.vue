<template>
    <div :class="{noHeader: !header}">
        <el-tabs :value="activeName">
            <el-tab-pane label="待办事项" name="todo">
                
                <TableWrapper
                    ref="table1"
                    :page="currentPages.currentPage1"
                    :fetchDataFn="Api_AgencyMattersTodo"
                    :query="{}"
                    :columns="tableCol1"
                />
            </el-tab-pane>
            <el-tab-pane label="已办事项" name="done">
                <TableWrapper
                    ref="table2"
                    :page="currentPages.currentPage2"
                    :fetchDataFn="Api_AgencyMattersDone"
                    :query="{}"
                    :columns="tableCol2"
                />
            </el-tab-pane>
            <el-tab-pane label="我的申请" name="my">
                <TableWrapper
                    ref="table3"
                    :page="currentPages.currentPage3"
                    :fetchDataFn="Api_AgencyMattersMy"
                    :query="{}"
                    :columns="tableCol3"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script type="text/jsx">
import {
    Api_AgencyMattersTodo,
    Api_AgencyMattersDone,
    Api_AgencyMattersMy
} from "@/api/creditManagement/todo/index";

export default {
    name: "Main",
    props: {
        currentPages: {
            type: Object,
            default: () => ({})
        },
        header: {
            // 是否显示tabs头
            type: Boolean,
            default: true
        },
        activeName: {
            // 控制显示tab
            type: String,
            default: "todo"
        }
    },
    data() {
        return {
            // activeName: "todo",
            tableCol1: [
                // { key: "proc_inst_id", label: "实例编号", width: 160 },
                {
                    key: "task_name",
                    label: "任务名称",
                    props: { showOverflowTooltip: true },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.handleDealWith.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "start_user",
                    label: "发起人",
                    props: { showOverflowTooltip: true },
                    width: 100
                },
                { key: "start_time", label: "发起时间", width: 150 },
                // {key: "category", label: "类别", props: {showOverflowTooltip: true}, width: 120},
                {
                    key: "proc_def_name",
                    label: "流程名称",
                    props: { showOverflowTooltip: true },
                    width: 150
                },
                { key: "task_def_name", label: "节点名称", width: 100 },
                {
                    key: null,
                    label: "操作",
                    width: 80,
                    render: (h, data, row) => {
                        return (
                            <span class="activeBg" style="cursor:pointer" onClick={this.handleDealWith.bind(this, row)}>审批</span>
                            //<button-dropdown
                               // data={[
                                //    {
                                //        text: row.category === "企业认证" ? "详情" : "处理",
                                //        click: this.handleDealWith.bind(this, row)
                               //     }
                               // ]}
                           // />
                        );
                    }
                }
            ],
            tableCol2: [
                // { key: "proc_inst_id", label: "实例编号", width: 160 },
                {
                    key: "task_name",
                    label: "任务名称",
                    props: { showOverflowTooltip: true },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                {
                    key: "start_user",
                    label: "发起人",
                    props: { showOverflowTooltip: true },
                    width: 100
                },
                { key: "create_date", label: "处理时间", width: 150 },
                {
                    key: "proc_def_name",
                    label: "流程名称",
                    props: { showOverflowTooltip: true },
                    width: 150
                },
                // {key: "category", label: "类别", props: {showOverflowTooltip: true}, width: 120},
                { key: "run_status", label: "运行状态", width: 100 },
                {
                    key: null,
                    label: "操作",
                    width: 80,
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.handleDetail.bind(this, row)}>详情</span>
                           // <button-dropdown
                           //    data={[
                            //    {
                                //        text: "详情",
                                //        click: this.handleDetail.bind(this, row)
                                //     }
                                //    ]}
                                //   />
                        );
                    }
                }
            ],
            tableCol3: [
                // { key: "proc_inst_id", label: "实例编号", width: 160 },
                {
                    key: "task_name",
                    label: "任务名称",
                    props: { showOverflowTooltip: true },
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
                                {data}
                            </span>
                        );
                    }
                },
                { key: "create_date", label: "处理时间", width: 150 },
                {
                    key: "proc_def_name",
                    label: "流程名称",
                    props: { showOverflowTooltip: true },
                    width: 150
                },
                {
                    key: "task_def_name",
                    label: "节点名称",
                    props: { showOverflowTooltip: true },
                    width: 100
                },
                // {key: "category", label: "类别", props: {showOverflowTooltip: true}},
                { key: "run_status", label: "运行状态", width: 100 },
                {
                    key: null,
                    label: "操作",
                    width: 80,
                    render: (h, data, row) => {
                        return (
                            <span class="canClick" onClick={this.handleDetail.bind(this, row)}>详情</span>
                            //<button-dropdown
                            // data={[
                                //    {
                                    //        text: "详情",
                                    //       click: this.handleDetail.bind(this, row)
                                    //   }
                                    // ]}
                                    ///>
                        );
                    }
                }
            ]
        };
    },
    mounted() {
        this.getList1();
        this.getList2();
        this.getList3();
    },
    methods: {
        Api_AgencyMattersTodo,
        Api_AgencyMattersDone,
        Api_AgencyMattersMy,
        getList1() {
            this.$refs.table1.fetchData();
        },
        getList2() {
            this.$refs.table2.fetchData();
        },
        getList3() {
            this.$refs.table3.fetchData();
        },
        handleDealWith(row) {
            this.$emit("edit", true, true, row.form_key, row);
        },
        handleDetail(row) {
            this.$emit("edit", true, false, row.form_key, row);
        },
        getCurrentPage() {
            return {
                currentPage1: this.$refs.table1.currentPage,
                currentPage2: this.$refs.table2.currentPage,
                currentPage3: this.$refs.table3.currentPage
            };
        }
    }
};
</script>

<style scoped lang="scss">
/deep/ {
    .el-tabs__item {
        font-size: 18px;
        height: 42px;
        color: #abb7c5;
    }
    .activeBg {
        color:  $--color-primary;
    }
    .el-tabs__active-bar {
        left: 0;
        height: 4px;
    }

    .el-tabs__item.is-active {
        color: rgba(51, 51, 51, 1);
    }

    .el-tabs__nav-wrap::after {
        content: none;
    }
}

/deep/ .el-tabs__active-bar {
    width: 64px !important;
    height: 3px !important;
}

/deep/ .el-tabs__item {
    font-size: 16px !important;
    height: 30px !important;
    line-height: 11px !important;
}

.noHeader /deep/ .el-tabs__header {
    display: none;
}


//  // 滚动条的宽度
//   /deep/ .el-table__body-wrapper::-webkit-scrollbar {
//     width: 6px; // 横向滚动条
//     height: 6px; // 纵向滚动条 必写
//   }
//   // 滚动条的滑块
//   /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
//     background-color: #ddd;
//     border-radius: 3px;
//   }
</style>
