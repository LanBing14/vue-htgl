<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>应收账款管理</span>
      </h1>
    </div>
    <div class="page-content">
      <StatisticalSetting ref="ref_StatisticalSetting" :getFn="statisticsData"></StatisticalSetting>
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="contractInfo">
          <el-input placeholder="订单名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="state">
          <el-select value placeholder="状态">
            <el-option :value="0" label="未开始"></el-option>
            <el-option :value="1" label="未完成"></el-option>
            <el-option :value="2" label="逾期未完成"></el-option>
            <el-option :value="3" label="正常完成"></el-option>
            <el-option :value="4" label="预期完成"></el-option>
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
            start-placeholder="预计付款日期起"
            end-placeholder="预计付款日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name"></RadioText>
      <div class="page-content-body">
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="应收编码" prop="payPlanCode" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单名称" prop="contractName" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="客户名称"
            prop="companyName"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <div ref="menuUl" class="highlight-item">{{ scope.row.companyName }}</div>
              </template>
              <template v-else>{{ scope.row.companyName }}</template>
            </template>
          </el-table-column>
          <el-table-column label="到期日期" prop="endDate">
            <template slot-scope="scope">{{ $dateFormat(scope.row.endDate) }}</template>
          </el-table-column>
          <el-table-column label="应收金额(元)" prop="payAmount" align="right">
            <template slot-scope="scope">{{ $toMoney(scope.row.payAmount) }}</template>
          </el-table-column>
          <el-table-column label="收款比例" prop="rebate" align="right">
            <template slot-scope="scope">
              {{ scope.row.contractAvailable
              ? ((scope.row.rebate / scope.row.contractAvailable) * 100).toFixed(2) + "%"
              : "0.00%" }}
            </template>
          </el-table-column>
          <el-table-column label="最近收款日期" prop="lastPayDate">
            <template slot-scope="scope">{{ scope.row.lastPayDate?$dateFormat(scope.row.lastPayDate):'-' }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="viewState">
            <template slot-scope="scope">{{ scope.row.viewState | filterState}}</template>
          </el-table-column>
          <el-table-column label="负责人" prop="username"></el-table-column>
          <el-table-column label="操作" width="80px">
            <template>
              <svg-icon iconClass="setting" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";
import StatisticalSetting from "@/components/StatisticalSetting/index.vue";

export default {
  name: "Step7",
  filters: {
    filterState(data) {
      return data === "0" ? "未完成" : data === "1" ? "逾期未完成" : data === "2" ? "正常完成" : "逾期完成";
    }
  },
  components: {
    RadioText,
    StatisticalSetting
  },
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/accountsReceivable/receivableManagement",
      text:
        "应收账款，客户订单完成发货，确认客户实际收货后，自动生成应收账款，明确应收账款金额及赊销有效期，在赊销有效期内完成对应收账款的收款。",
      tableData: [
        {
          amount: null,
          companyName: "中山发电厂A厂",
          contractId: "0f694d63-6432-40c3-9861-2aa805b6dd66",
          contractName: "订单1",
          contractNo: "SO-2007-00024",
          creatorId: "25fa1f65-0019-475b-bfab-6020399adc60",
          customerId: "94b3288e9c436141280dd5b09172b571",
          deptName: "zzccss",
          editable: true,
          endDate: 1597507200000,
          endDateOld: null,
          expirationDate: null,
          isRead: true,
          lastPayDate: null,
          overDueDay: null,
          overDueMoney: null,
          payAmount: 1000,
          payDate: 1594915200000,
          payDescribe: null,
          payPlanCode: "ARPC-2007-00005",
          payPlanId: "eb639858-3fba-4981-b5e5-46d4b06b0771",
          planType: "1",
          planTypeValue: "应付款",
          receivable: 0,
          sysDepartmentId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          username: "zzccss",
          viewState: "1"
        }
      ],
      tableCol: [
        {
          key: null,
          label: "操作",
          width: "80px",
          render: (h, data, row, index) => {
            const create = this.$createElement;
            return create("button-dropdown", {
              ref: "anchorPoint" + index,
              props: {
                trigger: "click",
                data: [
                  row.editable && {
                    text: "合同详情"
                  },
                  row.editable &&
                    row.state === "0" && {
                      text: "合同编辑"
                    },
                  row.editable &&
                    row.state === "2" && {
                      text: "签约登记"
                    },
                  row.editable &&
                    row.state === "0" && {
                      text: "合同作废"
                    },
                  row.editable &&
                    row.displayable && {
                      text: "合同变更",
                      click: () => {}
                    }
                ]
              }
            });
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
      statisticsData: {
        0: { name: "应收未收金额", value: 42000 },
        1: { name: "逾期金额", value: 11000 },
        2: { name: "120天+逾期金额", value: 31000 },
        3: { name: "逾期笔数", value: 4 },
        4: { name: "120天+逾期笔数", value: 2 }
      }
    };
  },
  mounted() {
    this.setInfo();
  },
  methods: {
    setInfo() {
      this.$nextTick(() => {
        this.popShow = true;
        this.$nextTick(() => {
          const anchorPoint = this.$refs.menuUl.parentNode;
          const { left, top, width, height } = anchorPoint.getBoundingClientRect();
          const border = 12;
          this.$emit(
            "onInfo",
            {
              left: left - border / 2,
              top: top - border / 2,
              width: width + border,
              height: height + border
            },
            this.text,
            this.url
          );
        });
      });
    },
    getOp(row) {
      return [
        row.editable && {
          text: "合同详情"
        },
        row.editable &&
          row.state === "0" && {
            text: "合同编辑"
          },
        row.editable &&
          row.state === "2" && {
            text: "签约登记"
          },
        row.editable &&
          row.state === "0" && {
            text: "合同作废"
          },
        row.editable &&
          row.displayable && {
            text: "合同变更",
            click: () => {}
          }
      ].filter(i => !!i);
    }
  }
};
</script>


