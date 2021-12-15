<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>催收预警</span>
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
          ></el-table-column>
          <el-table-column label="合同名称" prop="contractName" class-name="canClick" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <div ref="menuUl" class="highlight-item">{{ scope.row.contractName }}</div>
              </template>
              <template v-else>{{ scope.row.contractName }}</template>
            </template>
          </el-table-column>
          <el-table-column label="到期日" prop="endDate">
            <template slot-scope="scope">{{ $dateFormat(scope.row.endDate) }}</template>
          </el-table-column>
          <el-table-column label="应收未收金额(元)" prop="oweMoney" align="right">
            <template slot-scope="scope">{{ $toMoney(scope.row.oweMoney) }}</template>
          </el-table-column>
          <el-table-column label="催收类型" prop="collectionType" align="right"></el-table-column>
          <el-table-column label="处理状态" prop="processStatus">
            <template slot-scope="scope">{{ scope.row.processStatus ? "已处理" : "未处理"}}</template>
          </el-table-column>
          <el-table-column label="创建日期" prop="createDate">
            <template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate.substr(0,10):'-' }}</template>
          </el-table-column>
          <el-table-column label="催收负责人" prop="dutyName"></el-table-column>
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

export default {
  name: "Step9",
  components: {
    RadioText
  },
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/creditCollection/collectionWarning",
      text:
        "催收预警，客户订单完成发货，应收账款即将到期，根据催收方案设置自动提示预警信息，帮助企业及时对应收账款进行回收操作。",
      tableData: [
        {
          collectionCode: "CSYJ-2007-00112",
          collectionPerson: null,
          collectionType: "31",
          companyId: "dc015c9824aef724553f5455944178a9",
          companyName: "z清徐县徐沟镇粮油加工厂",
          contractCode: "SO-2007-00001",
          contractId: "e258b325-d275-4cdb-a527-d6211cac655e",
          contractName: "合同1",
          createDate: "2020-07-21 18:52:52",
          creator: null,
          creatorId: "25fa1f65-0019-475b-bfab-6020399adc60",
          customerId: null,
          deptId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          deptName: "zzccss",
          dutyId: "25fa1f65-0019-475b-bfab-6020399adc60",
          dutyName: "zzccss",
          editable: true,
          endDate: "2020-08-18",
          id: "c5abc54b-b9fb-4cb0-b324-4001a34c7c3e",
          modifier: null,
          modifierId: null,
          modifyDate: "2020-07-21 18:52:52",
          orders: true,
          overdueFile: [],
          oweMoney: 50,
          processStatus: false,
          programmeId: "353e1fa0-6f32-4c94-9888-0dac940b211a",
          receivable: 0,
          receivableCode: "ARPC-2007-00001",
          receivableId: "c97abcaf-74dc-4cd4-ba47-9d3509c7b682",
          registerDate: null,
          remark: null,
          returnDesire: null,
          saasCode: "25fa1f65-0019-475b-bfab-6020399adc60",
          saasName: null,
          schemeId: null,
          startDate: "2020-07-13",
          type: "1",
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


