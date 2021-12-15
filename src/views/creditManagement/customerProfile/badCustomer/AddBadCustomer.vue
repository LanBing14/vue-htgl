<template>
  <div>
    <Dialog
      ref="drawer"
      title="列入不良客户"
      :visible.sync="visible"
      :onOk="handleSure"
      width="500px"
      :close="closeDialog"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <div style="display: flex">
          <div style="flex: 1">
            <el-form-item label="客户名称" prop="customerId" :rules="$createRules({msg:'客户名称',required:true})">
              <el-select
                v-model="form.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键字查询"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="customerNameChange"
                style="width: 100%"
              >
                <el-option
                  v-for="item in clientOptions"
                  :key="item.customer_id"
                  :label="item.company_name"
                  :value="item.customer_id"
                ></el-option>
                <!-- quick Add Customer -->
                <template slot="empty">
                  <div v-if="loading" style="text-align: center;padding: 28px 10px">加载中</div>
                  <div v-else style="text-align: center; padding: 20px 10px">
                    <span>查询不到相关客户，请</span>
                    <span class="canClick" @click="quickAddCustomer">添加客户</span>
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </div>
          <div style="flex: 0 70px; text-align: right; line-height: 30px">
            <span class="canClick" style="margin-right: 6px" @click="clientProfileDetail">客户档案</span>
          </div>
        </div>
        <el-form-item label="申请理由" prop="remark" :rules="$createRules({msg:'申请理由',required:true,max:200})">
          <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入客户不良信息描述信息及申请理由"></el-input>
        </el-form-item>
        <el-form-item label="列入原因" prop="btl" :rules="$createRules({msg:'列入原因',required:true})">
          <el-select v-model="form.btl" multiple placeholder="请选择列入原因" style="width: 100%">
            <el-option
              v-for="(item, index) in badTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限制措施" prop="isWork" style="margin-bottom: 0">
          <el-checkbox v-model="form.isWork" style="display: block">停止签约</el-checkbox>
        </el-form-item>
        <el-form-item prop="isCredit" style="margin-bottom: 0">
          <el-checkbox v-model="form.isCredit" style="display: block">停止赊销</el-checkbox>
        </el-form-item>
        <el-form-item prop="isSend">
          <el-checkbox v-model="form.isSend" style="display: block">停止发货</el-checkbox>
        </el-form-item>
        <el-form-item label="处理详情" prop="dealRemark" :rules="$createRules({msg:'处理详情',max:200})">
          <el-input type="textarea" :rows="3" v-model="form.dealRemark" placeholder="请输入详细处理措施描述"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
    <AddBusiness ref="ref_addBusiness" @getList="getCompanyData"></AddBusiness>
  </div>
</template>

<script>
import AddBusiness from "@/views/creditManagement/customerProfile/customerManagement/AddBusiness.vue";
import { Api_ClientGetList } from "@/api/creditManagement/contractManagement/contract.js";
import { Api_AddBadCustomerNormal } from "@/api/creditManagement/customerProfile/customerPerformance.js";

export default {
  name: "AddBadCustomer",
  components: { AddBusiness },
  data() {
    return {
      visible: false,
      form: {
        companyId: null,
        customerId: null,
        customerName: null,
        remark: null,
        btl: [],
        isWork: false,
        isCredit: false,
        isSend: false,
        dealRemark: null,
      },
      badTypeLists: [],
      loading: false,
      clientOptions: [],
      badTypeOptions: [
        { label: "一年以上没有与本公司交易者", value: "0" },
        { label: "拖欠货款逾期一年且无意归还者", value: "1" },
        { label: "破产、倒闭、经营严重亏损者", value: "2" },
        { label: "有严重违反国家法律法规行为，或不正当经营者", value: "3" },
        { label: "其他有严重损坏本公司形象、业务情形者", value: "4" },
      ],
    };
  },
  methods: {
    /**
     * @st 'add' | 'edit'
     */
    open(st) {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
    },
    handleSure() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.$openLoading();
          // 整理 badTypeLists
          this.badTypeLists = [];
          for (let i = 0; i < this.form.btl.length; i++) {
            this.badTypeLists = this.badTypeLists.concat(
              this.badTypeOptions.filter((item) => item.value === this.form.btl[i])
            );
          }
          Api_AddBadCustomerNormal({
            customerId: this.form.customerId,
            companyId: this.form.companyId,
            customerName: this.form.customerName,
            remark: this.form.remark,
            badTypeLists: this.badTypeLists.map((item) => ({
              badType: item.label,
              badTypeCode: item.value,
            })),
            isWork: this.form.isWork,
            isCredit: this.form.isCredit,
            isSend: this.form.isSend,
            dealRemark: this.form.dealRemark,
          })
            .then((res) => {
              this.$message.success({
                dangerouslyUseHTMLString: true,
                message: res,
              });
              loading.close();
              this.visible = false;
              this.$emit("getList");
            })
            .catch((res) => {
              this.$message.error(res);
              loading.close();
            });
        }
      });
    },
    closeDialog() {
      this.visible = false;
    },
    remoteMethod(query, cb) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          Api_ClientGetList({ companyName: query }).then((result) => {
            this.clientOptions = result;
            this.loading = false;
            this.$nextTick(() => {
              cb && cb();
            });
          });
        }, 200);
      } else {
        this.clientOptions = [];
      }
    },
    customerNameChange(cb) {
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (this.clientOptions[i].customer_id === this.form.customerId) {
          this.form.customerName = this.clientOptions[i].company_name;
          this.form.companyId = this.clientOptions[i].company_id;
          break;
        }
      }
      if (typeof cb === "function") {
        cb && cb();
      }
    },
    quickAddCustomer() {
      this.$nextTick(() => {
        this.$refs.ref_addBusiness.open();
      });
    },
    getCompanyData(companyData) {
      this.form.customerName = companyData.companyName;
      this.remoteMethod(companyData.companyName, () => {
        this.form.customerId = companyData.id;
        this.form.companyId = companyData.companyId;
      });
    },
    clientProfileDetail() {
      if (this.form.companyId) {
        this.$gotoCustomerDetail(this.form.companyId);
      } else {
        this.$alert("请先填写客户！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style>
</style>