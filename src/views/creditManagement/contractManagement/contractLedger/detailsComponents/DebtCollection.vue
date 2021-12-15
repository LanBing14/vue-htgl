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
import { Api_collectionDetailList } from "@/api/creditManagement/contractManagement/orders.js";
import ImgView from "@/components/ImgView"
export default {
  name: "DebtCollection",
  props: { id: { type: String, default: "" } },
  data() {
    return {
      srcList: [],
      loading: false,
      tableData: [],
      tableCol: [
        { label: "催收编码", key: "collectionCode" },
        {
          label: "催收日期",
          key: "registerDate",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          label: "催收类型",
          key: "collectionType",
          render: (h, data, row) => {
            return data;
          },
        },
        {
          label: "还款意愿",
          key: "returnDesire",
          render: (h, data, row) => {
            return data === "0" ? "积极" : data === "1" ? "消极" : data === "2" ? "不清楚" : "-";
          },
        },
        { label: "催收描述", key: "remark" },
        {
          label: "催收附件",
          key: "type",
          render: (h, data, row) => {
            return data === "0" ? (
              // <span class="canClick" onClick={this.checkFiles.bind(this, row.overdueFile)}>
              //   点击查看
              // </span>
               <ImgView urls={row.overdueFile}></ImgView>
            ) : data === "1" ? (
              // <span class="canClick" onClick={this.checkFiles.bind(this, row.warningFile)}>
              //   点击查看
              // </span>
              <ImgView urls={ row.warningFile}></ImgView>
            ) : (
              "-"
            );
          },
        },
        { label: "催收负责人", key: "username" },
        {
          label: "催收状态",
          key: "processStatus",
          render: (h, data, row) => {
            return data === "0" ? "待处理" : data === "1" ? "已处理" : "";
          },
        },
      ],
    };
  },
  components: {ImgView},
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
      Api_collectionDetailList({ id: _v }).then((res) => {
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
