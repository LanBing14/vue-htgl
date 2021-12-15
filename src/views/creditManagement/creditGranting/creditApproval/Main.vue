<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户授信审批</span>
      </h1>
      <!--            <div>-->
      <!--                <el-button @click="handleAdd" size="small">新增授信审核</el-button>-->
      <!--            </div>-->
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true" class="demo-form-inline searchForm-wrap">
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="授信对象"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            v-model="listQuery.userName"
            placeholder="申请人"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="applyState">
          <el-select v-model="listQuery.applyState" placeholder="申请状态">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="comboDate">
          <div class="block">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
        <div class="radio-text-wrap">
          <div class="radio-text-label">
            <template>快捷筛选</template>
          </div>
          <div class="radio-text-item">
            <div
              :class="{'text-blue': listQuery.searchType === ''}"
              class="radio-item"
              @click="changeOption('')"
            >全部</div>
            <div
              :class="{'text-blue': listQuery.searchType === 1}"
              class="radio-item"
              @click="changeOption(1)"
            >我负责的</div>
            <div
              :class="{'text-blue': listQuery.searchType === 2}"
              class="radio-item"
              @click="changeOption(2)"
            >
              <span>待我处理</span>
              <span v-if="count !== 0">{{ '(' + count + ')' }}</span>
            </div>
          </div>
        </div>
      </el-form>
      <div class="page-content-body">
        <TableWrapper ref="child" :fetchDataFn="Api_TrialGetList" :query="listQuery" :columns="tableCol" />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import {
  Api_TrialGetList,
  Api_ApprovalDelete,
  Api_GetCount
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "PlanTracking",
  components: { PageHead },
  data() {
    return {
      Api_TrialGetList,
      comboDate: [],
      listQuery: {
        companyName: "",
        userName: "",
        applyState: "",
        searchType: ""
      },
      stateOptions: [
        { label: "全部", value: "" },
        { label: "初审中", value: "3" },
        { label: "待审核", value: "4" },
        { label: "已生效", value: "5" },
        { label: "已驳回", value: "6" }
      ],
      tableCol: [
        {
          key: "apply_no",
          label: "申请编号",
          width: 140,
          props: {
            "show-overflow-tooltip": true
          },
          render: (h, data, row) => {
            return (
              <span
                style="cursor: pointer;color: #4b9df3"
                onClick={this.handleDetail.bind(this, row.id, row.apply_no)}
              >
                {data}
              </span>
            );
          }
        },
        {
          key: "company_name",
          label: "授信对象",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150
          },
          render: (h, data, row) => {
            if (row.is_bloc === "1") {
              return (
                <div
                  class="ellipsis"
                  style="cursor: pointer;color: #4b9df3"
                  onClick={this.$gotoCustomerDetail.bind(this, row.company_id)}
                >
                  {data}
                  <span style="border: 1px solid;border-radius: 5px;padding: 0 5px;">集团</span>
                </div>
              );
            } else {
              return (
                <div
                  class="ellipsis"
                  style="cursor: pointer;color: #4b9df3"
                  onClick={this.$gotoCustomerDetail.bind(this, row.company_id)}
                >
                  {data}
                </div>
              );
            }
          }
        },
        {
          key: "credit_type",
          label: "申请额度类型",
          render: (h, data) => {
            return data === "0" ? "固定授信" : "临时授信";
          }
        },
        {
          key: "credit_quota",
          label: "申请信用额度（元）",
          width: 180,
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          }
        },
        {
          key: "creator_name",
          label: "申请人",
          render: (h, data, row) => {
            return (
              <el-tooltip effect="dark" content={data + "/" + row.dept_name} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: "apply_state",
          label: "申请状态",
          render: (h, data) => {
            let newData = "";
            if (data === "1") {
              newData = "待提交";
            }
            if (data === "2") {
              newData = "待评估";
            }
            if (data === "3") {
              newData = "初审中";
            }
            if (data === "4") {
              newData = "待审核";
            }
            if (data === "5") {
              newData = "已生效";
            }
            if (data === "6") {
              newData = "已驳回";
            }
            return newData;
          }
        },
        { key: "apply_date", label: "申请日期" },
        {
          key: null,
          label: "操作",
          width: 100,
          render: (h, data, row) => {
              return [
                  (row.editable && row.apply_state === "3") ?
                      <el-link type="primary" onClick={this.handleAdd.bind(this, row.id, row.apply_no)}> 初审 </el-link> :
                      <el-link type="info" disabled> 初审 </el-link>,
                  (row.editable && row.apply_state === "3") ?
                      <el-link type="primary" onClick={this.handleDelete.bind(this, row)}> 驳回 </el-link> :
                      <el-link type="info" disabled> 驳回 </el-link>,
              ]
          }
        }
      ],
      count: 0
    };
  },
  // mounted() {},
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  methods: {
    // 获取主列表数据
    getList() {
      this.listQuery.beginDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      Api_GetCount({ type: true, searchType: 2 })
        .then(res => {
          if (res !== 0) {
            this.count = res;
          }
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.comboDate = [];
      this.$refs[formName].resetFields();
    },
    // 新增授信审核
    handleAdd(isAdd, applyNo) {
      this.$emit("edit", true, 1, isAdd, applyNo);
    },
    // 详情
    handleDetail(isAdd, applyNo) {
      this.$emit("edit", true, 2, isAdd, applyNo);
    },
    // 驳回
    handleDelete(row) {
      this.$confirm("确定要驳回该客户授信申请吗？请填写驳回审批意见。")
        .then(() => {
          this.$prompt("请输入驳回审批意见，不超过200字", "驳回", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /^.{1,200}$/,
            inputErrorMessage: "驳回审批意见不得超过200字"
          })
            .then(({ value }) => {
              
              let id=row.id;
              Api_ApprovalDelete(id, value)
                .then(res => {
                  this.$message.success(res);
                  this.getList();
                })
                .catch(res => {
                  this.$message.error(res);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消输入"
              });
            });
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeOption(value) {
      this.listQuery.searchType = value;
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss">
.radio-text-wrap {
  margin-bottom: 15px;
  margin-top: 6px;
  display: flex;
  color: #606266;
  align-items: center;

  .radio-text-label {
    font-weight: bold;
    line-height: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .radio-text-item {
    flex: 1;
    display: flex;
    align-items: center;

    .radio-item {
      cursor: pointer;
      line-height: 24px;
      height: 24px;
      margin-right: 10px;
      padding: 0 15px;
    }
  }
}

.text-blue {
  color: #4a9df2;
}
</style>
