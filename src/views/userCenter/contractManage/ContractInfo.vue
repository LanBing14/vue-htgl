<template>
  <div>
    <el-row align="bottom" type="flex" style="margin:13px 0 28px 10px;">
      <el-col :span="3">
        <h2 class="add-title">合同详情</h2>
      </el-col>
      <el-col :span="5">
        <span class="cGrey" v-if="contractForm.contractCategory === 0">请录入大宗商品交易相关信息</span>
        <span class="cGrey" v-if="contractForm.contractCategory === 1">请录入公共资源交易相关信息</span>
        <span class="cGrey" v-if="contractForm.contractCategory === 2">请录入商业合同相关信息</span>
      </el-col>
      <el-col :span="16" align="right">
        <el-button @click="backClick" style="width:100px;" type="primary">返回</el-button>
      </el-col>
    </el-row>

    <div class="add-collapse">
      <p class="collapse-title">
        <span>合同基本信息</span>
        <span
          @click="showCollapse = !showCollapse"
          class="cGrey collapse-switch fl"
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
            <el-row :gutter="60">
              <el-col :span="8">
                <el-form-item label="合同编号">
                  <el-input disabled v-model="contractForm.contractNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同名称">
                  <el-input disabled v-model="contractForm.contractName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同分类">
                  <el-radio-group disabled v-model="contractForm.contractClass">
                    <el-radio label="0">销售合同</el-radio>
                    <el-radio label="1">采购合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="60">
              <el-col :span="8">
                <el-form-item label="对方公司">
                  <el-input disabled v-model="contractForm.oppositeCompany"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="统一社会信用代码">
                  <el-input disabled v-model="contractForm.oppositeSocialCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法定代表人">
                  <el-input disabled v-model="contractForm.oppositeLegalPerson"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="60">
              <el-col :span="8">
                <el-form-item label="所属部门">
                  <el-input disabled v-model="deptName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="负责人">
                  <el-input disabled v-model="userName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="60">
              <el-col :span="8">
                <el-form-item label="合同金额(万元)">
                  <el-input disabled v-model="contractForm.contractPrice"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="全年合同量">
                  <el-input disabled v-model="contractForm.fullYearQuantity"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计量单位">
                  <el-input disabled v-model="contractForm.unit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同开始日期">
                  <el-date-picker
                    disabled
                    style="width: 100%;"
                    type="date"
                    v-model="contractForm.contractStartDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同结束日期">
                  <el-date-picker
                    disabled
                    style="width: 100%;"
                    type="date"
                    v-model="contractForm.contractEndDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="合同概述">
                  <el-input :rows="7" disabled type="textarea" v-model="contractForm.contractDesc"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="合同状态">
                  <el-radio-group disabled v-model="contractForm.status">
                    <el-radio label="0">签约</el-radio>
                    <el-radio label="1">执行中</el-radio>
                    <el-radio label="2">已完成</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="合同附件" class="info-upload">
                  <el-upload
                    :action="uploadUrl"
                    :file-list="contractForm.uploadFileList"
                    accept=".pdf"
                    class="upload-demo"
                    disabled
                  >
                    <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                    <!-- <div class="el-upload__tip" slot="tip">点击上传合同附件，仅支持PDF格式，且单文件不超过20M</div> -->
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
      <p class="collapse-bottom" v-show="showCollapse">
        <span @click="showCollapse = !showCollapse" class="cGrey collapse-switch">
          <i class="el-icon-caret-top"></i> 收起
        </span>
      </p>
    </div>

    <div class="contract-add-tab">
      <el-tabs @tab-click="handleTabClick" type="card" v-model="activeName">
        <el-tab-pane label="对方联系人" name="first">
          <ContractPerson :infomodel="true" ref="contractperson" />
        </el-tab-pane>
        <el-tab-pane label="合同清单" name="second">
          <ContractList :infomodel="true" ref="contractlist" />
        </el-tab-pane>
        <el-tab-pane label="财务管理" name="third">
          <ContractFinancial :infomodel="true" ref="contractfinancial" />
        </el-tab-pane>
        <el-tab-pane label="事项管理" name="fourth">
          <ContractItem :infomodel="true" ref="contractitem" />
        </el-tab-pane>
        <el-tab-pane label="违约登记" name="five">
          <ContractDefault :infomodel="true" ref="contractdefault" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  Api_CompanySearch,
  Api_GetDepartListUser,
  Api_ContractGetDetail,
  Api_GetUserByDeptId
} from "@/api/userCenter/contractManage";
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
      uploadUrl: "/user/center/common/file/ajaxUpload",
      activeName: "first"
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.contractloading = true;
      Api_ContractGetDetail({
        id: this.$route.query.id
      }).then(res => {
        if (res.stateCode === "1") {
          this.contractloading = false;
          this.contractForm = res.data;
          Object.assign(this.contractForm, res.data);

          // 所属部门
          // 负责人

          // 获取部门
          Api_GetDepartListUser().then(dres => {
            if (dres.stateCode === "1") {
              this.treeData = dres.data[0];

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

              depHandel(this.treeData);
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
      this.$message.warning("获取合同信息失败");
    }
  },
  methods: {
    backClick() {
      if (this.$route.query.route === "contract") {
        this.$router.push({
          path: "/userCenter/contract/contract"
        });
      }
      if (this.$route.query.route === "remind") {
        this.$router.push({
          path: "/userCenter/contract/remind"
        });
      }
    },
    handleTabClick(tab, event) {
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
    }
  }
};
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
