<template>
<div class="list-wrap">
    <div class="headTableTips-wrap">
        <table class="headTableTips" cellpadding="0" cellspacing="0">
            <tr>
                <td style="width: 50px;">#</td>
                <td
                    v-for="(el, index) in columns"
                    :key="index"
                    :width="el.width"
                >
                    {{ el.label }}
                </td>
            </tr>
        </table>
    </div>
    <div v-loading="listLoading">
        <div v-for="el in filterData" v-if="el" :key="el.dayInfo">
            <h4 class="mail-tip">{{ el.dayInfo }}</h4>
            <TableWrapper
                :data="el.data"
                :showHeader="false"
                :columns="columns"
                :filterGroup="false"
                :border="false"
                :highlight="false"
                style="padding: 0;"
            ></TableWrapper>
        </div>
        <p v-if="filterData.length===0" style="text-align: center">暂无数据！</p>
    </div>
    <el-pagination
        :page.sync="currentPage"
        :limit.sync="pageSize"
        :pager-count="5"
        :total="total"
        layout="total, sizes, prev, pager, next"
    >
    </el-pagination>
</div>

</template>

<script>

    export default {
        name: 'Email',
        props: {
            // 传过来的数据，如果有则不进行接口调用
            data: {
                type: Array,
                default() {
                    return null
                }
            },
            // 获取数据的接口
            fetchDataFn: {
                type: Function,
                default: null
            },
            // 定义显示列的相关配置
            columns: {
                type: Array,
                default() {
                    return []
                }
            },
            // 接口查询条件
            query: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                currentPage: 1,
                total: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50, 100],
                listLoading: false,
                list: []
                // tableCol: [{
                //     key: 'title',
                //     label: '标题'
                // }, {
                //     key: 'publisTime',
                //     label: '发布时间'
                // }]
            }
        },
        computed: {
            filterData() { // 过滤生成后的数据
                if (!this.list.length) {
                    return [];
                }
                const f = {};
                const a = [];
                const curWeekDay = new Date().getDay();
                const curDate = new Date();
                curDate.setHours(0);
                curDate.setMinutes(0);
                curDate.setSeconds(0);
                const curWeekMin = new Date(curDate - (curWeekDay - 1) * 1000 * 60 * 60 * 24);

                this.list.forEach(item => {
                    const rowDate = new Date(item.publisTime);
                    const rowDay = rowDate.getDate();
                    const curDay = new Date().getDate();
                    const cha = curDay - rowDay;
                    const rowWeekDay = new Date(rowDate).getDay();
                    let weekDay = this.getWeekDay(rowWeekDay);
                    const lastWeekMin = new Date((curWeekMin.getTime() - 7 * 1000 * 60 * 60 * 24));
                    const lastWeekMax = new Date(curWeekMin.getTime() - 1000);

                    if (weekDay && rowDate >= curWeekMin) {
                        weekDay = '星期' + weekDay;
                        if (cha === 0) {
                            this.creatorRow(f, 'today', '今天', item)
                        } else if (Math.abs(cha) === 1) {
                            this.creatorRow(f, 'yesterday', '昨日', item)
                        } else if (Math.abs(cha) === 2) {
                            this.creatorRow(f, 'otherDay2', weekDay, item)
                        } else if (Math.abs(cha) === 3) {
                            this.creatorRow(f, 'otherDay3', weekDay, item)
                        } else if (Math.abs(cha) === 4) {
                            this.creatorRow(f, 'otherDay4', weekDay, item)
                        } else if (Math.abs(cha) === 5) {
                            this.creatorRow(f, 'otherDay5', weekDay, item)
                        } else if (Math.abs(cha) === 6) {
                            this.creatorRow(f, 'otherDay6', weekDay, item)
                        }
                    } else if (rowDate >= lastWeekMin && rowDate < lastWeekMax) {
                        this.creatorRow(f, 'lastWeek', '上周', item)
                    } else {
                        this.creatorRow(f, 'moreLastWeek', '更早', item)
                    }
                });
                a[0] = f.today;
                a[1] = f.yesterday;
                a[2] = f.otherDay2;
                a[3] = f.otherDay3;
                a[4] = f.otherDay4;
                a[5] = f.otherDay5;
                a[6] = f.otherDay6;
                a[7] = f.lastWeek;
                a[8] = f.moreLastWeek;
                return a
            }

        },
        methods: {
            // 创建每一行数据格式
            creatorRow(obj, prop, dayInfo, row) {
                if (!obj[prop]) {
                    obj[prop] = {}
                }
                if (!obj[prop].dayInfo) {
                    obj[prop].dayInfo = dayInfo
                }
                if (!obj[prop].data) {
                    obj[prop].data = []
                }
                obj[prop].data.push(row)
            },
            // 转换周日期
            getWeekDay(day) {
                const strArr = ['一', '二', '三', '四', '五'];
                return strArr[day - 1]
            },
            // 获取数据
            fetchData(pageReset) {
                if (this.fetchDataFn === null || this.data !== null) return;
                if (pageReset === true) {
                    this.currentPage = 1
                }
                this.listLoading = true;
                const query = {
                    ...this.query,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                };
                this.fetchDataFn(query).then(response => {
                    this.list = response.data;
                    console.log(this.list)
                    this.total = response.totalRecordNumber;
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            getTableIndex(index) {
                return (index + 1) + (this.currentPage - 1) * this.pageSize
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../styles/element-variables.scss';

    .mail-tip {
        border-bottom: 2px solid $--color-primary;
        padding: 5px;
        margin-bottom: 0;
        margin-top: 5px;
    }

    .list-wrap {
        .el-pagination {
            margin-top: 15px;
            text-align: right;
        }
    }
    .headTableTips-wrap{
        background-color: #f2f4f6;
    }
    .headTableTips {
        width: 100%;
        border: none;
        td {
            border: none;
            text-align: center;
        }
    }
    /deep/ .highlight-text{
        cursor: pointer;
        color:$--color-primary
    }
</style>
