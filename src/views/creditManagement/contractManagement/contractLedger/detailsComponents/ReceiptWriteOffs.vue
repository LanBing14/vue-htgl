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

<script type="text/jsx">
import { Api_fingdByContractId } from "@/api/creditManagement/contractManagement/orders.js";
import ImgView from "@/components/ImgView"
export default {
  name: "ReceiptWriteOffs",
  props: { id: { type: String, default: "" } },
  data() {
    return {
      loading: false,
      tableData: [],
      srcList: [],
      tableCol: [
        {
          label: "收款编码",
          key: "registerCode",
          width: "150px",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoRecordsDetail.bind(this, row.id)}>
                {data}
              </span>
              
            );
          },
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
          key: null,
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney((row.discountAmount || 0) + (row.payAmount || 0));
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
          key: "uploadFiles",
          render: (h, data, row) => {
            // if (!data || !data.length) {
            //   return "-";
            // }
            return (
              <ImgView urls={data}></ImgView>
              // <span class="canClick" style="display:inline-block" onClick={this.checkFiles.bind(this, data)}>
              //   点击查看
              // </span>
            );
          },
        },
        { label: "收款登记人", key: "userName" },
        {
          label: "收款登记日期",
          key: "createDate",
          render: (h, data, row) => {
            return data ? data.substr(0, 10) : "-";
          },
        },
        {
          label: "核销状态",
          key: "state",
          render: (h, data, row) => {
            return data === "1" ? "待核销" : data === "2" ? "已核销" : data === "0" ? "驳回" : "-";
          },
        },
      ],
    };
  },
  compontents:{
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
      Api_fingdByContractId({ id: _v }).then((res) => {
        this.loading = false;
        this.tableData = res;
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
