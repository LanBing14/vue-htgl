<template>
  <div id="spacilH">
    <div class="page-header">
      <h1 class="page-name">
        <span>{{pageStatus==='add'?'特殊发货申请':pageStatus==='edit'?'特殊发货申请修改':'-'}}</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px" style="width:600px;margin:0 auto">
        <el-row>
          <el-col :span="20">
            <el-form-item label="客户名称" prop="companyId" :rules="$createRules({msg:'客户名称',required:true})">
              <el-select
                v-model="form.companyId"
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
                  :key="item.company_id"
                  :label="item.company_name"
                  :value="item.company_id"
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
          </el-col>
          <el-col :span="4" style="line-height: 35px">
            <span class="canClick" @click="clientProfileDetail">客户档案</span>
          </el-col>
        </el-row>
        <EnterpriseFile :enterpriseID="form.companyId"></EnterpriseFile>
        <el-row>
          <el-col :span="20">
            <el-form-item label="订单名称" prop="contractId" :rules="$createRules({msg:'订单名称',required:true})">
              <el-input v-model="form.contractName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="line-height: 35px">
            <span class="canClick" @click="chooseOrder">选择订单</span>
          </el-col>
        </el-row>
        <el-form-item label="限制措施">{{form.limitStep||'-'}}</el-form-item>
        <el-form-item label="列入原因">{{form.inclusionReason||'-'}}</el-form-item>
        <el-row>
          <el-col :span="20">
            <el-form-item label="申请理由" prop="remark">
              <el-input type="textarea" :rows="4" placeholder="请输入异常处理详细描述信息" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="附件上传" prop="urls">
              <Upload v-model="urls" fileType="jpg,png" :limit="5" :fileSize="10"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center" class="size-btn-change">
        <el-button type="success" @click="submitHandle(1)">保存</el-button>
        <el-button type="primary" @click="submitHandle(2)">提交</el-button>
      </div>
    </div>
    <AddBusiness ref="ref_addBusiness" @getList="getCompanyData"></AddBusiness>
    <ChooseOrder
      ref="ref_ChooseOrder"
      :cID="form.companyId"
      @handleContractSelected="handleContractSelected"
      @nonContract="nonContract"
    ></ChooseOrder>
  </div>
</template>

<script>
import AddBusiness from "@/views/creditManagement/customerProfile/customerManagement/AddBusiness.vue";
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import ChooseOrder from "./ChooseOrder";
import Upload from "@/components/Upload/index.vue";
import { Api_ClientGetList,Api_ClientGetListAll } from "@/api/creditManagement/contractManagement/contract.js";
import {
  Api_specialSendSubmit,
  Api_specialSendBad,
  Api_specialSendDetail,
  Api_specialSendEdit,
} from "@/api/creditManagement/shippingManagement/overstayShipment.js";

export default {
  name: "ApplicationHandle",
  components: { AddBusiness, EnterpriseFile, ChooseOrder, Upload },
  data() {
    return {
      pageStatus: null,
      clientOptions: [],
      loading: false,
      oldID: null,
      form: {
        companyId: null,
        companyName: null,
        contractId: null,
        contractName: null,
        remark: null,
        urls: [],
        state: 0,
        deptId: null,
        deptName: null,
        sendUserId: null,
        limitStep: null,
        inclusionReason: null,
      },
      xzcs: null,
      lryy: null,
      urls: [],
    };
  },
  methods: {
    /**
     * @rr row data
     * @st 'add' | 'edit'
     */
    open(rr, st) {
      this.pageStatus = st;
      if (st === "add" && rr && rr.companyId) {
        // 从发货 跳转过来的 新增
        this.form.companyName = rr.companyName;
        this.remoteMethod(rr.companyName, () => {
          this.form.companyId = rr.companyId;
          this.form.contractId = rr.contractId;
          this.form.contractName = rr.contractName;
          this.getFault();
          this.form.deptId = rr.headDeptId;
          this.form.deptName = rr.headDept;
          this.form.sendUserId = rr.sendUserId;
        });
      }
      if (st === "edit") {
        this.oldID = rr.id;
        // 回显
        const loading = this.$openLoading();
        Api_specialSendDetail(rr.id)
          .then((res) => {
            loading.close();
            this.form.companyName = res.companyName;
            this.remoteMethod(res.companyName, () => {
              this.form.companyId = res.companyId;
              this.form.contractId = res.contractId;
              this.form.contractName = res.contractName;
              this.getFault();
              this.form.deptId = res.deptId;
              this.form.deptName = res.deptName;
              this.form.sendUserId = res.sendUserId;
              this.form.remark = res.remark;
              this.urls = res.files.map((item) => ({ url: item.url, name: item.originalName }));
            });
          })
          .catch((res) => {
            loading.close();
          });
      }
    },
    back() {
      this.$emit("hideApplicationHandle");
    },
    submitHandle(tag) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.urls = this.urls.map((item) => item.url);
          this.form.state = tag;
          const loading = this.$openLoading();
          if (this.pageStatus === "edit") {
            Api_specialSendEdit(this.oldID, this.form)
              .then((res) => {
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: res,
                });
                this.$emit("hideApplicationHandle");
                this.$emit("getList");
                loading.close();
              })
              .catch((res) => {
                this.$message.error(res);
                loading.close();
              });
          } else {
            Api_specialSendSubmit(this.form)
              .then((res) => {
                this.$message.success({
                  dangerouslyUseHTMLString: true,
                  message: res,
                });
                this.$emit("hideApplicationHandle");
                this.$emit("getList");
                loading.close();
              })
              .catch((res) => {
                this.$message.error(res);
                loading.close();
              });
          }
        }
      });
    },
    remoteMethod(query, cb) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
        
          Api_ClientGetListAll({ companyName: query }).then((result) => {
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
      this.form.contractId = null;
      this.form.contractName = null;
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (this.clientOptions[i].company_id === this.form.companyId) {
          this.form.companyName = this.clientOptions[i].company_name;
          break;
        }
      }
      this.getFault();
      if (typeof cb === "function") {
        cb && cb();
      }
    },
    getFault() {
      // 获取列入原因
      Api_specialSendBad(this.form.companyId).then((res) => {
        if (!res) {
          this.$alert("该客户当前没有被采取“停止发货”措施，可正常发货。", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: (action) => {
              this.form.companyId = null;
              this.form.companyName = null;
              this.form.contractId = null;
              this.form.contractName = null;
            },
          });
          return false;
        }
        this.form.limitStep = (res.isCredit ? ["停止赊销"] : [])
          .concat(res.isSend ? ["停止发货"] : [])
          .concat(res.isWork ? ["停止签约"] : [])
          .join(",");
        this.form.inclusionReason = res.reasons.map((item) => item.reason).join(",");
      });
    },
    nonContract() {
      this.$alert("当前客户没有符合条件的待发货记录！", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback: (action) => {
          this.form.companyId = null;
          this.form.companyName = null;
          this.form.contractId = null;
          this.form.contractName = null;
        },
      });
      return false;
    },
    getCompanyData(companyData) {
      this.remoteMethod(companyData.companyName, () => {
        this.form.companyId = companyData.companyId;
      });
    },
    quickAddCustomer() {
      this.$nextTick(() => {
        this.$refs.ref_addBusiness.open();
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
    chooseOrder() {
      if (!this.form.companyId) {
        this.$message("请先选择客户！");
        return false;
      }
      this.$refs.ref_ChooseOrder.open();
    },
    handleContractSelected(item) {
      this.form.contractId = item.id;
      this.form.contractName = item.contractName;
      this.form.deptId = item.headDept;
      this.form.deptName = item.headDeptName;
      this.form.sendUserId = item.headId;
    },
  },
};
</script>

<style lang="scss">
#spacilH{
  .animation {
    display: block;
    height: initial!important;

    &::after{
      content:'';
      display:block;
      clear: both;
    }
  }
  .container{
    #changflex{
      display: block;
      padding: 0;
      .item{
        flex:initial;
        margin-left:initial;
      }
    }
  }
}
</style>
