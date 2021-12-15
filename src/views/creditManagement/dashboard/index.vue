<template>
  <div>
    <div v-show="!editing">
      <myCompany></myCompany>
      <Section1></Section1>

      <div class="bottomMain">
         <el-row>
              <el-col :span="16">
                <Section3 v-if="!editing" ref="ref_Section3" @handleEdit="onEdit"></Section3>
                <Section4></Section4>
              </el-col>
              <el-col :span="8">
                  <!-- 这里是逾期通报 -->
                  <overdueNotification></overdueNotification>
                  <!-- 这里是合同履约 -->
                  <contractPerformance></contractPerformance>
              </el-col>
      
          </el-row>
      </div>
    </div>
    <component
      :is="formKey"
      :modelStatus="modelStatus"
      :row="curRowData"
      isToDo
      @edit="onEdit"
      style="padding: 20px 25px; background-color: white"
    >
      <div class="sub-title">签批信息</div>
      <el-table :data="signList" style="width: 100%">
        <el-table-column prop="taskDefName" label="节点名称" align="center"></el-table-column>
        <el-table-column prop="processRemark" label="意见" align="center"></el-table-column>
        <el-table-column prop="processOperateDesc" label="操作" align="center"></el-table-column>
        <el-table-column prop="operateUser" label="签批人" align="center"></el-table-column>
        <el-table-column prop="modifyDate" label="时间" align="center"></el-table-column>
      </el-table>
      <div v-if="modelStatus" style="text-align: center;margin-top: 20px;" class="size-btn-change">
        <el-button type="primary" @click="handleSign(true)">签批</el-button>
        <el-button @click="handleSign(false)">打回</el-button>
      </div>
      <Dialog
        :title="isSign?'签批':'退回'"
        :visible.sync="visibleSign"
        :onOk="signSure"
        width="500px"
        class="size-btn-change"
        @close="signClose"
      >
        <el-form ref="signForm" :model="signFormData" :rules="signFormRules" label-width="120px">
          <el-form-item label="审核意见：" prop="auditOpinion" style="position: relative; left: -14px;top: 11px;">
            <el-input v-model="signFormData.auditOpinion" :rows="4" type="textarea" placeholder="请输入审核意见"></el-input>
          </el-form-item>
        </el-form>
      </Dialog>
    </component>
  </div>
</template>

<script>
import myCompany from './myCompany'
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
//  导入逾期通报
import overdueNotification from "./overdueNotification.vue"
// 导入合同履约
import contractPerformance from "./contractPerformance"




import Order from "@/views/creditManagement/todo/components/Order";
import OrderChange from "@/views/creditManagement/todo/components/OrderChange";
import Contract from "@/views/creditManagement/todo/components/Contract";
import ConstractChange from "@/views/creditManagement/todo/components/ConstractChange";
import CreditLine from "@/views/creditManagement/todo/components/CreditLine";
import DeliveryApplicationApproval from "@/views/creditManagement/todo/components/DeliveryApplicationApproval";
import ReceiptConfirmation from "@/views/creditManagement/todo/components/ReceiptConfirmation";
import ExtendDueDate from "@/views/creditManagement/todo/components/ExtendDueDate";
import CreditApprovalDetail from "@/views/creditManagement/creditGranting/creditApproval/Detail";
import ShippingApplicationDetails from "@/views/creditManagement/shippingManagement/shippingTracking/ShippingApplicationDetails";
import Attestation from "@/views/creditManagement/todo/components/Attestation.vue";
import BadDetail from "@/views/creditManagement/todo/components/BadDetail";
import ReceivablesEditDetailTodo from "@/views/creditManagement/todo/components/ReceivablesEditDetailTodo";
import PayRegister from "@/views/creditManagement/todo/components/PayRegister.vue";
import AbnormalDeal from "@/views/creditManagement/todo/components/AbnormalDeal.vue";
import SpecialSend from "@/views/creditManagement/todo/components/SpecialSend.vue";

import {
  Api_AgencyMattersDeal,
  Api_AgencyMattersReject,
  Api_AgencyMattersGetAuditPage
  
} from "@/api/creditManagement/todo/index";

const compKeys = {
  Order,
  OrderChange,
  Contract,
  ConstractChange,
  CreditLine,
  DeliveryApplicationApproval,
  ReceiptConfirmation,
  ExtendDueDate,
  CreditApprovalDetail,
  BadDetail,
  Attestation,
  ShippingApplicationDetails,
  ReceivablesEditDetailTodo,
  PayRegister,
  AbnormalDeal,
  SpecialSend,
};

export default {
  name: "Dashboard",
  components: {
    myCompany,
    overdueNotification,
    contractPerformance, // 合同履约
    Section1,
    Section2,
    Section3,
    Section4,
    ...compKeys
  },
  data() {
    const createRules = this.$createRules;
    return {
      editing: false, // 是否处于编辑页面
      modelStatus: true, // 是处理或查看
      formKey: "", // 0、1、2，对应“合同签订审批”、“合同变更审批”、“授信额度审批”
      curRowData: {},
      isSign: true,
      visibleSign: false,
      signFormData: {
        auditOpinion: "",
      },
      signFormRules: {
        auditOpinion: createRules({
          msg: "审核意见",
          required: true,
          max: 200,
        }),
      },
      signList: [], // 签批信息列表
    };
  },
  methods: {
    handleSign(flag) {
      this.isSign = flag;
      this.visibleSign = true;
    },
    onEdit(editing, modelStatus, formKey, row) {
      this.modelStatus = modelStatus;
      this.curRowData = row;
      if (editing) {
        this.currentPages = this.$refs.ref_Section3.$refs.ref_Todo.$refs.ref_main.getCurrentPage();
        if (!formKey) {
          this.$message.warning("该流程缺少formKey！");
          return;
        }
        if (!Object.keys(compKeys).includes(formKey)) {
          this.$message.warning(`formKey配置错误：${formKey}`);
          return;
        }
        this.editing = true;
        this.formKey = formKey;
      } else {
        this.editing = false;
        this.formKey = "";
      }
      if (row) {
        this.getSignList(row);
      }
    },
    // 获取“签批信息列表”
    getSignList(row) {
      const { business_key: businessKey } = row;
      Api_AgencyMattersGetAuditPage({
        businessKey,
      }).then((res) => {
        this.signList = res;
      });
    },
    // 签批或打回
    signSure() {
      this.$refs.signForm.validate((valid) => {
        if (valid) {
          if (this.isSign) {
            this.$confirm("确定通过审核吗？", "提示", {
              type: "warning",
            }).then(() => {
              const { id, business_id: businessId } = this.curRowData;
              const loading = this.$openLoading();
              Api_AgencyMattersDeal(id, {
                businessId,
                processOperate: 2,
                processRemark: this.signFormData.auditOpinion,
              })
                .then((msg) => {
                  this.$message.success(msg);
                  loading.close();
                  this.visibleSign = false;
                  this.onEdit(false);
                  this.signClose();
                })
                .catch((e) => {
                  this.$message.error(e);
                  loading.close();
                });
            });
          } else {
            this.$confirm("确定打回申请吗？", "提示", {
              type: "warning",
            }).then(() => {
              const { id, business_id: businessId } = this.curRowData;
              const loading = this.$openLoading();
              Api_AgencyMattersReject(id, {
                businessId,
                processOperate: 4,
                processRemark: this.signFormData.auditOpinion,
              })
                .then((msg) => {
                  this.$message.success(msg);
                  loading.close();
                  this.visibleSign = false;
                  this.onEdit(false);
                })
                .catch((e) => {
                  this.$message.error(e);
                  loading.close();
                });
            });
          }
        }
      });
    },
    signClose() {
      this.$refs.signForm.resetFields();
      this.visibleSign = false;
    },
  }

};
</script>

<style scoped lang="scss">
/*@import '~@/styles/element-variables.scss';*/

/deep/ {
  .el-tabs__header .el-tabs__item {
    color: #60676f;

    &.is-active {
      color: $--color-primary;
      /*color: $--color-primary;*/
    }
  }

  section {
    padding: 0px 25px 20px;
    margin-bottom: 20px;
    background-color: #fff;
    &:last-child {
      margin-bottom: 0;
    }

    .header {
      padding: 26px 0 18px;

      .fixed-width {
        width: 120px;
      }

      .title {
        padding-left: 15px;
        font-size: 16px;
        color: #333;
        font-weight: 400;
        border-left: 4px solid #3399e6;
        margin-right: 15px;
      }

      .el-button--text {
        padding: 0;
      }

      /deep/ {
        .el-tabs__header {
          margin-bottom: 0;
        }

        .el-tabs__item {
          height: auto;
          line-height: normal;
        }

        .el-tabs__nav-wrap::after {
          content: none;
        }

        .el-tabs__active-bar {
          display: none;
        }

        .el-tabs__content {
          display: none;
        }
      }
    }
  }
}
</style>
