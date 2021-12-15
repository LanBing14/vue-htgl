<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>客户授信申请</span>
      </h1>
      <div>
        <el-button ref="anchorPoint" class="highlight-item">新增授信申请</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :inline="true" class="demo-form-inline searchForm-wrap">
        <el-form-item prop="companyName">
          <el-input placeholder="授信对象" class="filter-item" />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input placeholder="申请人" class="filter-item" />
        </el-form-item>
        <el-form-item prop="applyState">
          <el-select value placeholder="申请状态">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="comboDate">
          <div class="block">
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <RadioText :options="groupIdsOptions" newName="快捷筛选"></RadioText>
      </el-form>
      <div class="page-content-body">
        <!-- <TableWrapper ref="child" :data="tableData" :columns="tableCol" /> -->
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="apply_no" label="申请编号" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column prop="company_name" label="授信对象" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="canClick ellipsis">
                <span v-if="scope.row.is_bloc" style="border: 1px solid;border-radius: 5px;padding: 0 5px;">集团</span>
                {{scope.row.company_name}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="credit_type" label="申请额度类型" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.credit_type === "0" ? "固定授信" : "临时授信"}}</template>
          </el-table-column>
          <el-table-column prop="credit_quota" label="申请信用额度（元）" align="right" show-overflow-tooltip>
            <template slot-scope="scope">{{$toMoney(scope.row.credit_quota)}}</template>
          </el-table-column>
          <el-table-column prop="creator_name" label="申请人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="apply_state" label="申请状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.apply_state==='1'?'待提交':
              scope.row.apply_state==='2'?'待评估':
              scope.row.apply_state==='3'?'初审中':
              scope.row.apply_state==='4'?'待审核':
              scope.row.apply_state==='5'?'已生效':
              scope.row.apply_state==='6'?'已驳回':'-'}}
            </template>
          </el-table-column>
          <el-table-column prop="apply_date" label="申请日期" show-overflow-tooltip>
            <template slot-scope="scope">{{$dateFormat(scope.row.apply_date)}}</template>
          </el-table-column>
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
  name: "Step2",
  components: {
    RadioText
  },
  data() {
    return {
      url: "/front/creditManagement/creditGranting/creditApplication",
      text:
        "新增授信申请，对客户进行信用额度、信用账期的使用进行申请，根据客户档案提供的信息通过信用评估模型进行评估，经过本企业的审核流程完成申请。",
      stateOptions: [],
      groupIdsOptions: [
        {
          label: "全部",
          id: ""
        },
        {
          label: "我负责的",
          id: "1"
        },
        {
          label: "我负责的",
          id: "2"
        }
      ],
      tableData: [
        {
          apply_no: "KH-2007-00002",
          company_name: "中山发电厂A厂",
          credit_type: "0",
          credit_quota: "10000",
          creator_name: "user",
          apply_state: "5",
          is_bloc: true,
          apply_date: 1594950652267
        }
      ],
      tableCol: [
        {
          key: "apply_no",
          label: "申请编号",
          width: 140,
          props: {
            "show-overflow-tooltip": true
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
                <div class="canClick ellipsis" onClick={this.$gotoCustomerDetail.bind(this, row.company_id)}>
                  <span style="border: 1px solid;border-radius: 5px;padding: 0 5px;">集团</span>
                  {data}
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
        {
          key: "apply_date",
          label: "申请日期",
          render: (h, data, row) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          key: null,
          label: "操作",
          width: 100,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  row.editable &&
                    (row.apply_state === "1" || row.apply_state === "6") && {
                      text: "编辑",
                      click: this.handleAdd.bind(this, row)
                    },
                  row.editable &&
                    (row.apply_state === "1" || row.apply_state === "6") && {
                      text: "删除",
                      click: this.infoDelete.bind(this, row)
                    },
                  row.editable && {
                    text: "详情",
                    click: this.handleDetail.bind(this, row)
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
    }
  }
};
</script>

<style scoped>
</style>
