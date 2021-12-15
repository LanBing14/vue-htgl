<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>账款逾期详情</span>
      </h1>
      <div>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="应收编码">{{ rowData.payPlanCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户名称">{{ rowData.companyName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同名称">{{ rowData.contractName+'/'+rowData.contractNo }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应收金额">{{ $toMoney(rowData.payAmount) }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认日期">{{ $dateFormat(rowData.payDate, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到期日">{{ $dateFormat(rowData.endDateOld, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应收未收金额">{{ $toMoney(rowData.payAmount-rowData.receivable) }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已收金额">{{ $toMoney(rowData.receivable) }} 元</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="逾期金额">{{ $toMoney(rowData.overDueMoney) }} 元</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="延长次数">{{ rowData.amount }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="累计延长天数">{{ rowData.overDueDay }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="延长后到期日">{{ $dateFormat(rowData.endDate, 'yyyy-MM-dd') }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账款状态">
              {{ rowData.viewState === "0"
              ? "打回"
              : rowData.viewState === "1"
              ? "待审核"
              : rowData.viewState === "2"
              ? "签批"
              : "" }}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- table payment BEGIN -->
        <div class="sub-title">收款明细</div>
        <TableWrapper
          ref="ref_CollectionDetails"
          :data="detailData.transientPayRegisters"
          :query="listQuery"
          :columns="tableColCollectionDetails"
        />
        <!-- table payment END -->
        <!-- table shipping BEGIN -->
        <div class="sub-title">到期日延长情况</div>
        <TableWrapper
          ref="ref_DueDate"
          :data="detailData.transientPayDelays"
          :query="listQuery"
          :columns="tableColDueDate"
        />
        <!-- table shipping END -->
      </el-form>
    </div>
    <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 2000">
      <el-image
        ref="ref_Img"
        style="width: 100px; height: 100px"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </div>
  </div>
</template>

<script>
import { Api_PlanDelayDetail } from "@/api/creditManagement/accountsReceivable/overdueManagement.js";
import { Api_GetPictrues } from "@/api/creditManagement/contractManagement/contract.js";

export default {
  name: "OverdueAccountDetails",
  data() {
    return {
      srcList: [],
      form: {
        swhijreigo: "",
        gerpjgjroe: "",
        egmprogkproe: "",
        nbspreoha: "",
        nprigerig: "",
        smpietfsae: "",
        meproyji: "",
        pehnpiehj: "",
        vnesipoht: "",
        bnesoitj: "",
        mvaerihe: "",
        vernoihear: "",
        vmzroeuh: "",
      },
      rowData: {},
      detailData: {},
      tableColCollectionDetails: [
        {
          label: "收款日期",
          key: "payDate",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          label: "收款金额(元)",
          key: "payAmount",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
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
        { label: "备注", key: "remarks" },
        { label: "收款登记人", key: "userName" },
        { label: "收款登记日期", key: "modifyDate" },
        {
          label: "核销状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "驳回" : data === "1" ? "待核销" : data === "2" ? "已核销" : "";
          },
        },
        {
          label: "操作",
          width: "200px",
          key: null,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  {
                    text: "查看收款附件",
                    click: this.checkFiles.bind(this, row),
                  },
                ]}
              />
            );
          },
        },
      ],
      tableColDueDate: [
        {
          label: "申请日期",
          key: "createDate",
          render: (h, data, row) => {
            return data.substr(0, 10);
          },
        },
        { label: "申请延长天数", key: "delayDay", align: "right" },
        {
          label: "申请时逾期金额(元)",
          key: "overDueMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        { label: "延长说明", key: "remarks" },
        {
          label: "申请状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "驳回" : data === "1" ? "待审核" : data === "2" ? "已签批" : "";
          },
        },
        {
          label: "操作",
          width: "200px",
          key: null,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  {
                    text: "查看延长附件",
                    click: this.checkFiles.bind(this, row),
                  },
                ]}
              />
            );
          },
        },
      ],
      listQuery: {},
    };
  },
  methods: {
    open(_rowData) {
      this.rowData = _rowData;
      // detail
      Api_PlanDelayDetail(_rowData.payPlanId).then((res) => {
        this.detailData = res;
      });
    },
    closeDialog() {
      this.$emit("hideOverdueAccountDetails");
    },
    checkFiles(_row) {
      const loading = this.$openLoading();
      Api_GetPictrues("005008", _row.id)
        .then((res) => {
          loading.close();
          if (!res || !res.length) {
            this.$message.error("没有上传图片！");
            return false;
          }
          this.srcList = res.map((item) => process.env.VUE_APP_FILE_API + item.url);
          this.$refs.ref_Img.clickHandler();
        })
        .catch((res) => {
          loading.close();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-plan {
  margin-bottom: 20px;
  border-top: 1px solid #dee2e6;
  border-left: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;

  .payment-plan-thead {
    display: flex;
    height: 48px;
    align-items: center;
    background-color: #eaedf4;
    border-bottom: 1px solid #dee2e6;
  }

  .payment-plan-tbody {
    display: flex;
    height: 48px;
    align-items: center;
    border-bottom: 1px solid #dee2e6;
  }

  .payment-plan-th-color {
    color: #7088a4;
    font-weight: bold;
  }

  .payment-plan-th {
    text-align: center;
    padding: 0 4px;
    // height: 48px;
    // line-height: 48px;
    // border-right: 1px solid #dee2e6;

    .plan-input {
      width: 100%;
    }
  }
}

/deep/ .payment-plan .el-input__icon {
  line-height: 30px !important;
}

.alert-title {
  border: 1px solid #ddd;
  color: #606266;
  font-weight: bold !important;
  border-radius: 0;
  margin-top: 20px;
}
</style>
