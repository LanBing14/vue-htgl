<template>
  <div>
    <TableWrapper v-loading="loading" ref="ref_table" :data="tableData" :query="{id:id}" :columns="tableCol" />
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

<script>
import ImgView from "@/components/ImgView"
import { Api_invoiceDetailList } from "@/api/creditManagement/contractManagement/orders.js";
export default {
  name: "InvoiceTracking",
  props: { id: { type: String, default: "" } },
  data() {
    return {
      loading: false,
      tableData: [],
      srcList: [],
      tableCol: [
        {
          label: "发票编码",
          key: "invoiceCode",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoInvoiceDetail.bind(this, row.contractId)}>
                {data}
              </span>
            );
          },
        },
        { label: "发票抬头", key: "archivesInvoiceName" },
        {
          label: "开票金额",
          key: "applyContractMoney",
          align: "right",
          render: (h, data, row) => {
            return data ? this.$toMoney(data) : "-";
          },
        },
        {
          label: "开票日期",
          key: "invoiceDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "发票状态",
          key: "status",
          render: (h, data, row) => {
            return data === "0"
              ? "开票申请"
              : data === "1"
              ? "发票待开"
              : data === "2"
              ? "待领取"
              : data === "3"
              ? "待签收"
              : data === "4"
              ? "已签收"
              : data === "5"
              ? "签收异常"
              : data === "6"
              ? "已作废"
              : "-";
          },
        },
        {
          label: "签收时间",
          key: "signDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "发票附件",
          key: "attachmentVos",
          render: (h, data, row) => {
            return (
               <ImgView urls={row.attachmentVos}></ImgView>
              // <span class="canClick" onClick={this.checkFiles.bind(this, row.attachmentVos)}>
              //   点击查看
              // </span>
            );
          },
        },
      ],
    };
  },
  components:{
    ImgView
  },
  watch: {
    id(_v) {
      if (_v) {
        this.$nextTick(() => {
          this.getData(_v);
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.id) {
        this.getData(this.id);
      }
    });
  },
  methods: {
    getData(_v) {
      this.loading = true;
      Api_invoiceDetailList({ id: _v }).then((res) => {
        this.loading = false;
        this.tableData = res;
        console.log( this.tableData,777)
      });
    },
    checkFiles(row) {
      if (!row || !row.length) {
        this.$message.error("没有上传图片！");
        return false;
      }
      this.srcList = row.map((item) => process.env.VUE_APP_FILE_API + item.url);
      this.$refs.ref_Img.clickHandler();
    },
  },
};
</script>

<style>
</style>
