<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票详情</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="clientProfileDetail">{{ form.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称">
                <span class="canClick" @click="orderDetail">{{ form.contractCode }}/{{ form.contractName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="background-color: #f5f7fa;border: 1px solid #eaedf4;padding: 16px">
            <div
              class="title"
              style="margin-bottom: 15px;font-size: 15px;color: #333;font-weight: bold;"
            >当前合同开票情况</div>
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单金额">{{ form.contractAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待开金额">{{ form.dkAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已申请金额">{{ form.ysqAmount }}元</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="已开金额">{{ form.ykAmount }}元</el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <!-- ?? -->
      <!--<div class="sub-title">付款计划</div>
      <TableWrapper ref="child_up" :data="tableColUpList" :query="{}" :columns="tableColUp" />-->
      <!-- !! -->
      <!-- ?? -->
      <div>
        <div class="sub-title">发票开票及签收情况</div>
        <TableWrapper ref="child_down" :data="tableColDownList" :query="{}" :columns="tableColDown" />
      </div>
      <!-- !! -->
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px;">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
  </div>
</template>

<script type="text/jsx">
import { Api_GetInvoiceDetail } from "@/api/creditManagement/invoice/invoice.js";
import ImgView from "@/components/ImgView"
export default {
  name: "BillingDetails",
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  compontents:{
    ImgView
  },
  data() {
    return {
      form: {
        companyId: "",
        contractCode: "",
        contractName: "",
        companyName: "",
        contractAmount: "",
        dkAmount: "",
        ysqAmount: "",
        ykAmount: "",
      },
      // tableColUpList: [],
      tableColDownList: [],
      tableColDown: [
        { label: "申请编号", key: "applyCode" },
        { label: "发票抬头", key: "invoice" },
        // { label: "客户名称", key: "companyName" },
        { label: "发票号码", key: "invoiceCode" },
        {
          label: "开票金额",
          key: "invoiceMoney",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          label: "开票日期",
          key: "invoiceDate",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        { label: "发票状态", key: "invoiceState" },
        {
          label: "签收时间",
          key: "signDate",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        { label: "备注", key: "remark" },
        {
          label: "发票附件",
          key: "attachment",
          render: (h, data) => {
            return (
                 <ImgView urls={data}></ImgView>
              // <span class="canClick" onClick={this.checkFiles.bind(this, data)}>
              //   查看附件
              // </span>
            );
          },
        },
      ],
      srcList: [],
    };
  },
  mounted() {
    Api_GetInvoiceDetail(this.row.id)
      .then((res) => {
        this.form.companyId = res.companyId;
        this.form.contractCode = res.contractCode;
        this.form.contractName = res.contractName;
        this.form.companyName = res.companyName;
        this.form.contractAmount = this.$toMoney(res.totalMoney, 2);
        this.form.dkAmount = this.$toMoney(res.toBeOpenMoney, 2);
        this.form.ysqAmount = this.$toMoney(res.invoiceMoney, 2);
        this.form.ykAmount = this.$toMoney(res.alreadyMoney, 2);
        this.tableColDownList = res.registerForReceiptList;
      })
      .catch((res) => {
        this.$message.error(res);
      });
  },
  methods: {
    back() {
      this.$emit("showMain");
    },
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.$nextTick(() => {
        this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
        this.$nextTick(() => {
          this.$refs.ref_Img.clickHandler();
        });
      });
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.form.companyId);
    },
    // 订单详情
    orderDetail() {
      if (this.row.orders) {
        // 订单详情
        this.$gotoOrderDetail(this.row.id);
      } else {
        // 合同详情
        this.$gotoContractDetail(this.row.id);
      }
    },
  },
};
</script>

<style>
</style>
