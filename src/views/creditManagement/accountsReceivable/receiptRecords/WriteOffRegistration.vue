<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>{{ pageState==='add'?'核销登记':pageState==='edit'?'编辑核销登记':'-' }}</span>
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
          <el-col :span="12">
            <el-form-item label="订单编码/名称">
              <span
                class="canClick"
                @click="pageRow.orders?$gotoOrderDetail(pageRow.contractId):$gotoContractDetail(pageRow.contractId)"
              >{{ pageRow.contractNo||'-' }}/{{ pageRow.contractName||'-' }}</span>
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
        <EnterprisePay ref="ref_EnterprisePay" :payPlanId="pageRow.payPlanId"></EnterprisePay>
        <div class="sub-title">收款记录</div>
        <TableWrapper ref="ref_receipt" :data="receiptData" :query="{}" :columns="tableReceiptCol" />
        <el-row style="margin-top: 10px">
          <el-col :span="8">
            <el-form-item label="核销选项" prop="state" :rules="$createRules({msg:'核销选项',required:true})">
              <el-radio-group v-model="form.state">
                <el-radio label="1">确认核销</el-radio>
                <el-radio label="2">核销驳回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="核销备注" prop="remarks" :rules="$createRules({msg:'核销备注',max:200})">
              <el-input type="textarea" :rows="4" placeholder="请输入核销备注信息" v-model="form.remarks"></el-input>
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
      <div style="text-align: center"  class="size-btn-change">
        <el-button type="success" @click="saveForm">保存</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 2000">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
    <Detail ref="ref_Detail"></Detail>
  </div>
</template>

<script>
import Upload from "@/components/Upload/index.vue";
import { Api_GetPictrues } from "@/api/creditManagement/contractManagement/contract.js";
import {
  Api_queryCancellation,
  Api_cancellationSave,
  Api_cancellationSubmit,
} from "@/api/creditManagement/accountsReceivable/receiptRecords.js";
import EnterprisePay from "@/components/EnterprisePay/index.vue";
import Detail from "@/views/creditManagement/creditGranting/creditPolicy/discountPlanComp/Detail.vue";

export default {
  name: "WriteOffRegistration",
  components: { Upload, EnterprisePay, Detail },
  data() {
    return {
      pageState: null,
      pageRow: {},
      receiptData: [],
      tableReceiptCol: [
        {
          label: "收款编码",
          key: "registerCode",
          width: "140px",
        },
        {
          label: "收款日期",
          key: "payDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "收款金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data + row.discountAmount);
          },
        },
        {
          label: "是否结清",
          key: "isSettle",
          render: (h, data, row) => {
            return data === "1" ? "结清账款" : "本次不结清";
          },
        },
        {
          label: "现金折扣",
          key: "moneyDiscountName",
          render: (h, data, row) => {
            return row.isSettle === "1" && this.detailData.plan.planType === "1" ? (
              data ? (
                <span class="canClick" onClick={this.gotoDiscountDetail.bind(this, row)}>
                  {data}
                </span>
              ) : (
                "-"
              )
            ) : (
              "-"
            );
          },
        },
        {
          label: "折扣率",
          key: "discountPer",
          render: (h, data, row) => {
            return row.isSettle === "1" && this.detailData.plan.planType === "1"
              ? (data ? data : 0) + "%"
              : "-";
          },
        },
        {
          label: "实收金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "折扣金额(元)",
          key: "discountAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "收款附件",
          key: null,
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.checkPics.bind(this, row)}>
                点击查看附件
              </span>
            );
          },
        },
      ],
      form: {
        cancellationId: null,
        state: "1",
        remarks: null,
        urls: [],
      },
      detailData: [],
      urls: [],
      srcList: [],
    };
  },
  methods: {
    open(_s, _r) {
      this.pageState = _s;
      _r && (this.pageRow = _r);
      const loading = this.$openLoading();
      Api_queryCancellation(_r.registerId).then((res) => {
        loading.close();
        this.detailData = res;
        if (res.plan.transientPayRegisters.length > 0) {
          for (let i = 0; i < res.plan.transientPayRegisters.length; i++) {
            if (res.plan.transientPayRegisters[i].registerCode === this.pageRow.registerCode) {
              this.receiptData = [res.plan.transientPayRegisters[i]];
            }
          }
        } else {
          this.receiptData = [];
        }
        if (
          res.cancellations.length > 0 &&
          (res.cancellations[0].state === "-1" ||
            res.cancellations[0].state === "-2" ||
            res.cancellations[0].state === "2" ||
            res.cancellations[0].state === "0")
        ) {
          // 处理编辑时的回显
          this.form.cancellationId = res.cancellations[0].id;
          if (res.cancellations[0].state === "-1" || res.cancellations[0].state === "2") {
            this.form.state = "1";
          } else {
            this.form.state = "2";
          }
          this.form.remarks = res.cancellations[0].remarks;
          this.urls = res.cancellations[0].files.map((item) => ({
            url: item.url,
            name: item.originalName,
          }));
        }
      });
    },
    saveForm() {
      this.form.urls = this.urls.map((item) => item.url);
      const _ids = [];
      for (let i = 0; i < this.receiptData.length; i++) {
        _ids.push(this.receiptData[i].id);
      }
      const _state = this.form.state === "1" ? "-1" : "-2";
      const loading = this.$openLoading();
      Api_cancellationSave(this.pageRow.payPlanId, {
        cancellationId: this.form.cancellationId,
        state: _state,
        remarks: this.form.remarks,
        urls: this.form.urls,
        ids: [this.pageRow.registerId],
      })
        .then((res) => {
          loading.close();
          this.$message.success(res);
          this.$emit("hideWriteOffRegistration");
          this.$emit("getList");
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.urls = this.urls.map((item) => item.url);
          const _ids = [];
          for (let i = 0; i < this.receiptData.length; i++) {
            _ids.push(this.receiptData[i].id);
          }
          const _state = this.form.state === "1" ? "2" : "0";
          const loading = this.$openLoading();
          Api_cancellationSubmit(this.pageRow.payPlanId, {
            cancellationId: this.form.cancellationId,
            state: _state,
            remarks: this.form.remarks,
            urls: this.form.urls,
            ids: [this.pageRow.registerId],
          })
            .then((res) => {
              loading.close();
              this.$message.success(res);
              this.$emit("hideWriteOffRegistration");
              this.$emit("getList");
            })
            .catch((res) => {
              loading.close();
              this.$message.error(res);
            });
        }
      });
    },
    /**
     * @查看图片
     */
    checkPics(_row) {
      const loading = this.$openLoading();
      Api_GetPictrues("005006", _row.id)
        .then((res) => {
          loading.close();
          if (!res || !res.length) {
            this.$message.error("没有上传图片！");
            return false;
          }
          this.srcList = res.map((item) =>  process.env.VUE_APP_FILE_API + item.url)
          this.$nextTick(() => {
            this.$refs.ref_Img.clickHandler();
          });
        })
        .catch((res) => {
          loading.close();
        });
    },
    /**
     * @返回
     */
    back() {
      this.$emit("hideWriteOffRegistration");
    },
    gotoDiscountDetail(row) {
      this.$refs.ref_Detail.open({ id: row.moneyDiscountId });
    },
  },
};
</script>

<style>
</style>
