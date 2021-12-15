<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户对账详情</span>
      </h1>
      <div>
        <el-button @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="rowData" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称">
              <span class="canClick" @click="$gotoCustomerDetail(rowData.companyId)">{{ rowData.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="对账期间">
              {{ rowData.dateInt }}
              <span class="preview-bill" @click="previewBill">预览账单</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-divider class="detail-divider"></el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对账状态">
              {{ rowData.state==='0'
              ?'待确认'
              :rowData.state==='1'
              ?'无差异'
              :rowData.state==='2'
              ?'有差异'
              :'-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户负责人">{{ rowData.responseName? rowData.responseName:'-' }}</el-form-item>
          </el-col>
        </el-row>
        <!-- table payment BEGIN -->
        <div class="sub-title">账单确认情况</div>
        <TableWrapper
          ref="ref_CollectionDetails"
          :data="collectionDetailsData"
          :query="{}"
          :columns="tableColCollectionDetails"
        />
        <!-- table payment END -->
      </el-form>
    </div>
      <div class="demo-image__preview" style="position: fixed; top: -200px; left: -200px; z-index: 10000">
          <el-image
              ref="ref_Img"
              style="width: 100px; height: 100px"
              :src="srcList[0]"
              :preview-src-list="srcList"
          ></el-image>
      </div>
    <BillPreview ref="ref_BillPreview"></BillPreview>
  </div>
</template>

<script>
    import {
        Api_ReconciliationBill,
        Api_ReconciliationDetail,
        Api_ReconciliationDownload,
    } from "@/api/creditManagement/accountsReceivable/reconciliationManagement.js";
    import {Api_GetPictrues} from "@/api/creditManagement/contractManagement/contract.js";
    import BillPreview from "./BillPreview";

    export default {
  name: "CustomerReconciliationDetails",
  components: { BillPreview },
  data() {
    return {
      pageStatus: "",
      rowData: {},
      baseUrl: process.env.VUE_APP_FILE_API,
      collectionDetailsData: [],
      srcList: [],
      tableColCollectionDetails: [
        {
          label: "确认日期",
          key: "confirmDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "期末余额(元)",
          key: "monthEndMoney",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          },
        },
        {
          label: "对账状态",
          key: "state",
          render: (h, data, row) => {
            return data === "0" ? "待确认" : data === "1" ? "无差异" : data === "2" ? "有差异" : "-";
          },
        },
        { label: "对账描述", key: "remarks" },
        { label: "登记人", key: "creator" },
        { label: "登记时间", key: "createDate" },
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  {
                    text: "查看账单附件",
                    click: this.checkBills.bind(this, row),
                  },
                  {
                    text: "查看对账附件",
                    click: this.checkFiles.bind(this, row),
                  },
                ]}
              />
            );
          },
        },
      ],
    };
  },
  methods: {
    open(_pageStatus, _rowData) {
      this.pageStatus = _pageStatus;
      this.rowData = _rowData;
      // get detail
      const loading = this.$openLoading();
      Api_ReconciliationDetail(_rowData.id).then((res) => {
        loading.close();
        this.collectionDetailsData = res.transientApplies;
      });
    },
    closeDialog() {
      this.$emit("hideCustomerReconciliationDetails");
    },
    previewBill() {
      Api_ReconciliationDownload(this.rowData.id).then((res) => {
        window.open(this.baseUrl+res);
      });
    },
    checkFiles(_row) {
      const loading = this.$openLoading();
      Api_GetPictrues("reconciliation_confirm", _row.id)
        .then((res) => {
          loading.close();
          if (!res || !res.length) {
            this.$message.error("没有上传图片！");
            return false;
          }
          this.srcList = res.map((item) => this.baseUrl + item.url);
            this.$nextTick(() => {
                this.$refs.ref_Img.clickHandler();
            });
        })
        .catch((res) => {
          loading.close();
        });
    },
    checkBills(_row) {
      Api_ReconciliationBill(_row.id).then((res) => {
          if(res){
              this.$refs.ref_BillPreview.open(res);
          }else{
              this.$message.error("没有账单数据！");
          }

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

.preview-bill {
  color: #4a9df2;
  margin-left: 8px;
  cursor: pointer;
}
</style>
