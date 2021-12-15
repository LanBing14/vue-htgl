<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ isShow?title:'不良客户移出' }}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form v-show="isShow" ref="form" :model="form" label-width="80px">
        <el-form-item label="客户编码" prop="customer_no">{{form.customerNo}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="客户名称" prop="customerName">
          <span class="canClick" @click="$gotoCustomerDetail(form.companyId)">{{ form.companyName }}</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="申请理由" prop="badSituation">{{form.remark||'-'}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item
          label="列入原因"
          prop="badType"
        >{{(form.reasons?form.reasons.map(item => item.reason).join(","):'-')}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="限制措施">
          {{form?((form.isCredit ? ["停止赊销"] : [])
          .concat(form.isSend ? ["停止发货"] : [])
          .concat(form.isWork ? ["停止签约"] : [])
          .join(",")):'-'}}
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="处理详情" prop="dealRemark">{{form.dealRemark||'-'}}</el-form-item>
        <!--<el-form-item label="客户状态" prop="customerState">{{ form.status }}</el-form-item>
                <el-form-item label="申请时间" prop="applyDate">{{ $dateFormat(form.applyDate, 'yyyy-MM-dd') }}
                </el-form-item>
                <el-form-item v-show="form.approvalDate" label="列入时间" prop="approvalDate">{{
                    $dateFormat(form.approvalDate, 'yyyy-MM-dd') }}
        </el-form-item>-->
        <!--<el-form-item v-show="form.removeDate" label="移出时间" prop="approvalDate">{{ $dateFormat(form.removeDate,
                    'yyyy-MM-dd') }}
        </el-form-item>-->
      </el-form>
      <el-form v-show="!isShow" ref="form" :model="form" label-width="80px">
        <el-form-item label="客户编码">{{ form.customerNo }}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="客户名称">
          <span class="canClick" @click="$gotoCustomerDetail(form.companyId)">{{ form.companyName }}</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="移出原因">{{form.deleteRemark}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-alert style="margin-top: 15px" title="列入信息" type="info" :closable="false"></el-alert>
        <el-form-item
          label="列入原因"
          prop="badType"
        >{{(form.reasons?form.reasons.map(item => item.reason).join(","):'-')}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="限制措施">
          {{form?((form.isCredit ? ["停止赊销"] : [])
          .concat(form.isSend ? ["停止发货"] : [])
          .concat(form.isWork ? ["停止签约"] : [])
          .join(",")):'-'}}
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="处理详情" prop="dealRemark">{{form.dealRemark||'-'}}</el-form-item>
      </el-form>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Api_AgencyMattersDeal, Api_AgencyMattersReject } from "@/api/creditManagement/todo/index";
import {
  Api_GetCustomerDetailHis,
  Api_idDadCustomer,
} from "@/api/creditManagement/customerProfile/customerBad.js";

export default {
  name: "BadDetail",
  props: {
    modelStatus: Boolean,
    row: Object,
  },
  data() {
    const createRules = this.$createRules;
    return {
      title: "列入不良客户审批",
      isSign: true,
      visibleSign: false,
      isShow: false,
      signFormData: { auditOpinion: "" },
      signFormRules: {
        auditOpinion: createRules({ msg: "审核意见", required: true, max: 200 }),
      },
      id: "",
      customerNo: "",
      companyName: "",
      form: {},
      removeForm: { deleteRemark: "" },
      badTypeOptions: [
        { value: "0", label: "一年以上没有与本公司交易者" },
        { value: "1", label: "拖欠货款逾期一年且无意归还者" },
        { value: "2", label: "破产、倒闭、经营严重亏损者" },
        { value: "3", label: "有严重违反国家法律法规行为,或不正当经营者" },
        { value: "4", label: "其他有严重损坏本公司形象、业务情形者" },
        { value: "5", label: "其他" },
      ],
    };
  },
  mounted() {
    Api_idDadCustomer(this.row.proc_inst_id)
      .then((res) => {
        if (res) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].name === "badOperate" && res[i].text === "1") {
              this.title = "列入不良客户审批";
              this.isShow = true;
            } else if (res[i].name === "badOperate" && res[i].text === "2") {
              this.title = "不良客户处理办法变更审批";
              this.isShow = true;
            }
          }
        }
      })
      .catch((res) => {
        this.$message.error(res);
      });
    Api_GetCustomerDetailHis(this.row.business_key)
      .then((res) => {
        this.form = res;
        if (res.status === "0") {
          this.form.status = "不良待审";
        }
        if (res.status === "1") {
          this.form.status = "不良客户";
        }
        if (res.status === "2") {
          this.form.status = "移出待审";
        }
        if (res.status === "3") {
          this.form.status = "已移出";
        }
        if (res.status === "4") {
          this.form.status = "列入退回";
        }
      })
      .catch((res) => {
        console.log(res);
      });
  },
  methods: {
    back() {
      this.$emit("edit", false);
    },
    // handleSign(flag) {
    //     this.isSign = flag;
    //     this.visibleSign = true;
    // },
    // 签批或打回
    // signSure() {
    //     this.$refs.signForm.validate(valid => {
    //         if (valid) {
    //             if (this.isSign) {
    //                 this.$confirm("确定通过审核吗？", "提示", {
    //                     type: "warning"
    //                 }).then(() => {
    //                     const { id, business_id: businessId } = this.row;
    //                     const loading = this.$openLoading();
    //                     Api_AgencyMattersDeal(id, {
    //                         businessId,
    //                         processOperate: 2,
    //                         processRemark: this.signFormData.auditOpinion
    //                     })
    //                         .then(msg => {
    //                             this.$message.success(msg);
    //                             loading.close();
    //                             this.visibleSign = false;
    //                             this.back();
    //                         })
    //                         .catch(e => {
    //                             this.$message.error(e);
    //                             loading.close();
    //                         });
    //                 });
    //             } else {
    //                 this.$confirm("确定打回申请吗？", "提示", {
    //                     type: "warning"
    //                 }).then(() => {
    //                     const { id, business_id: businessId } = this.row;
    //                     const loading = this.$openLoading();
    //                     Api_AgencyMattersReject(id, {
    //                         businessId,
    //                         processOperate: 4,
    //                         processRemark: this.signFormData.auditOpinion
    //                     })
    //                         .then(msg => {
    //                             this.$message.success(msg);
    //                             loading.close();
    //                             this.visibleSign = false;
    //                             this.back();
    //                         })
    //                         .catch(e => {
    //                             this.$message.error(e);
    //                             loading.close();
    //                         });
    //                 });
    //             }
    //         }
    //     });
    // },
    // signClose() {
    //     this.$refs.signForm.resetFields();
    //     this.visibleSign = false;
    // }
  },
};
</script>

<style scoped>
</style>
