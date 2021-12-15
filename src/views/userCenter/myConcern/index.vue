<template>
  <div class="user-center yu-user-center">
    <el-row class="user-center-top">
      <el-col :span="18">
        <ul class="center-tab">
          <router-link tag="li" :to="'training'" :class="{'active': $route.path.indexOf('concern')>=0 }">我的关注</router-link>
        </ul>
      </el-col>
    </el-row>
    <div class="user-center-content">
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_getMyConcernList"
        :query="listQuery"
        :columns="tableCol"
        :tableProps="{class: 'fxb-table'}"
      />
    </div>
    <AddBusiness ref="ref_AddBusiness" @getList="getList"></AddBusiness>
    <AddSuper ref="ref_AddSuper" @getList="getList"></AddSuper>
  </div>
  <!-- 
      <button-dropdown -->
              <!-- data={[ -->
                <!-- { -->
                  <!-- text: "加入客户", -->
                  <!-- click: this.addCustomer.bind(this, row), -->
                <!-- }, -->
                <!-- { -->
                  <!-- text: "列入监测", -->
                  <!-- click: this.addMonitor.bind(this, row), -->
                <!-- }, -->
                <!-- { -->
                  <!-- text: "移出关注", -->
                  <!-- click: this.removeConcern.bind(this, row), -->
                <!-- }, -->
              <!-- ]} -->
 <!-- /> -->
</template>

<script type="text/jsx">
import {
  Api_getMyConcernList,
  Api_getMyConcernCancel,
  Api_attentionCheck,
  Api_checkMonitoring,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import AddBusiness from "@/views/creditManagement/customerProfile/customerManagement/AddBusiness.vue";
import AddSuper from "./AddSuper";

export default {
  name: "Concern",
  components: { AddBusiness, AddSuper },
  data() {
    return {
      listQuery: {},
      tableCol: [
        {
          key: "companyName",
          label: "关注企业",
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCompany.bind(this, row.companyId)}>
                {data}
              </span>
            );
          },
        },
        { key: "creditCode", label: "统一社会信用代码" },
        {
          key: "attentionDate",
          label: "关注时间",
          render: (h, data) => {
            return data ? this.$dateFormat(data) : "-";
          },
        },
        {
          key: null,
          label: "操作",
          width: 300,
          render: (h, data, row) => {
            return (
              <div>
                <span class="btnClass"  onClick={this.addCustomer.bind(this, row)}>加入客户</span>
                <span class="btnClass"  onClick={this.addMonitor.bind(this, row)}>列入监测</span>
                <span class="btnClass" onClick={this.removeConcern.bind(this, row)}>移出关注</span>
              </div>           
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_getMyConcernList,
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    addCustomer(row) {
      if (this.$isVip()) {
        const loading = this.$openLoading();
        Api_attentionCheck({ companyId: row.companyId, attentionId: row.id })
          .then((res) => {
            loading.close();
            const addMsg = {
              id: row.companyId,
              name: row.companyName,
              options: res.map((item) => ({ group_name: item.groupName, id: item.groupId })),
            };
            this.$refs.ref_AddBusiness.open(addMsg, true);
          })
          .catch((res) => {
            this.$message.error(res);
            loading.close();
          });
      } else {
        this.$vipExpireConfirm();
      }
    },
    addMonitor(row) {
      if (this.$isVip()) {
        Api_checkMonitoring({ companyId: row.companyId })
          .then((res) => {
            if (res === 0) {
              const loading = this.$openLoading();
              Api_attentionCheck({ companyId: null, attentionId: row.id })
                .then((res) => {
                  loading.close();
                  const addMsg = {
                    id: row.companyId,
                    name: row.companyName,
                    options: res.map((item) => ({ group_name: item.groupName, id: item.groupId })),
                  };
                  this.$refs.ref_AddSuper.open(addMsg, true);
                })
                .catch((res) => {
                  this.$message.error(res);
                  loading.close();
                });
            }
          })
          .catch((res) => {
            this.$message.error(res);
          });
      } else {
        this.$vipExpireConfirm();
      }
    },
    removeConcern(_r) {
      this.$confirm("确定取消关注该企业吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_getMyConcernCancel(_r.id)
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
    gotoCompany(id) {
      const newpage = this.$router.resolve({
        name: "basicArchive",
        query: {
          id: id,
        },
      });
      window.open(newpage.href, "_blank");
    },
  },
};
</script>

<style scoped>
.user-center-content {
  padding-top: 20px;
}
</style>

<style lang="scss">
.yu-user-center{
  .el-table--fit{
        border-bottom: 1px solid #ebeef5; 
  }
}

.btnClass {
  margin-right: 10px;
  color:#4b9df3;
  cursor:pointer;
}

</style>