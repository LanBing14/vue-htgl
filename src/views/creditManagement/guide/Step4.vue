<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>销售订单</span>
      </h1>
      <div>
        <el-button ref="anchorPoint" class="highlight-item">新增订单</el-button>
      </div>
    </div>
    <div class="page-content">
      <StatisticalSetting ref="ref_StatisticalSetting" :getFn="statisticsData"></StatisticalSetting>
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="contractInfo">
          <el-input placeholder="订单名称/编码" class="filter-item" />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="state">
          <el-select value placeholder="订单状态">
            <el-option value="0" label="待提交"></el-option>
            <el-option value="1" label="待审核"></el-option>
            <el-option value="2" label="待签约"></el-option>
            <el-option value="3" label="订单执行"></el-option>
            <el-option value="4" label="订单完成"></el-option>
            <el-option value="5" label="订单取消"></el-option>
          </el-select>
        </el-form-item>
        <!-- department & user BEGIN -->
        <el-form-item prop="deptName">
          <el-popover ref="popoverQuery" visible-arrow="false" placement="bottom-start" trigger="click">
            <el-tree></el-tree>
            <el-input slot="reference" type="text" readonly placeholder="所属部门"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item prop="userName">
          <el-select value placeholder="登录人员姓名"></el-select>
        </el-form-item>
        <!-- department & user END -->
        <el-form-item prop="comboDate">
          <el-date-picker
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="合同签订日期起"
            end-placeholder="合同签订日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name"></RadioText>
      <div class="page-content-body">
        <TableWrapper ref="child" :data="tableData" :columns="tableCol" />
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";
import StatisticalSetting from "@/components/StatisticalSetting/index.vue";
import {
  Api_contractOrderStatistics,
  Api_contractOrderStatisticsEdit,
  Api_contractOrderStatisticsSave
} from "@/api/creditManagement/contractManagement/orders.js";

export default {
  name: "Step4",
  components: {
    RadioText,
    StatisticalSetting
  },
  data() {
    return {
      url: "/front/creditManagement/contractManagement/orderManagement",
      text:
        "新增订单，通过与客户建立销售订单，确定具体赊销货品及金额，占用信用额度，同时自动生成待发货订单。",
      tableData: [
        {
          contractCode: "SO-2007-00024",
          contractName: "订单1",
          customerName: "中山发电厂A厂",
          contractAvailable: "10000",
          rebate: "0",
          headName: "user",
          state: "3",
          signDate: 1594915200000
        }
      ],
      tableCol: [
        {
          label: "订单编号/名称",
          key: "contractCode",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick">
                <div class="unread-tag" style="margin-right: 4px"></div>
                {data + "/" + row.contractName}
              </span>
            );
          }
        },
        {
          label: "客户名称",
          key: "customerName",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data) => {
            return <span class="canClick">{data}</span>;
          }
        },
        {
          label: "订单金额(元)",
          key: "contractAvailable",
          align: "right",
          width: "150px",
          render: (h, data) => {
            return this.$toMoney(data);
          }
        },
        {
          label: "回款比例",
          key: "rebate",
          width: "100px",
          align: "right",
          render: (h, data, row) => {
            return row.contractAvailable ? ((data / row.contractAvailable) * 100).toFixed(2) + "%" : "0.00%";
          }
        },
        {
          label: "负责人",
          key: "headName",
          width: "100px",
          render: (h, data, row) => {
            return (
              <el-tooltip
                class="item"
                effect="dark"
                content={row.headName + "/" + row.headDeptName}
                placement="top"
              >
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          label: "订单状态",
          width: "100px",
          key: "state",
          render: (h, data) => {
            return data === "0"
              ? "待提交"
              : data === "1"
              ? "待审核"
              : data === "2"
              ? "待签约"
              : data === "3"
              ? "订单执行"
              : data === "4"
              ? "订单完成"
              : data === "5"
              ? "订单取消"
              : "订单作废";
          }
        },
        {
          label: "签约日期",
          width: "100px",
          key: "signDate",
          render: (h, data) => {
            return data ? this.$dateFormat(data) : "-";
          }
        },
        {
          label: "操作",
          width: "80px",
          key: null,
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  row.editable && {
                    text: "订单详情",
                    click: this.orderDetail.bind(this, row.id)
                  },
                  row.editable &&
                    row.state === "0" && {
                      text: "订单编辑",
                      click: this.orderEdit.bind(this, row)
                    },
                  row.editable &&
                    row.state === "2" && {
                      text: "签约登记",
                      click: this.orderSign.bind(this, row)
                    },
                  row.editable &&
                    row.state === "0" && {
                      text: "订单作废",
                      click: this.orderDelete.bind(this, row)
                    },
                  row.editable &&
                    row.state === "3" && {
                      text: "订单变更",
                      click: () => {},
                      children: [
                        { text: "订单变更", click: this.orderChange_change.bind(this, row) },
                        { text: "履约完成", click: this.orderChange_promise.bind(this, row) },
                        { text: "订单取消", click: this.orderChange_cancel.bind(this, row) }
                      ]
                    },
                  row.editable &&
                    row.displayable && {
                      text: "变更记录",
                      click: this.changeRecords.bind(this, row)
                    }
                ]}
              />
            );
          }
        }
      ],
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" },
        { id: 3, name: "已到期的" },
        { id: 4, name: "到期提醒" }
      ],
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
      statisticsData: {
        0: { name: "本周订单数", value: 2 },
        1: { name: "本周订单金额", value: 11000 },
        2: { name: "上周订单数", value: 4 },
        3: { name: "上周订单金额", value: 31000 },
        4: { name: "本月订单数", value: 2 }
      }
    };
  },
  mounted() {
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

    this.$refs.ref_StatisticalSetting.getData();
  },
  methods: {
    Api_contractOrderStatistics,
    Api_contractOrderStatisticsEdit,
    Api_contractOrderStatisticsSave
  }
};
</script>

<style scoped>
</style>
