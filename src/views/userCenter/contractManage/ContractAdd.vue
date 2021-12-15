<template>
    <div>
        <el-row type="flex" align="bottom" style="margin:13px 0 28px 10px;">
            <el-col :span="3">
                <h2 class="add-title">{{ contractForm.id ? "编辑合同" : "新增合同" }}</h2>
            </el-col>
            <el-col :span="5">
                <span class="cGrey" v-if="contractForm.contractCategory === 0">请录入大宗商品交易相关信息</span>
                <span class="cGrey" v-if="contractForm.contractCategory === 1">请录入公共资源交易相关信息</span>
                <span class="cGrey" v-if="contractForm.contractCategory === 2">请录入商业合同相关信息</span>
            </el-col>
            <el-col :span="16" align="right" class="size-btn-change">
                <el-button
                    @click="submitForm('contractForm');"
                    style="width:100px;"
                    type="primary"
                    :loading="submitLoading"
                >保存
                </el-button>
            </el-col>
        </el-row>

        <div class="add-collapse">
            <p class="collapse-title">
        <span class="font16">
          <svg-icon class="fxb-blue marR10 font22" icon-class="hetong"/>合同基本信息
        </span>
                <span
                    class="cGrey collapse-switch fl"
                    @click="showCollapse = !showCollapse"
                    v-show="!showCollapse"
                >
          <i class="el-icon-caret-bottom"></i> 展开
        </span>
            </p>
            <el-collapse-transition>
                <div class="collapse-content" v-show="showCollapse">
                    <el-form
                        :label-position="'top'"
                        :model="contractForm"
                        :rules="rules"
                        ref="contractForm"
                        v-loading="contractloading"
                    >
                        <el-row :gutter="74">
                            <el-col :span="8">
                                <el-form-item
                                    label="合同编号"
                                    prop="contractNo"
                                    :rules="[
                                { required: true, message: '请输入合同编号', trigger: 'blur' },
                                { max:40, message: '长度不超过40个字', trigger: ['blur', 'change'] }
                            ]"
                                >
                                    <el-input v-model="contractForm.contractNo" placeholder="请输入合同编号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item
                                    label="合同名称"
                                    prop="contractName"
                                    :rules="[
                                { required: true, message: '请输入合同名称', trigger: 'blur' },
                                { max:100, message: '长度不超过100个字', trigger: ['blur', 'change'] }
                            ]"
                                >
                                    <el-input v-model="contractForm.contractName" placeholder="请输入合同名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同分类" prop="contractClass">
                                    <el-radio-group v-model="contractForm.contractClass">
                                        <el-radio label="0">销售合同</el-radio>
                                        <el-radio label="1">采购合同</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="74">
                            <el-col :span="8">
                                <el-form-item
                                    label="对方公司"
                                    prop="oppositeCompany"
                                    :rules="[
                                { required: true, message: '请输入对方公司', trigger: 'blur' },
                            ]"
                                >
                                    <el-autocomplete
                                        v-model="contractForm.oppositeCompany"
                                        :disabled="contractStatus"
                                        placeholder="请输入对方公司"
                                        :fetch-suggestions="querySearch"
                                        :trigger-on-focus="false"
                                        @select="handleSelect"
                                        style="width: 100%;"
                                    ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="统一社会信用代码">
                                    <el-input v-model="contractForm.oppositeSocialCode" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="法定代表人">
                                    <el-input v-model="contractForm.oppositeLegalPerson" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="74">
                            <el-col :span="8">
                                <el-form-item
                                    :rules="[
                                { required: true, message: '请选择所属部门', trigger: 'change' },
                            ]"
                                    label="所属部门"
                                    prop="deptId"
                                >
                                    <el-popover
                                        ref="popover"
                                        visible-arrow="false"
                                        placement="bottom"
                                        trigger="click"
                                        width="250"
                                        v-model="deparmentProps"
                                    >
                                        <el-tree
                                            :data="treeData"
                                            :render-content="renderContent"
                                            :props="defaultProps"
                                            @node-click="handleNodeClick"
                                        ></el-tree>
                                        <el-input
                                            slot="reference"
                                            type="text"
                                            readonly
                                            placeholder="请选择所属部门"
                                            v-model="deptName"
                                        ></el-input>
                                    </el-popover>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item
                                    :rules="[
                                { required: true, message: '请选择企业成员', trigger: 'blur' },
                                { validator: validRules , trigger: ['blur', 'change']},
                            ]"
                                    label="负责人"
                                    prop="userId"
                                >
                                    <el-select
                                        :disabled="deparmentUsers.length === 0"
                                        placeholder="请选择企业成员"
                                        style="width:100%;"
                                        v-model="userName"
                                    >
                                        <el-option
                                            :key="item.id"
                                            :value="item.id"
                                            @click.native="selectClick(item)"
                                            v-for="item in deparmentUsers"
                                        >{{ item.realName }}
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="74">
                            <el-col :span="8">
                                <el-form-item
                                    label="合同金额(万元)"
                                    prop="contractPrice"
                                    :rules="[
                                { required: true, message: '请输入合同金额', trigger: 'blur' },
                                { validator: validTotal , trigger: ['blur', 'change']}
                            ]"
                                >
                                    <el-input v-model="contractForm.contractPrice" placeholder="请输入合同金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item
                                    label="全年合同量"
                                    prop="fullYearQuantity"
                                    :rules="[
                                { required: contractForm.contractCategory === 0, message: '请输入全年合同量', trigger: 'blur' },
                                { validator: validTotal , trigger: ['blur', 'change'] }
                            ]"
                                >
                                    <el-input v-model="contractForm.fullYearQuantity" placeholder="请输入全年合同量"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item
                                    label="计量单位"
                                    prop="unit"
                                    :rules="[
                                { required: contractForm.contractCategory === 0, message: '请输入计量单位', trigger: 'blur' },
                                { max:10, message: '长度不超过10个字', trigger: ['blur', 'change'] },
                            ]"
                                >
                                    <el-input v-model="contractForm.unit" placeholder="请输入计量单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item
                                    label="合同开始日期"
                                    prop="contractStartDate"
                                    :rules="[
                                { type: 'date', required: true, message: '请选择合同开始日期', trigger: 'blur' }
                            ]"
                                >
                                    <el-date-picker
                                        placeholder="请选择合同开始日期"
                                        style="width: 100%;"
                                        type="date"
                                        v-model="contractForm.contractStartDate"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="合同结束日期" prop="contractEndDate">
                                    <el-date-picker
                                        placeholder="请选择合同结束日期"
                                        style="width: 100%;"
                                        type="date"
                                        v-model="contractForm.contractEndDate"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item
                                    label="合同概述"
                                    prop="contractDesc"
                                    :rules="[
                                { max:1000, message: '长度不超过1000个字', trigger: ['blur', 'change'] }
                            ]"
                                >
                                    <el-input
                                        type="textarea"
                                        :rows="5"
                                        v-model="contractForm.contractDesc"
                                        placeholder="请输入合同概述"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="合同状态" prop="status">
                                    <el-radio-group v-model="contractForm.status">
                                        <el-radio label="0">签约</el-radio>
                                        <el-radio label="1">执行中</el-radio>
                                        <el-radio label="2">已完成</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="合同附件" class="marB0">
                                    <el-upload
                                        class="upload-demo"
                                        :action="uploadUrl"
                                        accept=".pdf"
                                        :on-remove="handleRemove"
                                        multiple
                                        :limit="5"
                                        :before-upload="beforeUpload"
                                        :http-request="handleUpload"
                                        :on-exceed="handleExceed"
                                        :file-list="contractForm.uploadFileList"
                                    >
                                        <el-button type="info" plain>点击上传</el-button>
                                        <div slot="tip" class="upload-tip">点击上传合同附件，仅支持PDF格式，且单文件不超过20M</div>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-collapse-transition>
            <p class="collapse-bottom" v-show="showCollapse">
        <span class="cGrey collapse-switch" @click="showCollapse = !showCollapse">
          <i class="el-icon-caret-top"></i> 收起
        </span>
            </p>
        </div>

        <div class="contract-add-tab">
            <el-tabs @tab-click="handleTabClick" type="card" v-model="activeName">
                <el-tab-pane label="对方联系人" name="first">
                    <ContractPerson :contractid="contractForm.id" ref="contractperson"/>
                </el-tab-pane>
                <el-tab-pane label="合同清单" name="second">
                    <ContractList :contractid="contractForm.id" ref="contractlist"/>
                </el-tab-pane>
                <el-tab-pane label="财务管理" name="third">
                    <ContractFinancial :contractid="contractForm.id" ref="contractfinancial"/>
                </el-tab-pane>
                <el-tab-pane label="事项管理" name="fourth">
                    <ContractItem :contractid="contractForm.id" ref="contractitem"/>
                </el-tab-pane>
                <el-tab-pane label="违约登记" name="five">
                    <ContractDefault :contractid="contractForm.id" ref="contractdefault"/>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/jsx">
    import {
        Api_CompanySearch,
        Api_ContractSave,
        Api_GetDepartListUser,
        Api_ContractGetDetail,
        Api_GetUserByDeptId
    } from "@/api/userCenter/contractManage";
    import {Api_upload, Api_fileUrl} from "@/api/baseApi";
    import {uuid} from "@/utils/index";
    import {isNull} from "@/utils/commonUtils";
    import {patterns} from "@/utils/validate";
    import ContractPerson from "./contract/Person.vue";
    import ContractList from "./contract/Conlist.vue";
    import ContractFinancial from "./contract/Financial.vue";
    import ContractItem from "./contract/Conitem.vue";
    import ContractDefault from "./contract/Default.vue";

    export default {
        components: {
            ContractPerson,
            ContractList,
            ContractFinancial,
            ContractItem,
            ContractDefault
        },
        data() {
            return {
                treeData: [],
                defaultProps: {
                    children: "DEPART_CHILD_LIST",
                    label: "DEPT_NAME"
                },
                showCollapse: true,
                rules: {},
                deparmentProps: false,
                deparmentUsers: [],
                contractloading: false,
                contractForm: {
                    id: "", // 合同id 前端生成uuid. 去掉-就可以了；每次新增重新生成唯一id
                    contractNo: "", // 合同编号
                    contractName: "", // 合同名称
                    contractCategory: "", // 0:大宗商品交易 1:公共资源交易 2:商业合同
                    contractClass: "0", // 合同分类 0:销售合同 1:采购合同.
                    oppositeCompany: "", // 对方公司名称.
                    oppositeSocialCode: "", // 对方统一社会信用代码
                    oppositeLegalPerson: "", // 对方法定代表人
                    oppositeCompanyId: "", // 对方公司id
                    deptId: "", // 所属部门标识 和 部门表ID 关联.
                    userId: "", // 负责人 用户标识 和用户表ID关联.
                    fullYearQuantity: "", // 全年合同量. 数字格式，当大宗商品交易时为必填项，不超过9位数；
                    unit: "", // 计量单位. 不超过10个字
                    contractPrice: "", // 合同金额.
                    contractStartDate: "", // 合同开始时间.
                    contractEndDate: "", // 合同结束时间.
                    contractDesc: "", // 合同概述.
                    status: "0", // 合同状态 0:签约 1:执行中 2:已完成.
                    uploadFileList: [] // 附件上列表.
                },
                deptName: "",
                userName: "",
                uploadUrl: Api_fileUrl(),
                curUploadFileNum: -1, // 传递给后台的图片顺序
                activeName: "first",
                contractStatus: false,
                submitLoading: false
            };
        },
        beforeMount() {
            if (this.$route.query.id) {
                this.contractForm.id = this.$route.query.id;
                this.contractStatus = true;
                this.contractloading = true;
                Api_ContractGetDetail({
                    id: this.$route.query.id
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.contractloading = false;
                        this.contractForm = res.data;
                        this.$store.dispatch("AddContractInfo", res.data);

                        this.contractForm.contractStartDate = new Date(
                            res.data.contractStartDate
                        );
                        if (res.data.contractEndDate) {
                            this.contractForm.contractEndDate = new Date(
                                res.data.contractEndDate
                            );
                        }

                        // 获取部门
                        Api_GetDepartListUser().then(res => {
                            if (res.stateCode === "1") {
                                this.treeData = res.data;

                                const depHandel = node => {
                                    if (this.contractForm.deptId === node.ID) {
                                        this.deptName = node.DEPT_NAME;
                                    }
                                    if (node.DEPART_CHILD_LIST) {
                                        node.DEPART_CHILD_LIST.forEach(dep => {
                                            depHandel(dep);
                                        });
                                    }
                                };
                                depHandel(this.treeData[0]);
                            } else if (res.stateCode === "80205") {
                                this.$message.warning("权限不足");
                            } else {
                                this.$message.warning("获取部门失败");
                            }
                        });

                        Api_GetUserByDeptId({
                            deptId: this.contractForm.deptId
                        }).then(res => {
                            if (res.stateCode === "1") {
                                this.deparmentUsers = res.data;
                                if (res.data.length > 0) {
                                    res.data.forEach(user => {
                                        if (this.contractForm.userId === user.id) {
                                            this.userName = user.realName;
                                        }
                                    });
                                }
                            } else {
                                this.$message.warning("获取部门人员失败");
                            }
                        });
                    } else {
                        this.$message.warning("获取合同信息失败");
                    }
                });
            } else {
                if (this.$route.query.type !== undefined) {
                    this.contractForm.contractCategory = this.$route.query.type;
                } else {
                    this.$message.warning("未选择合同类型");
                }
                // 获取部门
                Api_GetDepartListUser().then(res => {
                    if (res.stateCode === "1") {
                        this.treeData = res.data;
                        const depHandel = node => {
                            if (node.DEPART_CHILD_LIST) {
                                node.DEPART_CHILD_LIST.forEach(dep => {
                                    depHandel(dep);
                                });
                            }
                            if (node.userList.length > 0) {
                                this.deparmentUsers = this.deparmentUsers.concat(node.userList);
                            }
                        };

                        depHandel(res.data[0]);
                    } else if (res.stateCode === "80205") {
                        this.$message.warning("权限不足");
                    } else {
                        this.$message.warning("获取部门失败");
                    }
                });
            }
        },
        methods: {
            validTotal(rule, value, callback) {
                if (isNull(value)) {
                    if (this.contractForm.contractCategory !== "0") {
                        // 请录入大宗商品交易相关信息 下 为 空不需要判断
                        callback();
                    }
                }
                if (!patterns.contractPrice.test(value)) {
                    callback(new Error("请输入数字"));
                } else if (value.toString().split(".")[0].length > 9) {
                    callback(new Error("长度不超过9位"));
                } else if (
                    value.toString().split(".")[1] === undefined
                        ? false
                        : value.toString().split(".")[1].length > 2
                ) {
                    callback(new Error("保留2位小数"));
                } else {
                    callback();
                }
            },
            validRules(rule, value, callback) {
                if (this.userName === "" || this.userName === undefined) {
                    callback(new Error("请选择企业成员"));
                } else {
                    callback();
                }
            },
            handleTabClick(tab, event) {
                if (this.contractForm.id === "") {
                    this.$message.warning("没有添加合同内容，暂无信息");
                    return false;
                }
                switch (tab.name) {
                    case "first":
                        this.$refs.contractperson.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        });
                        break;
                    case "second":
                        this.$refs.contractlist.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        });
                        break;
                    case "third":
                        this.$refs.contractfinancial.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        });
                        break;
                    case "fourth":
                        this.$refs.contractitem.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        });
                        break;
                    case "five":
                        this.$refs.contractdefault.getTableList({
                            pageNo: 1,
                            pageSize: 5
                        });
                        break;
                }
            },
            // 企业模糊查询
            querySearch(queryString, cb) {
                Api_CompanySearch({
                    queryValue: queryString
                }).then(res => {
                    if (res.stateCode === "50001") {
                        const temp = [];
                        for (const elem of res.data.returnData) {
                            temp.push({
                                value: elem.name,
                                companyId: elem.id,
                                operName: elem.operName,
                                creditCode: elem.creditCode
                            });
                        }
                        cb(temp);
                    } else if (res.stateCode === "50003") {
                        this.$message.warning("请输入更详细的关键词");
                        cb("");
                    }
                });
            },
            handleSelect(item) {
                this.contractForm.oppositeCompanyId = item.companyId;
                this.contractForm.oppositeSocialCode = item.creditCode;
                this.contractForm.oppositeLegalPerson = item.operName;
            },
            // 部门选择
            handleNodeClick(item) {
                this.deptName = item.DEPT_NAME;
                this.contractForm.deptId = item.ID;

                Api_GetUserByDeptId({
                    deptId: item.ID
                }).then(res => {
                    if (res.stateCode === "1") {
                        this.userName = "";
                        this.deparmentUsers = res.data;
                        this.deparmentProps = false;
                    } else {
                        this.$message.warning("获取部门人员失败");
                    }
                });
            },
            // 用户选择
            selectClick(item) {
                this.contractForm.userId = item.id;
                this.userName = item.realName;
            },
            // 文件上传
            beforeUpload(file) {
                const isMatch = /\.(pdf)$/.test(file.name);
                const isLt2M = file.size / 1024 < 1024 * 20;
                if (!isMatch) {
                    this.$message.warning("仅支持pdf格式");
                }
                if (!isLt2M) {
                    this.$message.warning("pdf大小不超过20M");
                }
                return isMatch && isLt2M;
            },
            handleRemove(file, fileList) {
                this.contractForm.uploadFileList = fileList;
            },
            handleUpload(content) {
                this.curUploadFileNum++;
                const formData = new FormData();
                formData.append("file", content.file);
                Api_upload(this.uploadUrl + this.curUploadFileNum, formData).then(res => {
                    this.contractForm.uploadFileList.push(res.url);
                }).catch(e => {
                    this.$message.error(e);
                });
            },
            handleExceed(files, fileList) {
                this.$message.warning("最多可以上传5个附件");
            },
            submitForm(formName) {
                if (this.contractForm.contractCategory === "") {
                    this.$message.warning("未选择合同类型");
                    return false;
                }
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let msg = "";
                        if (this.$route.query.id) {
                            msg = "编辑";
                        } else {
                            msg = "新增";
                            if (this.contractForm.id === "") {
                                this.contractForm.id = uuid();
                            }
                        }

                        if (this.contractForm.contractEndDate) {
                            if (
                                this.contractForm.contractStartDate >
                                this.contractForm.contractEndDate
                            ) {
                                this.$message.error("结束日期小于开始日期");
                                return false;
                            }
                        }

                        if (this.contractForm.uploadFileList.length > 0) {
                            this.contractForm.uploadFileList.forEach(item => {
                                item.businessId = this.contractForm.id;
                            });
                        }

                        this.submitLoading = true;
                        // 获取部门
                        Api_ContractSave(this.contractForm).then(res => {
                            this.submitLoading = false;
                            if (res.stateCode === "1") {
                                this.$message.success(msg + "合同成功");
                                this.$store.dispatch("AddContractInfo", this.contractForm);
                                this.contractStatus = true;
                                this.showCollapse = !this.showCollapse;
                            } else {
                                this.$message.warning(msg + "合同失败");
                            }
                        });
                        this.show = !this.show;
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            renderContent(h, {node, data}) {
                let name = data.DEPT_NAME;
                if (data.DEPT_NAME.length > 11) {
                    name = data.DEPT_NAME.substring(0, 11) + "...";
                }
                return (<span class="custom-tree-node" title={data.DEPT_NAME}>{name}</span>)
            }
        }
    }
</script>
<style lang="scss">
    .add-collapse {
        .el-form-item {
            margin-bottom: 8px;
        }

        .el-form--label-top .el-form-item__label {
            padding: 0 0 2px 0;
            font-weight: 500;
        }

        .upload-tip {
            font-size: 14px;
            color: #abb7c5;
            margin-top: 7px;
        }
    }

    .contract-add-tab {
        margin-top: 30px;

        .el-tabs__nav-scroll {
            background-color: #f7f8fa;
        }

        .el-tabs__header {
            margin-left: 0px;
            margin-right: 0px;
        }

        .el-tabs--card > .el-tabs__header .el-tabs__nav,
        .el-tabs--card > .el-tabs__header .el-tabs__item {
            border: 0;
            width: 142px;
            text-align: center;
        }

        .el-tabs__item {
            height: 48px;
            padding: 0 30px;
            line-height: 48px;
            font-size: 14px;
            color: #000;
        }

        .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
            color: #fff;
            background-color: #1478f0;
        }

        .el-tabs__content {
            padding: 0;
        }
    }

    .table-window-panel {
        margin-top: 10px;
        padding: 30px 55px 20px;
        background-color: #fff;
        border: 1px solid rgba(74, 157, 242, 0.5);
        box-shadow: 0px -1px 10px rgba(74, 157, 242, 0.3);

        .el-form-item {
            margin-bottom: 8px;
        }

        .el-form--label-top .el-form-item__label {
            padding: 0 0 2px 0;
            font-weight: 500;
        }

        .window-panel-foot {
            margin-top: 23px;

            .el-button--primary {
                padding: 12px 34px;
            }
        }
    }

    .tab-bottom-abb {
        margin-top: 20px;
        margin-bottom: 30px;
    }
</style>
<style lang="scss" scoped>
    .cGrey {
        color: #c0c4cc;
    }

    .fl {
        float: right;
    }

    .add-title {
        font-size: 20px;
        font-weight: 600;
    }

    .add-collapse {
        border: 1px solid #ddd;
        border-radius: 3px;
    }

    .collapse-title {
        padding: 10px 30px;
        border-bottom: 1px solid #ddd;
    }

    .collapse-content {
        padding: 30px 68px 0;
    }

    .collapse-bottom {
        text-align: right;
        padding: 10px 30px;
    }

    .collapse-switch {
        cursor: pointer;
    }

    .credit-tab {
        background-color: #f7f8fa;
        overflow: hidden;
        margin: 0 10px 20px;
    }

    .credit-tab li {
        font-size: 16px;
        float: left;
        width: 140px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        cursor: pointer;
    }

    .credit-tab li:hover {
        color: #fff;
        background-color: #1478f0;
    }

    .credit-tab li.router-link-active {
        color: #fff;
        background-color: #1478f0;
    }

    .credit-tab li.router-link-active:hover {
        color: #fff;
    }
</style>
