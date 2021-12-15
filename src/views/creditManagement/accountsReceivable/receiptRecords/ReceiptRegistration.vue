<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ pageState==='add'?'新增收款登记':pageState==='edit'?'编辑收款登记':'-' }}</span>
      </h1>
      <div>
        <el-button type="danger" v-if="pageState!=='add'&& pageRow.state === '-1'" @click="deleteRecord(pageRow)">删除</el-button>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item  label="客户名称" prop="customerId" :rules="$createRules({msg:'客户名称',required:true})">
              <el-select
                v-model="form.customerId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键字查询客户资信档案"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width: 100%"
                @change="customerNameChange"
              >
                <el-option
                  v-for="item in clientOptions"
                  :key="item.company_id"
                  :label="item.company_name"
                  :value="item.company_id"
                ></el-option>
                <template slot="empty">
                  <div v-if="loading" style="text-align: center;padding: 28px 10px">加载中</div>
                  <div v-else style="text-align: center;padding: 28px 10px">
                    <span>查询不到相关记录，请</span>
                    <span style="color: #00BFF3;cursor: pointer" @click="noText">添加客户</span>
                  </div>
                </template>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码" prop="payPlanCode" :rules="$createRules({msg:'应收编码',required:true})">
              <el-input v-model="form.payPlanCode" placeholder="请选择应收编码" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="line-height: 37px; padding-left: 6px">
            <span class="canClick" @click="chooseReceipt">点击选择</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单名称">
              <span
                class="canClick"
                @click="$gotoOrderDetail(contractId)"
              >{{ contractCode?contractCode+'/':'-' }}{{ contractName||'' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <EnterprisePay
          ref="ref_EnterprisePay"
          :payPlanId="form.payPlanId"
          @setEndDate="setEndDate"
          @getPlanAmount="getPlanAmount"
          @getConfirmDate="getConfirmDate"
          @setEditPayAmount="setEditPayAmount"
        ></EnterprisePay>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否结清" prop="isSettle" :rules="$createRules({msg:'是否结清',required:true})">
              <el-radio-group v-model="form.isSettle" @change="changeSettle">
                <el-radio label="1">结清账款</el-radio>
                <el-radio label="0">本次不结清</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.isSettle==='1'&&form.payPlanId&&planType!=='0'">
            <el-form-item label="现金折扣" prop="moneyDiscountId">
              <el-select
                v-model="form.moneyDiscountId"
                :placeholder="discountOptions.length?'请选择现金折扣':'没有适用的现金折扣方案'"
                style="width: 100%"
                clearable
                @change="changeDiscount"
                :disabled="!discountOptions.length"
              >
                <el-option v-for="item in discountOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.isSettle==='1'&&form.payPlanId&&planType!=='0'">
            <el-form-item label="折扣率" prop="discountPer" :rules="$createRules({msg:'折扣率',required:true})">
              <el-input disabled :value="(form.discountPer?form.discountPer:0)+'%'" placeholder="请先选择现金折扣"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="实收金额"
              prop="payAmount"
              :rules="form.isSettle==='1'?$createRules({msg:'实收金额',required:true,numberFloatUp:true,validator:shouldPayAmount()}):$createRules({msg:'实收金额',required:true,numberFloatUp:true,validator:canPay()})"
            >
              <el-input v-model="form.payAmount" placeholder="请输入本次收款实收金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.isSettle==='1'&&form.payPlanId">
            <el-form-item
              label="折扣金额"
              prop="discountAmount"
              :rules="$createRules({msg:'折扣金额',numberFloatUp:true,validator:shouldDiscount()})"
            >
              <el-input v-model="form.discountAmount" placeholder="输入本次收款折扣金额" @change="changePayAmount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="收款日期" prop="payDate" :rules="$createRules({msg:'收款日期',required:true})">
              <el-date-picker
                v-model="form.payDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择收款日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="收款备注" prop="remarks" :rules="$createRules({msg:'收款备注',max:200})">
              <el-input type="textarea" :rows="4" placeholder="请输入收款备注信息" v-model="form.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="附件上传">
              <Upload v-model="uploadFileUrls" fileType="jpg,png" :limit="3" :fileSize="10"></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center" class="size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <ChooseReceipt ref="ref_ChooseReceipt" @setList="setList"></ChooseReceipt>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import ChooseReceipt from "./ChooseReceipt";
import EnterprisePay from "@/components/EnterprisePay/index.vue";
import { Api_ClientGetList } from "@/api/creditManagement/contractManagement/contract.js";
import {
  Api_paymentSave,
  Api_paymentReview,
  Api_moneyDiscountList,
  Api_getDiscountPer,
  Api_getCurrentReceivableAccounts
} from "@/api/creditManagement/accountsReceivable/receiptRecords.js";
import { Api_judgeOperateAccess } from "@/api/creditManagement/index.js";
import {Api_paymentDelete} from "@/api/creditManagement/accountsReceivable/receiptRecords.js";
export default {
  name: "ReceiptRegistration",
  components: { Upload, ChooseReceipt, EnterprisePay },
  props: {
    defaultCustomerName: String, // 默认要展示的客户名称
    defaultCustomerId: String, // 默认要展示的客户id,
    curPayPlanCode: String,
    curPayPlanId: String,
    curContractId: String,
    curContractNo: String,
    curContractName: String,
  },
  data() {
    return {
      pageState: null,
      pageRow: {},
      form: {
        id: null,
        state: null,
        customerId: null,
        customerName: null,
        payPlanCode: null,
        payPlanId: null,
        payAmount: null,
        discountAmount: 0,
        payDate: this.$dateFormat(new Date().getTime()),
        remarks: null,
        uploadFileUrls: [],
        isSettle: "1",
        moneyDiscountId: null,
        discountPer: 0,
        receivable: null,
      },
      contractCode: null,
      contractName: null,
      contractId: null,
      uploadFileUrls: [],
      clientOptions: [],
      loading: false,
      canReceiveAmount: null,
      canMAxAmoungt: null,
      uncheckMoney: null,
      discountOptions: [],
      confirmDate: null,
      savedPayAmount: null,
      planType: 1,
      registerId:'',
      isRemove:false,
      objDefault:{},
      saveData:{}
    };
  },
  mounted() {

  },
  methods: {

    // 添加客户
    noText () {
      this.$nextTick(() => {
        this.$router.push({
          name:'customerManagement'
        })
        // this.$refs.ref_addBusiness.open();
      });
    },
    setEndDate(vd,vg) {
      Api_moneyDiscountList({ endDate: vd,startDate:vg }).then((res) => {
        this.discountOptions = res;
      });
    },
    deleteRecord(row) {

      this.$confirm("确定要删除此条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {

        Api_paymentDelete(row.registerId)
          .then((res) => {
            this.$message.success(res);
            this.$emit("hideReceiptRegistration");
            this.$emit("getList");
          })
          .catch((res) => {

            this.$message.error(res);
          });
      });
    },

    /**
     * @页面加载
     */
    open(_state, _r) {


      this.objDefault = _r
      this.pageState = _state;


      if (_r){
        this.isRemove = _r.remove;
      }
      _r && (this.pageRow = _r);
      if (_state === "edit") {
        const loading = this.$openLoading();


        Api_paymentReview(_r.registerId).then((res) => {

          loading.close();

          this.form.customerName = _r.companyName;
          this.remoteMethod(_r.companyName, () => {

            this.form.customerId = _r.customerId;
            this.form.payPlanCode = _r.payPlanCode;
            this.form.payPlanId = _r.payPlanId;
            this.contractName = _r.contracteName;
            this.contractCode = _r.contractNo;
            this.contractId = _r.contractId;
            this.form.id = res.id;
            this.form.isSettle = res.isSettle;
            this.form.moneyDiscountId = res.moneyDiscountId;
            this.form.discountPer = res.discountPer;
            this.form.discountAmount = res.discountAmount;
            this.form.payDate = this.$dateFormat(res.payDate);
            this.form.remarks = res.remarks;
            this.uploadFileUrls = res.uploadFiles.map((item) => ({
              url: process.env.VUE_APP_FILE_API + item.url,
              name: item.originalName,
            }));
            this.$nextTick(() => {
              this.savedPayAmount = res.payAmount;
            });
          });
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
      }
      if (this.defaultCustomerName) {
        this.remoteMethod(this.defaultCustomerName, () => {
          this.form.customerId = this.defaultCustomerId;
          if (this.registerId){
            Api_paymentReview(this.registerId).then((res) => {
              this.form.remarks = res.remarks;
              this.uploadFileUrls = res.uploadFiles.map((item) => ({
                url: process.env.VUE_APP_FILE_API + item.url,
                name: item.originalName,
              }))
            })
            .catch((res) => {
              this.$message.error(res);
            });
          }
        });
        this.form.payPlanCode = this.curPayPlanCode;
        this.form.payPlanId = this.curPayPlanId;
        this.contractId = this.curContractId;
        this.contractCode = this.curContractNo;
        this.contractName = this.curContractName;

      }
    },
    setEditPayAmount(res) {
        console.log(res)
      this.form.payAmount = this.savedPayAmount;
      this.registerId = res ? res.id : '';
      this.saveData = res;
    },
    /**
     * @选择应收帐款编码
     */
    chooseReceipt() {
      if (!this.form.customerId) {
        this.$alert("请先填写客户！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
      } else {
        this.$refs.ref_ChooseReceipt.open(this.form.customerId, this.form.payPlanId);
      }
    },
    /**
     * @回显拿到的应收账款编码
     */
    setList(_data) {
      this.form.payPlanCode = _data[0].pay_plan_code;
      this.form.payPlanId = _data[0].pay_plan_id;
      this.contractId = _data[0].contract_id;
      this.contractName = _data[0].contract_name;
      this.contractCode = _data[0].contract_no;
      this.form.moneyDiscountId = null;
    },
    saveForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.state = -1;
          this.form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
          const loading = this.$openLoading();
          Api_paymentSave(this.form.payPlanId, this.form)
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.$emit("hideReceiptRegistration");
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
      if (
        this.form.isSettle === "1" &&
        this.canReceiveAmount !== this.$add(this.form.payAmount, this.form.discountAmount)
      ) {
        this.$alert(
          "客户当前应收账款的实收金额、折扣金额之和与应收未收金额不等，不允许提交结清账款。",
          "提示",
          { confirmButtonText: "确定", type: "warning" }
        );
        return false;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 验证
          if (this.uncheckMoney > 0 && this.form.isSettle === "1") {
            this.$alert(
              "当前应收账款存在待核销状态的收款记录，请先完成该收款记录的核销登记后再进行结清账款操作。",
              "提示",
              { confirmButtonText: "确定", type: "warning" }
            );
            return false;
          }
          // 提交
          const loading = this.$openLoading();
          Api_judgeOperateAccess(this.contractId)
            .then((res) => {
              this.form.state = 1;
              this.form.uploadFileUrls = this.uploadFileUrls.map((item) => item.url);
              Api_paymentSave(this.form.payPlanId, this.form)
                .then((res) => {
                  loading.close();
                  this.$message.success({
                    dangerouslyUseHTMLString: true,
                    message: res
                  });
                  this.$emit("hideReceiptRegistration");
                  this.$emit("getList");
                })
                .catch((res) => {
                  loading.close();
                  this.$message.error(res);
                });
            })
            .catch((res) => {
              loading.close();
              this.$alert(res, "提示", {
                confirmButtonText: "确定",
                type: "warning",
              });
            });
        }
      });
    },
    /**
     * @返回
     */
    back() {
      this.$emit("hideReceiptRegistration");
    },
    /**
     * @others
     */
    remoteMethod(query, cb) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          Api_ClientGetList({ companyName: query })
            .then((result) => {
              if(result.length > 0){
                this.clientOptions = result;
              }else {
                if (this.isRemove){
                  this.clientOptions =[{
                    company_id: this.objDefault.customerId,
                    company_name: this.objDefault.companyName
                  }]
                }else {
                  this.clientOptions = result;
                }
              }
              this.loading = false;
              this.$nextTick(() => {
                cb && cb();
              });
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e);
            });
        }, 200);
      } else {
        this.clientOptions = [];
      }
    },
    customerNameChange() {
      for (let i = 0; i < this.clientOptions.length; i++) {
        if (this.clientOptions[i].company_id === this.form.customerId) {
          this.form.customerName = this.clientOptions[i].company_name;
          break;
        }
      }
    },
    // 计划
    getPlanAmount(_amount, _disAmount, _type, vv) {
      this.form.isSettle = vv <= 0 ? "1" : "0";
      this.uncheckMoney = vv;
      this.$nextTick(() => {
        this.canReceiveAmount = _disAmount;
        this.form.receivable = _amount;
        this.canMAxAmoungt = _disAmount;
        this.planType = _type;
        this.$nextTick(() => {
            this.form.payAmount = _disAmount - vv;
            if(this.saveData && this.saveData.state === '-1'){
                this.form.isSettle = this.saveData.isSettle;
                this.form.payAmount = this.saveData.payAmount;
                this.form.discountAmount = this.saveData.discountAmount;
                this.form.payDate = this.$dateFormat(this.saveData.payDate);
                this.form.remarks = this.saveData.remarks;
            }
        });
      });
    },
    canPay() {
      return (rule, value, callback) => {
        if (
          this.canReceiveAmount &&
          this.$subtract(this.canReceiveAmount, this.uncheckMoney) <= this.form.payAmount
        ) {
          callback(new Error("当前实收金额大于等于应收未收账款金额，请选择结清账款选项。"));
        }
        callback();
      };
    },
    shouldPayAmount() {
      return (rule, value, callback) => {
        if (this.canReceiveAmount !== this.$add(this.form.payAmount, this.form.discountAmount)) {
          callback(
            new Error("客户当前应收账款的实收金额、折扣金额之和与应收未收金额不等，不允许提交结清账款。")
          );
        }
        callback();
      };
    },
    shouldDiscount() {
      return (rule, value, callback) => {
        if (this.canReceiveAmount && this.canReceiveAmount < this.form.discountAmount) {
          callback(new Error("折扣金额不应大于应收未收金额。"));
        }
        callback();
      };
    },
    changeSettle(vv) {
      if (this.uncheckMoney > 0 && vv === "1") {
        this.$alert(
          "当前应收账款存在待核销状态的收款记录，请先完成该收款记录的核销登记后再进行结清账款操作。",
          "提示",
          {
            confirmButtonText: "确定",
            type: "warning",
          }
        );
      }
    },
    changePayAmount(vv) {
      if (!isNaN(this.canReceiveAmount) && !isNaN(vv)) {
        this.form.payAmount = this.$subtract(this.canReceiveAmount, vv);
      }
    },
    getConfirmDate(vv) {
      this.confirmDate = vv;
    },
    changeDiscount(vv) {
      Api_getDiscountPer({
        planId: this.form.payPlanId,
        moneyDiscountId: vv,
        confirmDate: this.$dateFormat(this.confirmDate),
      }).then((res) => {
        this.form.discountPer = res;
        if (!isNaN(this.form.receivable) && !isNaN(res)) {
          let _dis = this.$divide(Math.round(this.$multiply(this.form.receivable, res)), 100);
          if (this.$subtract(_dis, this.canMAxAmoungt) > 0) {
            this.form.discountAmount = this.canMAxAmoungt;
          } else {
            this.form.discountAmount = _dis;
          }
          this.form.payAmount = this.$subtract(this.canReceiveAmount, this.form.discountAmount);
        }
      });
    },
  },
};
</script>

<style>
</style>
