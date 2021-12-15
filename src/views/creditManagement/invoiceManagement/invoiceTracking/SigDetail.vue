<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票签收</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-row style="padding: 0 0 0 28px;">
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="clientProfileDetail">{{ form.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="padding: 0 0 0 28px;">
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
          <el-row style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item label="申请编码">{{ form.invoiceCode }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票抬头">
                <span class="canClick" @click="openDetail">{{ form.archivesInvoiceName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="发票类型">{{ form.invoiceType === '0' ? '增值税普通发票' : '增值税专用发票' }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开票金额">{{ form.applyContractMoney }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="备注">{{ form.remark }}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider class="detail-divider"></el-divider>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="申请人">{{ form.createName }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请状态">{{ form.status | filterStatus }}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="申请时间">{{ form.createDate }}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <el-tabs type="border-card" style="margin-left: 28px;">
        <el-tab-pane label="发票登记信息">
          <TableWrapper ref="child" :data="dataList" :columns="tableCol" />
        </el-tab-pane>
        <el-tab-pane label="发票领取信息">
          <el-form ref="receiveForm" :model="receiveForm">
            <el-row>
              <el-col :span="8">
                <el-form-item label="领取状态">{{ receiveForm.isReceive === '1' ? '已领取发票' : '未领取发票' }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="领取日期">{{ $dateFormat(receiveForm.invoiceDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="发票备注">{{ receiveForm.remark }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="快递公司">{{ receiveForm.expressCompany }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="快递单号">{{ receiveForm.expressCode }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider class="detail-divider"></el-divider>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="领取人">{{ receiveForm.receiveName }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记日期">{{ $dateFormat(receiveForm.registerDate, 'yyyy-MM-dd') }}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div style="text-align: center; margin-top: 20px">
        <el-button @click="openWin" type="success">发票签收</el-button>
      </div>
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px;">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
    <Signed ref="ref_Signed" @back="back"></Signed>
    <TitleDetail ref="ref_TitleDetail"></TitleDetail>
  </div>
</template>

<script type="text/jsx">
import Signed from "./Signed";
import TitleDetail from "../invoiceList/TitleDetail";
import { Api_GetInvoiceTrackingInfo } from "@/api/creditManagement/invoice/invoiceTracking.js";

export default {
  name: "SigDetail",
  filters: {
    filterStatus(value) {
      switch (value) {
        case "0":
          return "开票申请";
        case "1":
          return "发票待开";
        case "2":
          return "待领取";
        case "3":
          return "待签收";
        case "4":
          return "已签收";
        case "5":
          return ":签收异常";
        case "6":
          return "已作废";
      }
    },
  },
  components: { Signed, TitleDetail },
  props: {
    selectData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      form: {
        companyId: "",
        companyName: "",
        contractCode: "",
        contractName: "",
        contractAmount: "",
        dkAmount: "",
        ysqAmount: "",
        ykAmount: "",
        invoiceCode: "",
        archivesInvoiceName: "",
        invoiceType: "",
        applyContractMoney: "",
        remark: "",
        createName: "",
        status: "",
        createDate: "",
      },
      dataList: [],
      tableCol: [
        {
          key: "archivesInvoiceName",
          label: "发票抬头",
        },
        {
          key: "invoiceCode",
          label: "发票号码",
        },
        {
          key: "applyContractMoney",
          label: "发票金额（元）",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "invoiceDate",
          label: "开票日期",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "registerFiles",
          label: "附件",
          render: (h, data) => {
            return (
              <span class="canClick" onClick={this.checkFiles.bind(this, data)}>
                查看附件
              </span>
            );
          },
        },
        {
          key: "registerUser",
          label: "登记人",
        },
        {
          key: "registerDate",
          label: "登记时间",
          render: (h, data) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
      ],
      srcList: [],
      receiveForm: {
        isReceive: "",
        invoiceDate: "",
        remark: "",
        expressCompany: "",
        expressCode: "",
        receiveName: "",
        registerDate: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      Api_GetInvoiceTrackingInfo(this.selectData.id, this.selectData.status)
        .then((res) => {
          this.form.contractAmount = res.ysAmount;
          this.form.dkAmount = res.dkAmount;
          this.form.ysqAmount = res.ysqAmount;
          this.form.ykAmount = res.ykAmount;
          this.form.companyId = res.invoice.companyId;
          this.form.companyName = res.invoice.companyName;
          this.form.contractCode = res.invoice.contractCode;
          this.form.contractName = res.invoice.contractName;
          this.form.invoiceCode = res.invoice.invoiceCode;
          this.form.archivesInvoiceName = res.invoice.archivesInvoiceName;
          this.form.invoiceType = res.invoice.invoiceType;
          this.form.applyContractMoney = res.invoice.applyContractMoney;
          this.form.remark = res.invoice.remark;
          this.form.createName = res.invoice.createName;
          this.form.status = res.invoice.status;
          this.form.createDate = res.invoice.createDate;
          res.register.registerFiles = res.registerFiles;
          this.dataList = [res.register];

          this.receiveForm.isReceive = res.receive.isReceive;
          this.receiveForm.invoiceDate = res.receive.invoiceDate;
          this.receiveForm.remark = res.receive.remark;
          this.receiveForm.expressCompany = res.receive.expressCompany;
          this.receiveForm.expressCode = res.receive.expressCode;
          this.receiveForm.receiveName = res.receive.receiveName;
          this.receiveForm.registerDate = res.receive.registerDate;
        })
        .catch((res) => {
          this.$message.error(res);
        });
    });
  },
  methods: {
    // 返回
    back() {
      this.$emit("edit", false);
    },
    // 打开发票签收弹窗
    openWin() {
      this.$refs.ref_Signed.open(this.selectData);
    },
    // 跳转客户档案
    clientProfileDetail() {
      this.$gotoCustomerDetail(this.selectData.companyId);
    },
    // 查看附件
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$nextTick(() => {
        this.$refs.ref_Img.clickHandler();
      });
    },
    // 订单详情
    orderDetail() {
      if (this.selectData.orders) {
        // 订单详情
        this.$gotoOrderDetail(this.selectData.contractId);
      } else {
        // 合同详情
        this.$gotoContractDetail(this.selectData.contractId);
      }
    },
    // 发票抬头详情
    openDetail() {
      this.$refs.ref_TitleDetail.open(this.selectData.archivesInvoiceId);
    },
  },
};
</script>

<style scoped>
</style>
