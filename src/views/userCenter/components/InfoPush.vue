<template>
    <div class="usercenter-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="展示信息报送记录" name="needs">
                <el-row>
                    <el-col :span="2" style="line-height: 30px;">报送内容：</el-col>
                    <el-col :span="10">
                        <div id="progressStateBox">
                            <el-radio-group v-model="progressState" size="small">
                                <el-radio-button label="全部"></el-radio-button>
                                <el-radio-button label="企业征信报告"></el-radio-button>
                                <el-radio-button label="个人信用报告"></el-radio-button>
                                <el-radio-button label="企业财务报告"></el-radio-button>
                            </el-radio-group>
                        </div>
                    </el-col>
                </el-row>
                <br>
                <el-table :data="tableData" stripe style="width: 100%">
                    <el-table-column prop="date" label="上报时间"></el-table-column>
                    <el-table-column prop="content" label="报送内容"></el-table-column>
                    <el-table-column label="报送原因">
                        <template slot-scope="scope">
                            <span v-if="scope.row.reason === 1">融资需求发布</span>
                            <span v-if="scope.row.reason === 2">金融产品申请</span>
                            <span v-if="scope.row.reason === 3">企业风险评级</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="file" label="文件名"></el-table-column>
                    <el-table-column label="操作（附件下载）">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="showDetail(scope.row.ID)">附件下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br>
                <el-pagination
                    class="fxb-page"
                    v-show="totalRecords>0"
                    :total="totalRecords"
                    :page-size="pageSize"
                    :current-page.sync="pageNo"
                    @current-change="changeCurrentPage"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: "InfoPush",
    data() {
        return {
            activeName: "needs",
            progressState: "全部",
            tableData: [
                {
                    date: "2016-05-02",
                    content:'企业征信报告',
                    reason: 1,
                    file: "XXXXX.text",
                },
                {
                    date: "2016-05-02",
                    content:'企业征信报告',
                    reason: 2,
                    file: "XXXXX.text",
                },
                {
                    date: "2016-05-02",
                    content:'企业征信报告',
                    reason: 3,
                    file: "XXXXX.text",
                },
                {
                    date: "2016-05-02",
                    content:'企业征信报告',
                    reason: 2,
                    file: "XXXXX.text",
                },
            ],
            pageNo: 1,
            pageSize: 10,
            totalRecords: 100,
            dialogVisible: false,
            dialogActiveName: "first",
            batchSetLoading: false
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        showDetail() {
            this.dialogVisible = true;
        },
        dialogHandleClick() {},
        beforeBatchSetClose() {
            this.dialogVisible = false;
        },
        changeCurrentPage(){}
    }
};
</script>
 
