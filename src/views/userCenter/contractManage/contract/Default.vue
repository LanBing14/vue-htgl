<template>
<div class="fxb-edit-table" v-loading="tableLoading">
    <!-- 名称(*)、违约类型(供货延迟、账款逾期、其他) (*)、违约内容详细描述(*)、状态、登记时间 -->
    <el-table class="fxb-table" :data="tableData" :expand-row-keys="expands" @cell-mouse-enter="handelEnter" row-key="ID" stripe>
        <el-table-column label="名称" prop="NAME"></el-table-column>
        <el-table-column label="违约类型">
            <template slot-scope="scope">
                <!-- 0:供货延迟 1:账款逾期 2:质量纠纷 3:其他. -->
                {{ scope.row.ITEM_TYPE === '0' ? '供货延迟' : scope.row.ITEM_TYPE === '1' ? '账款逾期' : scope.row.ITEM_TYPE === '2' ? '质量纠纷' :'其他' }}
            </template>
        </el-table-column>
        <el-table-column label="违约内容详细描述">
            <template slot-scope="scope">
                {{ (scope.row.CONTENT_DESC.length > 10 ) ? (scope.row.CONTENT_DESC.substring(0,10) + '...') : scope.row.CONTENT_DESC }}
            </template>
        </el-table-column>
        <el-table-column label="状态" >
            <template slot-scope="scope">
                <!-- 0:未解决 1:已解决. -->
                {{ scope.row.SOLUTION_STATUS === '0' ? '未解决' : '已解决' }}
            </template>
        </el-table-column>
        <el-table-column label="登记时间" >
            <template slot-scope="scope">
                {{ scope.row.CREATE_DATE | dateFormat('yyyy-MM-dd') }}
            </template>
        </el-table-column>

        <el-table-column type="expand" width="1">
            <template slot-scope="props">
                <div class="row-tool-panel">
                    <span @click="defaultInfo(props.row)">
                        <svg-icon icon-class="detail" /> 详情</span>
                    <span @click="editDefault(props.row)">
                        <svg-icon icon-class="edit" /> 编辑</span>
                    <span @click="deleteDefault(props.row)">
                        <svg-icon icon-class="delete" /> 删除</span>
                    <span @click="defaultAssociate(props.row)">
                        <svg-icon icon-class="connect" /> 关联司法信息</span>
                </div>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination :current-page.sync="postData.pageNo" :page-size="postData.pageSize" :total="totalRecords" @current-change="changeCurrentPage" class="fxb-page" v-show="totalRecords>0" />

    <el-collapse-transition>
        <div class="table-window-panel" v-show="show">
            <el-form :label-position="'top'" :model="defaultForm" :rules="rules" ref="defaultForm">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item :rules="[
                            { required: true, message: '请输入名称', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' }
                        ]" label="名称" prop="name">
                            <el-input placeholder="请输入名称" v-model="defaultForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="违约类型" prop="itemType">
                            <el-radio-group v-model="defaultForm.itemType">
                                <el-radio label="0">供货延迟</el-radio>
                                <el-radio label="1">账款逾期</el-radio>
                                <el-radio label="2">质量纠纷</el-radio>
                                <el-radio label="3">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :rules="[
                            { required: true, message: '请输入违约内容详细描述', trigger: 'blur' },
                            { max:1000, message: '长度不超过1000个字', trigger: 'change' }
                        ]" label="违约内容详细描述" prop="contentDesc">
                            <el-input :rows="7" placeholder="请输入违约内容详细描述" type="textarea" v-model="defaultForm.contentDesc"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态" prop="solutionStatus">
                            <el-radio-group v-model="defaultForm.solutionStatus">
                                <el-radio label="0">未解决</el-radio>
                                <el-radio label="1">已解决</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" align="center" class="window-panel-foot">
                        <el-form-item>
                            <el-button @click="submitForm('defaultForm');" type="primary" :loading="submitLoading">保存</el-button>
                            <el-button @click="resetForm('defaultForm');" >取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </el-collapse-transition>

    <el-row :gutter="10" class="tab-bottom-abb" v-if="!infomodel">
        <el-col :span="24">
            <el-button :disabled="!conStatus" @click="addDefault" icon="el-icon-plus" size="mini" style="width:100%;" v-if="!show">新增违约登记</el-button>
        </el-col>
    </el-row>

    <el-dialog :visible.sync="infoVisible" :close-on-click-modal="false" title="违约登记查看" width="60%">
        <div class="default-tab" v-loading="infoLoading">

            <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
                <tr>
                    <th>违约事件名称</th>
                    <td>{{ infoDefault.name }}</td>
                    <th>违约类型</th>
                    <td v-if="infoDefault.itemType === '0'">供货延迟</td>
                    <td v-if="infoDefault.itemType === '1'">账款逾期</td>
                    <td v-if="infoDefault.itemType === '2'">质量纠纷</td>
                    <td v-if="infoDefault.itemType === '3'">其他</td>
                    <th>登记时间</th>
                    <td>{{ infoDefault.createDate | dateFormat('yyyy-MM-dd') }}</td>
                </tr>
                <tr>
                    <th>违约内容描述</th>
                    <td colspan="6" class="break-row">{{ infoDefault.contentDesc }}</td>
                </tr>
            </table>

            <el-tabs @tab-click="infoHandleClick" type="card" v-model="infoActiveName">
                <el-tab-pane label="裁判文书" name="first"></el-tab-pane>
                <el-tab-pane label="被执行人" name="second"></el-tab-pane>
                <el-tab-pane label="失信信息" name="third"></el-tab-pane>
            </el-tabs>

            <!-- 裁判文书：案号、案件名称、案由、案件身份、执行法院、发布日期； -->
            <!-- 被执行人：案号、执行法院、执行标的、发布日期； -->
            <!-- 失信信息：案号、立案日期、执行法院、发布日期； -->
            <el-table class="fxb-table" :data="infoTableData" row-key="id" stripe>
                <el-table-column label="案号" prop="caseNo"></el-table-column>
                <el-table-column label="案件名称" prop="caseName" v-if="infoActiveName === 'first'"></el-table-column>
                <el-table-column label="案由" width="120" v-if="infoActiveName === 'first'">
                    <template slot-scope="scope">
                        {{ (scope.row.cause.length > 10 ) ? (scope.row.cause.substring(0,10) + '...') : scope.row.cause }}
                    </template>
                </el-table-column>
                <el-table-column label="案件当事人" prop="caseIdentity" v-if="infoActiveName === 'first'"></el-table-column>
                <el-table-column label="立案日期" prop="filingDate" v-if="infoActiveName === 'third'"></el-table-column>
                <el-table-column label="执行法院" prop="court"></el-table-column>
                <el-table-column label="执行标的" prop="subjectMatter" v-if="infoActiveName === 'second'"></el-table-column>
                <el-table-column label="发布日期" prop="publishDate">
                    <template slot-scope="scope">
                        {{ scope.row.publishDate | dateFormat('yyyy-MM-dd') }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="status">
                    <template slot-scope="scope">
                        <a @click="removeAssociate(scope.row)" href="javascript:void(0);">解除关联</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span class="dialog-footer" slot="footer">
            <el-button @click="infoVisible = false" style="width:100px">关 闭</el-button>
        </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="associateVisible" title="关联司法信息" width="60%">
        <div class="default-tab" v-loading="associateLoading">
            <el-tabs class="fxb-table" @tab-click="associateHandleClick" type="card" v-model="associateActiveName">
                <el-tab-pane label="裁判文书" name="first">
                    <!-- 裁判文书：案号、案件名称、案由、案件当事人、执行法院、发布日期； -->
                    <el-table :data="associateTableData" @selection-change="handleSelectionChange"
                              ref="multipleTableFirst">
                        <el-table-column :selectable="associateCheck" type="selection" width="55"></el-table-column>
                        <el-table-column label="案号" prop="caseNo"></el-table-column>
                        <el-table-column label="案件名称" prop="caseName"></el-table-column>
                        <el-table-column label="案由" width="120">
                            <template slot-scope="scope">
                                {{ (scope.row.legalbase.length > 10 ) ? (scope.row.legalbase.substring(0,10) + '...') : scope.row.legalbase }}
                            </template>
                        </el-table-column>
                        <el-table-column label="案件当事人" prop="appellor"></el-table-column>
                        <el-table-column label="执行法院" prop="court"></el-table-column>
                        <el-table-column label="发布日期" prop="submitDate">
                            <template slot-scope="scope">
                                {{ scope.row.submitDate | dateFormat('yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="被执行人" name="second">
                    <!-- 被执行人：案号、执行法院、执行标的、发布日期； -->
                    <el-table :data="associateTableData" @selection-change="handleSelectionChange" ref="multipleTableSecond">
                        <el-table-column :selectable="associateCheck" type="selection" width="55"></el-table-column>
                        <el-table-column label="案号" prop="anno"></el-table-column>
                        <el-table-column label="执行法院" prop="executeGov"></el-table-column>
                        <el-table-column label="执行标的" prop="biaodi"></el-table-column>
                        <el-table-column label="发布日期" prop="liandate">
                            <template slot-scope="scope">
                                {{ scope.row.liandate | dateFormat('yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="失信信息" name="third">
                    <!-- 失信信息：案号、立案日期、执行法院、发布日期； -->
                    <el-table :data="associateTableData" @selection-change="handleSelectionChange" ref="multipleTableThird">
                        <el-table-column :selectable="associateCheck" type="selection" width="55"></el-table-column>
                        <el-table-column label="案号" prop="anno"></el-table-column>
                        <el-table-column label="立案日期" prop="liAnDate">
                            <template slot-scope="scope">
                                {{ scope.row.liAnDate | dateFormat('yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                        <el-table-column label="执行法院" prop="executegov"></el-table-column>
                        <el-table-column label="发布日期" prop="publicdate">
                            <template slot-scope="scope">
                                {{ scope.row.publicdate | dateFormat('yyyy-MM-dd') }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <el-pagination :current-page.sync="associatePostData.pageNo" :page-size="associatePostData.pageSize" :total="associateTotalRecords" @current-change="associateChangeCurrentPage" class="fxb-page" v-show="associateTotalRecords>0" />
            <br>
            <a @click="associateAdd" href="javascript:void(0);" v-if="!associateTotalRecords"> 未找到匹配记录，手动录入 >> </a>
        </div>
        <span class="dialog-footer" slot="footer">
            <el-button @click="handleSure" style="width:100px" type="primary">确 定</el-button>
            <el-button @click="associateVisible = false;associateActiveName = 'first'" style="width:100px">取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :title="'手动录入- ' + associateAddTitle[associateActiveName]"
               :visible.sync="associateAddVisible" width="60%" top="2vh">

        <el-form :label-position="'top'" :model="associateAddForm" :rules="rules" ref="associateAddForm">
            <!-- 裁判文书 -->
            <el-row :gutter="60">
                <el-col :span="8">
                    <el-form-item :rules="[
                            { required: true, message: '请输入案号', trigger: 'blur' },
                            { max:40, message: '长度不超过40个字', trigger: 'change' }
                        ]" label="案号" prop="caseNo">
                        <el-input placeholder="请输入案号" v-model="associateAddForm.caseNo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="16" v-if="associateActiveName === 'first'">
                    <el-form-item :rules="[
                            { required: true, message: '请输入案件名称', trigger: 'blur' },
                            { max:100, message: '长度不超过100个字', trigger: 'change' }
                        ]" label="案件名称" prop="caseName">
                        <el-input placeholder="请输入案件名称" v-model="associateAddForm.caseName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="associateActiveName === 'first'">
                    <el-form-item :rules="[
                            { required: true, message: '请输入案由', trigger: 'blur' },
                            { max:1000, message: '长度不超过1000个字', trigger: 'change' }
                        ]" label="案由" prop="cause">
                        <el-input :rows="5" placeholder="请输入案由" type="textarea" v-model="associateAddForm.cause"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="associateActiveName === 'first'">
                    <el-form-item :rules="[
                            { required: true, message: '请输入案件当事人', trigger: 'blur' },
                            { max:100, message: '长度不超过100个字', trigger: 'change' }
                        ]" label="案件当事人" prop="caseIdentity">
                        <el-input placeholder="请输入案件当事人" v-model="associateAddForm.caseIdentity"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :rules="[
                            { type: 'date', required: true, message: '请选择立案日期', trigger: 'change' }
                        ]" label="立案日期">
                        <el-form-item prop="filingDate">
                            <el-date-picker placeholder="请选择立案日期" style="width: 100%;" type="date" v-model="associateAddForm.filingDate"></el-date-picker>
                        </el-form-item>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :rules="[
                            { required: true, message: '请输入执行法院', trigger: 'blur' },
                            { max:40, message: '长度不超过40个字', trigger: 'change' }
                        ]" label="执行法院" prop="court">
                        <el-input placeholder="请输入执行法院" v-model="associateAddForm.court"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="associateActiveName === 'second'">
                    <el-form-item :rules="[
                            { required: true, message: '请输入执行标的', trigger: 'blur' },
                            { max:10, message: '长度不超过10个字', trigger: 'change' },
                            { type:'number', message: '执行标的只能为数字', trigger: 'change',
                                transform (value) {
                                    return value * 1
                                }
                            }
                        ]" label="执行标的" prop="subjectMatter">
                        <el-input placeholder="请输入执行标的" v-model="associateAddForm.subjectMatter"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :rules="[
                            { type: 'date', required: true, message: '请选择发布日期', trigger: 'change' }
                        ]" label="发布日期">
                        <el-form-item prop="publishDate">
                            <el-date-picker placeholder="请选择发布日期" style="width: 100%;" type="date" v-model="associateAddForm.publishDate"></el-date-picker>
                        </el-form-item>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span class="dialog-footer" slot="footer">
            <el-button @click="submitAddForm('associateAddForm');" style="width:100px;" type="primary">保存</el-button>
            <el-button @click="resetAddForm('associateAddForm');" style="width:100px;">取消</el-button>
        </span>
    </el-dialog>

</div>
</template>

<script>
    import {
        Api_CancelJudicialInfo,
        Api_DefaultDelete,
        Api_DefaultGetDetail,
        Api_DefaultGetList,
        Api_DefaultSave,
        Api_GetAssetShiXing,
        Api_GetAssetZhiXing,
        Api_GetJudicialList,
        Api_GetRefereeDocument,
        Api_SaveJudicialInfo,
        Api_SaveManualJudicialInfo
    } from "@/api/userCenter/contractManage";
    import {getUserInfo} from "@/utils/auth";
    import {dateFormat} from '@/utils/index'

    export default {
    name: "ContractDefault",
    filters: {
        dateFormat
    },
    props: {
        contractid: String,
        // 查看详情时不显示编辑
        infomodel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 当前合同状态
            conStatus: true,
            // 查看详情时不显示编辑
            infoModel: false,
            // 表格状态 新增，编辑时表格不能进行删除编辑
            tableLock: false,
            show: false,
            expands: [],
            rules: {},
            defaultForm: {
                id: "", // 违约登记 主键id （传主键 就是更新；不传就是新增）
                contractId: "", // 合同主键id
                name: "", // 名称.
                itemType: "0", // 违约类型 0:供货延迟 1:账款逾期 2:质量纠纷 3:其他.
                contentDesc: "", // 违约内容详细描述.
                solutionStatus: "0" // 状态 0:未解决 1:已解决.
            },
            postData: {
                contractId: "", // 合同主键id
                pageNo: 1, // 当前页
                pageSize: 5 // 分页大小
            },
            tableLoading: false,
            tableData: [],
            totalRecords: 0,

            // 详情 - 表格
            infoLoading: false,
            infoVisible: false,
            infoActiveName: "first",
            infoDefault: {},
            infoTableData: [],
            infoPostData: {
                defaultRegistrationId: "", // 违约登记 主键id
                defaultType: 0 // 违约类型 0:裁判文书 1:被执行人 2:失信信息.
            },
            infoTotalRecords: 1,

            // 关联司法信息 - 表格
            associateLoading: false,
            associateVisible: false,
            associateActiveName: "first",
            associateTableData: [],
            associatePostData: {
                defaultRegistrationId: "",
                companyId: "", // 公司id 逗号分隔 例如：123123123，1231231 一个是本人公司，一个是对方公司
                companyName: "", // 公司名称, 用%拼接连个公司 例如：未至%阿里巴巴
                pageNo: 1, // 当前页
                pageSize: 5 // 每页大小
            },
            associateTotalRecords: 1,
            userInfo: getUserInfo(),
            associateAddTitle: {
                'first': "裁判文书",
                'second': "被执行人",
                'third': "失信信息"
            },
            associateAddVisible: false,
            connectPostData: [],
            submitLoading: false,
            associateAddForm: {
                caseNo: "", // 案号
                publishDate: "", // 发布日期
                filingDate: "", // 立案日期
                court: "", // 执行法院
                subjectMatter: "", // 执行标的
                cause: "", // 案由
                caseIdentity: "", // 案件当事人.
                defaultId: "", // 违约登记主键(和违约登记表ID字段关联).
                defaultType: "", // 违约类型 0:裁判文书 1:被执行人 2:失信信息.
                caseName: "" // 案件名称.
            }
        }
    },
    watch: {
        contractid(val) {
            if (val) {
                this.conStatus = true;
                this.defaultForm.contractId = val;
                this.postData.contractId = val;
            }
        }
    },
    mounted() {
        if (this.$route.query.id !== undefined) {
            this.conStatus = true;
        } else {
            this.conStatus = false;
        }
    },
    methods: {
        handelEnter(row, column, cell, event) {
            const cindex = this.expands.indexOf(row.ID);
            if (!this.tableLock) {
                if (cindex < 0) {
                    this.expands.shift();
                    this.expands.push(row.ID);
                }
            }
        },
        getTableList(option) {
            this.show = false;
            this.tableLock = this.infomodel;
            this.tableLoading = true;
            if (this.$route.query.id) {
                this.postData.contractId = this.$route.query.id;
            }
            Api_DefaultGetList(Object.assign(this.postData, option)).then(res => {
                this.tableLoading = false;
                if (res.stateCode === "1") {
                    const data = res.data;
                    this.tableData = data.list;
                    this.totalRecords = data.totalRecords;
                } else {
                    this.$message.error('数据加载失败');
                }
            });
        },
        changeCurrentPage() {
            this.getTableList();
        },
        addDefault() {
            this.tableLock = true;
            this.expands = [];
            this.defaultForm.id = "";
            this.$refs['defaultForm'].resetFields();
            this.show = !this.show;
        },
        editDefault(row) {
            this.tableLock = true;
            this.expands = [];
            this.show = !this.show;

            Api_DefaultGetDetail({
                id: row.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.defaultForm = res.data;
                } else {
                    this.$message.warning("获取违约登记失败");
                }
            })
        },
        deleteDefault(row) {
            this.$confirm('确定删除该违约登记数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(() => {
                Api_DefaultDelete({
                    id: row.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success("删除违约登记成功");
                        this.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        })
                    } else {
                        this.$message.warning("删除违约登记失败");
                    }
                })
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.$route.query.id) {
                        this.defaultForm.contractId = this.$route.query.id;
                    }
                    this.submitLoading = true;
                    Api_DefaultSave(this.defaultForm).then(res => {
                        this.submitLoading = false;
                        if (res.stateCode === "1") {
                            if (this.defaultForm.id === "") {
                                this.$message.success("新增违约登记成功");
                            } else {
                                this.$message.success("编辑违约登记成功");
                            }
                            this.getTableList({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else {
                            if (this.defaultForm.id === "") {
                                this.$message.warning("新增违约登记失败");
                            } else {
                                this.$message.warning("编辑违约登记失败");
                            }
                        }
                    });
                    this.show = !this.show;
                    this.tableLock = false;
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.show = false;
            this.tableLock = false;
            this.$refs[formName].resetFields();
        },
        // 详情
        defaultInfo(row) {
            this.infoVisible = true;
            this.infoPostData.defaultRegistrationId = row.ID;
            this.infoGetlist();
            // 获取违法信息
            Api_DefaultGetDetail({
                id: row.ID
            }).then(res => {
                if (res.stateCode === "1") {
                    this.infoDefault = res.data;
                } else {
                    this.$message.warning("获取违约登记失败");
                }
            })
        },
        // 详情 - 列表
        infoGetlist(option) {
            switch (this.infoActiveName) {
                case "first":
                    this.infoPostData.defaultType = 0;
                    break;
                case "second":
                    this.infoPostData.defaultType = 1;
                    break;
                case "third":
                    this.infoPostData.defaultType = 2;
                    break;
            }
            this.infoLoading = true;
            Api_GetJudicialList(Object.assign(this.infoPostData, option)).then(res => {
                this.infoLoading = false;
                if (res.stateCode === "1") {
                    this.infoTableData = res.data;
                } else {
                    this.$message.error('数据加载失败');
                }
            });
        },
        // 详情 - tab切换
        infoHandleClick(tab, event) {
            this.infoGetlist()
        },
        // 详情 - 解除关联
        removeAssociate(row) {
            this.$confirm('确定解除关联?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Api_CancelJudicialInfo({
                    defaultDetailId: row.id
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.$message.success("解除关联成功");
                    } else {
                        this.$message.warning("解除关联失败");
                    }
                    this.infoGetlist()
                })
            })
        },
        // 关联司法信息
        defaultAssociate(row) {
            this.associateVisible = true;
            this.associateGetlist();
            this.associateAddForm.defaultId = row.ID;
            this.associatePostData.defaultRegistrationId = row.ID;
        },
        // 关联司法信息 - 列表
        associateGetlist(option) {
            const store = this.$store.state;
            const contractinfo = store.contract.contractinfo;
            this.associateLoading = true;
            switch (this.associateActiveName) {
                case "first":
                    this.associatePostData.companyId = this.userInfo.companyId + ',' + contractinfo.oppositeCompanyId;
                    this.associatePostData.companyName = this.userInfo.companyName + '%' + contractinfo.oppositeCompany;
                    Api_GetRefereeDocument(Object.assign(this.associatePostData, option)).then(res => {
                        this.associateLoading = false;
                        if (res.stateCode === "1") {
                            const data = res.data;
                            this.associateTableData = data.result;
                            this.associateTotalRecords = data.totalRecords;
                            setTimeout(() => {
                                this.associateToggleSelection(data.result);
                            }, 200);
                        } else {
                            this.$message.error('数据加载失败');
                        }
                    });
                    break;
                case "second":
                    this.associatePostData.companyId = contractinfo.oppositeCompanyId;
                    this.associatePostData.companyName = contractinfo.oppositeCompany;
                    Api_GetAssetZhiXing(Object.assign(this.associatePostData, option)).then(res => {
                        this.associateLoading = false;
                        if (res.stateCode === "1") {
                            const data = res.data;
                            this.associateTableData = data.result;
                            this.associateTotalRecords = data.totalRecords;
                            setTimeout(() => {
                                this.associateToggleSelection(data.result);
                            }, 200);
                        } else {
                            this.$message.error('数据加载失败');
                        }
                    });
                    break;
                case "third":
                    this.associatePostData.companyId = contractinfo.oppositeCompanyId;
                    this.associatePostData.companyName = contractinfo.oppositeCompany;
                    Api_GetAssetShiXing(Object.assign(this.associatePostData, option)).then(res => {
                        this.associateLoading = false;
                        if (res.stateCode === "1") {
                            const data = res.data;
                            this.associateTableData = data.result;
                            this.associateTotalRecords = data.totalRecords;
                            setTimeout(() => {
                                this.associateToggleSelection(data.result);
                            }, 200);
                        } else {
                            this.$message.error('数据加载失败');
                        }
                    });
                    break;
            }
        },
        associateCheck(row, rowIndex) {
            if (row.isSelected === "1") {
                return false;// 禁用
            } else {
                return true;// 不禁用
            }
        },
        associateToggleSelection(rows) {
            const _self = this;
            if (rows) {
                rows.forEach(row => {
                    if (row.isSelected === "1") {
                        switch (this.associateActiveName) {
                            case "first":
                                _self.$refs.multipleTableFirst.toggleRowSelection(row, true);
                                break;
                            case "second":
                                _self.$refs.multipleTableSecond.toggleRowSelection(row, true);
                                break;
                            case "third":
                                _self.$refs.multipleTableThird.toggleRowSelection(row, true);
                                break;
                        }
                    }
                });
            } else {
                switch (this.associateActiveName) {
                    case "first":
                        _self.$refs.multipleTableFirst.clearSelection();
                        break;
                    case "second":
                        _self.$refs.multipleTableSecond.clearSelection();
                        break;
                    case "third":
                        _self.$refs.multipleTableThird.clearSelection();
                        break;
                }
            }
        },
        // 关联司法信息 - tab切换
        associateHandleClick(tab, event) {
            this.associateGetlist({
                pageNo: 1,
                pageSize: 5
            })
        },
        // 关联司法信息 - page切换
        associateChangeCurrentPage(cal) {
            this.associateGetlist()
        },
        // 关联司法信息 - 多选
        handleSelectionChange(val) {
            val.forEach(item => {
                item.defaultId = this.associateAddForm.defaultId;
                switch (this.associateActiveName) {
                    case "first":
                        item.defaultType = 0;
                        break;
                    case "second":
                        item.defaultType = 1;
                        break;
                    case "third":
                        item.defaultType = 2;
                        break;
                }
            });
            this.connectPostData = val;
        },
        // 关联司法信息 - 保存
        handleSure(val) {
            Api_SaveJudicialInfo(this.connectPostData).then(res => {
                if (res.stateCode === "1") {
                    this.$message.success("关联成功");
                } else {
                    this.$message.warning("关联失败");
                }
                this.associateVisible = false;
                this.associateActiveName = 'first';
            })
        },
        associateAdd() {
            this.associateVisible = false;
            this.associateAddVisible = true;
            this.$refs['associateAddForm'].resetFields();
        },
        submitAddForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    switch (this.associateActiveName) {
                        case "first":
                            this.associateAddForm.defaultType = 0;
                            break;
                        case "second":
                            this.associateAddForm.defaultType = 1;
                            break;
                        case "third":
                            this.associateAddForm.defaultType = 2;
                            break;
                    }
                    Api_SaveManualJudicialInfo(this.associateAddForm).then(res => {
                        if (res.stateCode === "1") {
                            this.$message.success("新增" + this.associateAddTitle[this.associateActiveName] + "成功");
                            this.associateGetlist({
                                pageNo: 1,
                                pageSize: 5
                            })
                        } else if (res.stateCode === "2") {
                            this.$message.warning("案号重复, 新增" + this.associateAddTitle[this.associateActiveName] + "失败");
                        } else {
                            this.$message.warning("新增" + this.associateAddTitle[this.associateActiveName] + "失败");
                        }
                        this.associateAddVisible = false;
                    })
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetAddForm(formName) {
            this.associateAddVisible = false;
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style lang="scss">
.default-tab {
    .el-tabs__nav-scroll {
        background-color: #f7f8fa;
    }

    .el-tabs__header {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .el-tabs--card>.el-tabs__header .el-tabs__nav,
    .el-tabs--card>.el-tabs__header .el-tabs__item {
        border: 0;
    }

    .el-tabs__item {
        height: 48px;
        padding: 0 30px !important;
        line-height: 48px;
        font-size: 16px;
        color: #000;
    }

    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
        color: #fff;
        background-color: #1478f0;
    }

    .el-tabs__content {
        padding: 0;
    }
}
</style><style lang="scss" scoped>
.fxb-info-table {
    width: 100%;
    border-left: 1px solid #e4e4e4;
    border-right: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;
    margin-bottom: 30px;

    th,
    td {
        line-height: 20px;
        padding: 15px;
        border-bottom: 1px solid #e4e4e4;
    }

    th {
        text-align: center;
        width: 110px;
        background: #f7f8fc;
        color: #333;
        white-space: nowrap;
        font-weight: normal;
    }

    td {
        color: #888;
        font-size: 13px;
    }
    .break-row{
        word-wrap: break-word;
        word-break: break-all;
    }
}
</style>
