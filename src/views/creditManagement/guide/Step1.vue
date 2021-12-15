<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户管理</span>
      </h1>
      <div>
        <el-button ref="anchorPoint" class="highlight-item">添加企业</el-button>
        <el-button>分组管理</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :inline="true" class="demo-form-inline searchForm-wrap">
        <el-form-item prop="companyName">
          <el-input placeholder="企业名称" class="filter-item" />
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <RadioText :options="groupIdsOptions" labelKey="group_name"></RadioText>
      </el-form>
      <div class="page-content-body">
        <!-- <TableWrapper ref="child" :data="tableData" :columns="tableCol" /> -->
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="企业名称"
            prop="company_name"
            class-name="canClick"
            show-overflow-tooltip
            align="left"
          ></el-table-column>
          <el-table-column label="企业分组" prop="group_name" show-overflow-tooltip align="left">
            <template slot-scope="scope">
              <div>
                <el-tag
                  v-for="(item, index) in scope.row.group_name.split(',')"
                  :key="index"
                  size="mini"
                  style="margin-right: 2px"
                >{{item}}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="信用状态" prop="credit_state" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.credit_state === "1" ? "冻结" : "正常"}}</template>
          </el-table-column>
          <el-table-column label="客户负责人" prop="userName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="80px">
            <template>
              <svg-icon slot="reference" iconClass="setting" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";

export default {
  name: "Step1",
  components: {
    RadioText
  },
  data() {
    return {
      url: "/front/creditManagement/customerProfile/customerManagement",
      text:
        "添加企业，获取企业档案信息，同时通过客户资信调查维护完善企业档案信息，档案信息的完整情况将作为信用评估结果的重要因素，作为客户风险管理的数据中心。",
      groupIdsOptions: [],
      tableData: [
        // {
        //   customer_no: "8516515",
        //   company_name: "小米科技有限责任公司",
        //   group_name: "核心客户,集团客户",
        //   credit_state: "0",
        //   userName: "user"
        // },
        {
          customer_no: "3421318",
          company_name: "中山发电厂A厂",
          group_name: "普通客户",
          credit_state: "0",
          userName: "user"
        }
      ],
      tableCol: [
        { key: "customer_no", label: "客户编码", width: 140 },
        {
          key: "company_name",
          label: "企业名称",
          align: "left",
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150
          },
          render: (h, data, row) => {
            return (
              <div class="canClick" onClick={this.goDetail.bind(this, row)}>
                {data}
              </div>
            );
          }
        },
        {
          key: "group_name",
          label: "企业分组",
          align: "left",
          render: (h, data, row) => {
            const _list = row.group_name.split(",");
            return (
              <div>
                {_list.map(item => {
                  return (
                    <el-tag size="mini" style="margin-right: 2px">
                      {item}
                    </el-tag>
                  );
                })}
              </div>
            );
          }
        },
        {
          key: "credit_state",
          label: "信用状态",
          width: 100,
          render: (h, data) => {
            return data === "1" ? "冻结" : "正常";
          }
        },
        {
          key: "userName",
          label: "客户负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip
                class="item"
                effect="dark"
                content={data || "-" + "/" + row.deptName}
                placement="top"
              >
                <span>{data || "-"}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: null,
          label: "操作",
          width: 80,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  row.editable && {
                    text: "分组编辑",
                    click: this.quickEditGroup.bind(this, row)
                  },
                  row.editable &&
                    row.is_bloc === "1" && {
                      text: "集团成员",
                      click: this.manageGroupMembers.bind(this, row)
                    },
                  row.editable &&
                    row.is_fxb !== "0" &&
                    row.isSupervise === "0" && {
                      text: "列入监测",
                      click: this.includeMonitor.bind(this, row)
                    },
                  row.editable && {
                    text: "移除企业",
                    click: this.removeBusiness.bind(this, row)
                  }
                ]}
              />
            );
          }
        }
      ]
    };
  },
  mounted() {
    this.setInfo();
  },
  methods: {
    setInfo() {
      const anchorPoint = this.$refs.anchorPoint.$el;
      const { left, top, width, height } = anchorPoint.getBoundingClientRect();
      this.$emit(
        "onInfo",
        {
          left,
          top,
          width,
          height
        },
        this.text,
        this.url
      );
    },
    getOp(row) {
      return [
        row.editable && {
          text: "分组编辑",
          click: this.quickEditGroup.bind(this, row)
        },
        row.editable &&
          row.is_bloc === "1" && {
            text: "集团成员",
            click: this.manageGroupMembers.bind(this, row)
          },
        row.editable &&
          row.is_fxb !== "0" &&
          row.isSupervise === "0" && {
            text: "列入监测",
            click: this.includeMonitor.bind(this, row)
          },
        row.editable && {
          text: "移除企业",
          click: this.removeBusiness.bind(this, row)
        }
      ].filter(i => !!i);
    }
  }
};
</script>

<style scoped>
</style>
