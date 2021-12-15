<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>合同管理</span>
      </h1>
      <div>
        <!--                ref="anchorPoint"-->
        <el-button  class="btn-color-blue" icon="el-icon-plus" size="small">新增合同</el-button>
      </div>
    </div>
    <div class="page-content">
      <StatisticalSetting ref="ref_StatisticalSetting" :getFn="statisticsData"></StatisticalSetting>
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="contractInfo">
          <el-input placeholder="合同名称/编码" class="filter-item" />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="state">
          <el-select value placeholder="合同状态">
            <el-option :value="0" label="合同拟定"></el-option>
            <el-option :value="1" label="合同审核"></el-option>
            <el-option :value="2" label="合同签约"></el-option>
            <el-option :value="3" label="合同执行"></el-option>
            <el-option :value="4" label="履约完成"></el-option>
            <el-option :value="5" label="合同取消"></el-option>
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
        <!--                <TableWrapper-->
        <!--                    ref="child"-->
        <!--                    :data="tableData"-->
        <!--                    :columns="tableCol"-->
        <!--                />-->
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="合同编码" prop="contractCode" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column label="合同名称" prop="contractName" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="客户名称"
            prop="customerName"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="合同金额(元)" prop="contractAvailable" align="right"></el-table-column>
          <el-table-column label="回款比例" prop="rebate" align="right">
            <template slot-scope="scope">
              {{ scope.row.contractAvailable
              ? ((scope.row.rebate / scope.row.contractAvailable) * 100).toFixed(2) + "%"
              : "0.00%" }}
            </template>
          </el-table-column>
          <el-table-column label="负责人" prop="headName"></el-table-column>
          <el-table-column label="合同状态" prop="state">
            <template slot-scope="scope">{{ scope.row.state | filterState}}</template>
          </el-table-column>
          <el-table-column label="签订日期" prop="signDate">
            <template slot-scope="scope">{{ $dateFormat(scope.row.signDate, "yyyy-MM-dd") }}</template>
          </el-table-column>
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
import StatisticalSetting from "@/components/StatisticalSetting/index.vue";

export default {
  name: "Step3",
  filters: {
    filterState(data) {
      return data === "0"
        ? "合同拟定"
        : data === "1"
        ? "合同审核"
        : data === "2"
        ? "合同签约"
        : data === "3"
        ? "合同执行"
        : data === "4"
        ? "履约完成"
        : data === "5"
        ? "合同取消"
        : "合同作废";
    }
  },
  components: {
    RadioText,
    StatisticalSetting
  },
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/contractManagement/contractLedger",
      text:
        "新增合同，与客户建立销售合同，确定销售协议与内容，同时通过信用额度和账期实现信用销售，占用信用额度。",
      tableData: [
        {
          additionalUploadFileUrls: null,
          additionalUploadFiles: null,
          address: null,
          confirmType: null,
          contractAvailable: 10000,
          contractCode: "CN-2007-00012",
          contractDelId: null,
          contractName: "合同1",
          controller: true,
          createDate: "2020-07-17 09:52:42",
          creator: null,
          creatorId: "25fa1f65-0019-475b-bfab-6020399adc60",
          creditPeriod: 30,
          customerId: "94b3288e9c436141280dd5b09172b571",
          customerName: "中山发电厂A厂",
          defaultBasis: null,
          defaultMoney: null,
          defaultPercent: null,
          discount: null,
          displayable: false,
          editable: true,
          effectiveDateEnd: 1596124800000,
          effectiveDateStart: 1594915200000,
          fineMoney: null,
          headDept: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          headDeptName: "zzccss",
          headId: "25fa1f65-0019-475b-bfab-6020399adc60",
          headName: "zzccss",
          id: "7099a359-9892-4ce7-bfe5-56ae9420966e",
          modifier: null,
          modifierId: "25fa1f65-0019-475b-bfab-6020399adc60",
          modifyDate: "2020-07-21 16:25:27",
          noShipReadFlag: false,
          order: false,
          outGoodsDate: null,
          overdueDay: 0,
          overdueMoney: 0,
          payAmount: 0,
          payAmountDate: null,
          prepaid: null,
          readFlag: true,
          rebate: 0,
          remark: "A",
          saasCode: "25fa1f65-0019-475b-bfab-6020399adc60",
          saasName: null,
          send: false,
          sendFlag: false,
          signDate: 1594915200000,
          state: "3",
          surplusAmount: 0,
          sysDepartmentId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          transientChange: null,
          transientChanges: null,
          transientGoodsInfo: null,
          transientPayPlans: null,
          transientRefContract: null,
          unSend: 0,
          uploadFileUrls: null,
          uploadFiles: null,
          valid: true,
          version: 3
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
        0: { name: "本周合同数", value: 2 },
        1: { name: "上周合同金额", value: 11000 },
        2: { name: "本月合同数", value: 4 },
        3: { name: "本月合同金额", value: 31000 },
        4: { name: "上月合同数", value: 2 },
        5: { name: "上月合同金额", value: 11000 },
        6: { name: "本年合同数", value: 6 }
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
        row.editable && {
          text: "合同编辑"
        },
        row.editable && {
          text: "签约登记"
        },
        row.editable && {
          text: "合同作废"
        },
        row.editable && {
          text: "合同变更",
          click: () => {}
        }
      ].filter(i => !!i);
    }
  }
};
</script>


