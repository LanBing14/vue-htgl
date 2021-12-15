<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ pageState==='add'?'延长到期日':pageState==='edit'?'延长到期日':'-' }}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span
                class="canClick"
                @click="$gotoCustomerDetail(pageRow.customerId)"
              >{{ pageRow.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="$gotoOrderDetail(pageRow.contractId)"
              >{{pageRow.contractNo}}/{{ pageRow.contractName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码">
              <span
                class="canClick"
                @click="$gotoReceivablesDetail(pageRow.payPlanId)"
              >{{ pageRow.payPlanCode }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterprisePay ref="ref_EnterprisePay" :payPlanId="pageRow.payPlanId" @setEndDate="setEndDate"></EnterprisePay>
        <el-row>
          <el-col :span="8">
            <el-form-item label="延长后到期日" prop="delayDay" :rules="$createRules({msg:'延长后到期日',required:true})">
              <el-date-picker
                v-model="form.delayDay"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="setStartDate"
                placeholder="请选择延长后到期日"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="延长说明"
              prop="remarks"
              :rules="$createRules({msg:'延长说明',required:true,max:200})"
            >
              <el-input type="textarea" :rows="4" placeholder="请输入到期日延长说明信息" v-model="form.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件上传">
              <Upload v-model="urls" fileType="jpg,png" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center" class="size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import EnterprisePay from "@/components/EnterprisePay/index.vue";
import {
  Api_PlanDelayApp,
  Api_delayReview,
} from "@/api/creditManagement/accountsReceivable/overdueManagement.js";

export default {
  name: "ExtendedExpiryDate",
  components: { Upload, EnterprisePay },
  data() {
    return {
      pageRow: {},
      pageState: null,
      form: {
        delayDay: null,
        remarks: null,
        urls: [],
        state: null,
        timeOld: null,
      },
      urls: [],
      planDelayId: "",
      setStartDate: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        },
      },
      addDelayDate: null,
    };
  },
  watch: {
    addDelayDate(_v) {
      if (_v && this.pageState === "edit") {
        this.form.delayDay = this.addDelayDate;
      }
    },
  },
  methods: {
    open(_s, _r, _res) {
      _r && (this.pageRow = _r);
      _r && (this.form.timeOld = this.$dateFormat(_r.endDate));
      // 回显
      if (_res) {
        this.pageState = "add";
        this.form.delayDay = this.$dateFormat(_res[0].delayDay);
        this.form.remarks = _res[0].remarks;
        this.planDelayId = _res[0].id;
        this.urls = _res[0].files.map((item) => ({ name: item.originalName, url: item.url }));
      } else {
        this.pageState = "edit";
        this.planDelayId = "";
      }
    },
    saveForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.state = -1;
          const loading = this.$openLoading();
          Api_PlanDelayApp(this.pageRow.payPlanId, {
            ...this.form,
            planDelayId: this.planDelayId,
            urls: this.urls.map((item) => item.url),
          })
            .then((res) => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res,
              });
              this.$emit("hideExtendedExpiryDate");
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.state = 1;
          const loading = this.$openLoading();
          Api_PlanDelayApp(this.pageRow.payPlanId, {
            ...this.form,
            planDelayId: this.planDelayId,
            urls: this.urls.map((item) => item.url),
          })
            .then((res) => {
              loading.close();
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res,
              });
              this.$emit("hideExtendedExpiryDate");
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    setEndDate(_date) {
      this.addDelayDate = _date;
    },
    back() {
      this.$emit("hideExtendedExpiryDate");
    },
  },
};
</script>

<style>
</style>
