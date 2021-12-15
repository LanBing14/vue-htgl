<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>逾期催收</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="contractInfo">
          <el-input placeholder="合同名称" class="filter-item" />
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
        <el-form-item prop="state">
          <el-select value placeholder="全部">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待处理"></el-option>
            <el-option :value="2" label="已处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <el-select value placeholder="催收类型">
            <el-option :value="0" label="全部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="comboDate">
          <el-date-picker
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="预警日期起"
            end-placeholder="预警日期止"
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
          <el-table-column label="应收编码" prop="receivableCode" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="客户名称"
            prop="companyName"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
            width="150"
          ></el-table-column>
          <el-table-column label="合同名称" prop="contractName" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column label="到期日" prop="endDate">
            <template slot-scope="scope">{{ $dateFormat(scope.row.endDate) }}</template>
          </el-table-column>
          <el-table-column label="逾期金额(元)" prop="oweMoney" align="right">
            <template slot-scope="scope">{{ $toMoney(scope.row.oweMoney) }}</template>
          </el-table-column>
          <el-table-column label="催收类型" prop="collectionType" align="right"></el-table-column>
          <el-table-column label="处理状态" prop="processStatus">
            <template slot-scope="scope">{{ scope.row.processStatus ? "已处理" : "未处理"}}</template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createDate">
            <template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate.substr(0,10):'-' }}</template>
          </el-table-column>
          <el-table-column label="催收负责人" prop="dutyName"></el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <el-popover
                  placement="bottom"
                  title
                  trigger="manual"
                  v-model="popShow"
                  popper-class="popover-wrap"
                >
                  <svg-icon slot="reference" iconClass="setting" />
                  <ul ref="menuUl" class="highlight-item">
                    <li
                      v-for="(el,index) in getOp(scope.row)"
                      :key="index"
                      class="el-dropdown-menu__item"
                    >{{ el.text }}</li>
                  </ul>
                </el-popover>
              </template>
              <template v-else>
                <svg-icon slot="reference" iconClass="setting" />
              </template>
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
  name: "Step10",
  filters: {
    filterState(data) {
      return data === "0" ? "已处理" : "未处理";
    }
  },
  components: {
    RadioText
  },
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/creditCollection/overdueCollection",
      text:
        "逾期催收，客户未按订单及授信账期内完成付款，自动加入逾期催收，将对客户信用进行收紧，冻结授信并停止赊销，同时开展对历史账款的信用催收作业。",
      tableData: [
        {
          collectionCode: "CSYQ-2007-00162",
          collectionPerson: null,
          collectionType: "4",
          companyId: "4e5dc64a802be04bdd588234363f79da",
          companyName: "上海欧乐-B有限公司",
          contractCode: "SO-2007-00038",
          contractId: "058951ac-7e80-41f0-bce7-019b24b3231c",
          contractName: "DD103",
          createDate: "2020-07-21 18:52:41",
          creator: null,
          creatorId: "25fa1f65-0019-475b-bfab-6020399adc60",
          customerId: null,
          deptId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          deptName: "zzccss",
          dutyId: "25fa1f65-0019-475b-bfab-6020399adc60",
          dutyName: "zzccss",
          editable: true,
          endDate: "2020-07-17",
          id: "ca0b3722-1af1-4b6b-9f54-ca5a5dd31871",
          modifier: null,
          modifierId: null,
          modifyDate: "2020-07-21 18:52:41",
          orders: true,
          overdueFile: [],
          oweMoney: 14256,
          processStatus: false,
          programmeId: "499258d8-d8c5-4839-8da5-9e2421c3731b",
          receivable: 0,
          receivableCode: "ARPC-2007-00006",
          receivableId: "e4db484e-3fd8-4eb1-8e3f-f387ae73af72",
          registerDate: null,
          remark: null,
          returnDesire: null,
          saasCode: "25fa1f65-0019-475b-bfab-6020399adc60",
          saasName: null,
          schemeId: null,
          startDate: "2020-07-17",
          type: "0",
          valid: true,
          version: 0,
          warningFile: []
        }
      ],
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" }
      ]
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
          text: "逾期催收详情"
        },
        row.editable && {
          text: "生成催收函"
        }
      ].filter(i => !!i);
    }
  }
};
</script>


