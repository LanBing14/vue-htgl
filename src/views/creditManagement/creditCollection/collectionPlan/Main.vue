<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>催收方案</span>
      </h1>
      <div>
        <el-button @click="handleAdd" class="btn-color-blue" icon="el-icon-plus" >新增催收方案</el-button>
        <el-button @click="handleMould" class="btn-color-orange" icon="el-icon-document-copy">催收函模板配置</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true">
        <el-form-item prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="催收类型名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="状态">
            <el-option value="1" label="启用"></el-option>
            <el-option value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <TableWrapper ref="table" :fetchDataFn="Api_CollectionPlanPage" :query="listQuery" :columns="tableCol" />
    </div>
    <CreateUpdate
      ref="createUpdateModel"
      :model-status="modelStatus"
      :select-data="selectData"
      @getList="getList"
    />
    <Detail ref="refDetail" :model-status="modelStatus" :select-data="selectData" @getList="getList" />
  </div>
</template>

<script type="text/jsx">
import CreateUpdate from "./CreateUpdate";
import Detail from "./Detail";
import {
  Api_CollectionPlanPage,
  Api_CollectionPlanDelete,
  Api_CollectionPlanDisabled,
} from "@/api/creditManagement/creditCollection/collectionPlan";

export default {
  name: "Main",
  components: {
    CreateUpdate,
    Detail,
  },
  data() {
    return {
      modelStatus: "add",
      selectData: {},
      listQuery: { name: "", status: "" },
      tableCol: [
        {
          key: "collectionCode",
          label: "催收方案编码",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <a href="javascript:;" class="a-link" onClick={this.handleDetail.bind(this, row)}>
                {data}
              </a>
            );
          },
        },
        {
          key: "collectionType",
          label: "催收类型名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
        },
        {
          key: "remark",
          label: "催收方案描述",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
        },
        {
          key: "overdueDay",
          align: "left",
          label: "逾期天数",
          width: 100,
        },
        {
          key: "modifyDate",
          label: "更新日期",
          width: 150,
          render: (h, data, row) => {
            return data ? data.split(" ")[0] : "-";
          },
        },
        {
          key: "status",
          label: "状态",
          width: 100,
          render: (h, data, row) => {
            return (
              <el-switch
                value={data}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.statusChange.bind(this, row)}
              ></el-switch>
            );
          },
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 100,
          render: (h, data, row) => {
            return  [
                    <el-link type="primary" onClick={ this.handleUpdate.bind(this, row)}> 编辑 </el-link>,
                    <el-link type="primary" onClick={ this.handleDelete.bind(this, row)}> 删除 </el-link>
            ]
          },
        },
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          const { endDate } = this.listQuery;
          if (endDate) {
            return time.getTime() > new Date(endDate).getTime();
          } else {
            return false;
          }
        },
      },
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const { startDate } = this.listQuery;
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime();
          } else {
            return false;
          }
        },
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    Api_CollectionPlanPage,
    // 获取主列表数据
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 模板配置
    handleMould() {
      this.$emit("edit", true);
    },
    // 新增
    handleAdd() {
      if (this.$isVip()) {
        this.modelStatus = "add";
        this.$refs.createUpdateModel.openModel();
      } else {
        this.$vipExpireConfirm();
      }
    },
    // 修改
    handleUpdate(row) {
      this.modelStatus = "update";
      this.selectData = row;
      this.$refs.createUpdateModel.openModel(row.id);
    },
    // 详情
    handleDetail(row) {
      this.$refs.refDetail.openModel(row.id);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除该催收方案吗？删除后不可恢复。", "提示", {
        type: "warning",
      }).then(() => {
        const loading = this.$openLoading();
        Api_CollectionPlanDelete(row.id)
          .then((res) => {
            loading.close();
            this.$message.success(res);
            this.getList();
          })
          .catch((e) => {
            loading.close();
            this.$message.success(e);
          });
      });
    },
    statusChange(row) {
      const loading = this.$openLoading();
      Api_CollectionPlanDisabled(row.status ? 0 : 1, row.id)
        .then((res) => {
          this.getList();
          loading.close();
          this.$message.success(res);
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e);
        });
    },
  },
};
</script>

<style scoped>
</style>
