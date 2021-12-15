<template>
  <div>
    <el-button size="small" style="float: right;margin-bottom: 10px" @click="handleEdit">新增</el-button>
    <TableWrapper ref="table" :fetchDataFn="Api_DiscountPlan" :columns="tableCol" />
    <Detail ref="ref_detail"></Detail>
    <Edit ref="ref_edit" @ok="getList"></Edit>
  </div>
</template>

<script type="text/jsx">
import Detail from "./discountPlanComp/Detail";
import Edit from "./discountPlanComp/Edit";
import {
  Api_DiscountPlan,
  Api_DiscountPlanOn,
  Api_GdelDiscountPlan,
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "DiscountPlan",
  components: { Detail, Edit },
  data() {
    return {
      tableCol: [
        {
          key: "code",
          label: "现金折扣编码",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "name",
          label: "方案名称",
        },
        {
          key: "simpleName",
          label: "折扣简称",
        },
        {
          key: "payDaySecond",
          label: "适用账期范围",
          render: (h, data, row) => {
            return data + "-" + row.payDayFirst;
          },
        },
        {
          key: "applyStartDate",
          label: "有效期限",
          render: (h, data, row) => {
            return (
              this.$dateFormat(data, "yyyy-MM-dd") + "至" + this.$dateFormat(row.applyEndDate, "yyyy-MM-dd")
            );
          },
        },
        {
          key: "version",
          label: "版本号",
        },
        {
          key: "state",
          label: "状态",
          render: (h, data, row) => {
            const date = new Date(new Date().toLocaleDateString());
            const end = new Date(row.applyEndDate);
            const start = new Date(row.applyStartDate);
           // const flag = date.getTime() <= end.getTime() && date.getTime() >= start.getTime();
            return (
              row.isEnd == 1?
              <el-switch
                value={data === "0"}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                disabled
              ></el-switch> :
              <el-switch
                value={data === "1"}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.statusChange.bind(this, row)}
              ></el-switch>
            );
          },
        },
        {
          key: "",
          label: "操作",
          render: (h, data, row) => {
            return [
                <el-link type="primary" onClick={this.handleEdit.bind(this, row)}> 编辑 </el-link>,
                <el-link type="primary" onClick={this.handleDel.bind(this, row)}> 删除 </el-link>
                ]
          },
        },
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_DiscountPlan,
    getList() {
      this.$refs.table.fetchData();
    },
    // 详情
    handleDetail(row) {
      this.$refs.ref_detail.open(row);
    },
    // 修改
    handleEdit(row) {
      if (this.$isVip()) {
        this.$refs.ref_edit.open(row);
      } else {
        this.$vipExpireConfirm();
      }
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定删除该现金折扣方案吗？删除后不可恢复！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_GdelDiscountPlan(row.id)
          .then((res) => {
            loading.close();
            this.$message.success(res);
            this.getList();
          })
          .catch((res) => {
            loading.close();
            this.$message.error(res);
          });
      });
    },
    // 状态
    statusChange(row) {
      Api_DiscountPlanOn({ state: row.state === "1" ? false : true }, row.id)
        .then((res) => {
          row.state = row.state === "1" ? "0" : "1";
          this.$message.success(res);
          this.getList();
        })
        .catch((res) => {
          this.$message.error(res);
        });
    },
  },
};
</script>

<style scoped>
</style>
