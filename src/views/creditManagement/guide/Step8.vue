<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发票管理</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="contractInfo">
          <el-input placeholder="订单名称" class="filter-item" />
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
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="page-content-body">
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="客户名称"
            prop="companyName"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="订单名称" prop="contractName" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额(元)" prop="contractAmount" align="right">
            <template slot-scope="scope">{{scope.row.contractAmount?$toMoney(scope.row.contractAmount):'-'}}</template>
          </el-table-column>
          <el-table-column label="代开金额(元)" prop="dkAmount" align="right">
            <template slot-scope="scope">{{scope.row.dkAmount?$toMoney(scope.row.dkAmount):'-'}}</template>
          </el-table-column>
          <el-table-column label="已开金额(元)" prop="ykAmount" align="right">
            <template slot-scope="scope">{{scope.row.ykAmount?$toMoney(scope.row.ykAmount):'-'}}</template>
          </el-table-column>
          <el-table-column label="负责人" prop="username"></el-table-column>
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
export default {
  name: "Step8",
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
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/invoiceManagement/invoiceList",
      text:
        "发票登记，客户订单完成发货，同步生成待开发票信息，提供开票申请、发票登记、发票领取、发票签收功能，确保发票及时提供客户。",
      tableData: [
        {
          address: "dc406d9f-ede5-403d-a3c5-f0e7e0f3f1cc,山西省长治市襄垣县AAAAAAAA",
          backDate: null,
          companyId: "94b3288e9c436141280dd5b09172b571",
          companyName: "中山发电厂A厂",
          confirmType: "1",
          contractAmount: 1000,
          contractDesc: "1",
          contractName: "订单1",
          contractNo: "SO-2007-00024",
          contractState: "3",
          controller: null,
          createDate: 1594963096245,
          creatorId: "25fa1f65-0019-475b-bfab-6020399adc60",
          creditPeriod: 30,
          defaultBasis: null,
          defaultMoney: "1",
          defaultPercent: null,
          deptId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          deptName: "zzccss",
          discount: 100,
          dkAmount: "1000.00",
          editable: true,
          effectiveDateEnd: 1596124800000,
          effectiveDateStart: 1594915200000,
          fineMoney: null,
          id: "0f694d63-6432-40c3-9861-2aa805b6dd66",
          invoiceId: null,
          isChange: null,
          modifierId: "25fa1f65-0019-475b-bfab-6020399adc60",
          modifyDate: 1594963176766,
          noShipReadFlag: "0",
          orders: "1",
          outGoodsDate: 1594915200000,
          prepaid: "0",
          prepaidAmount: null,
          prepaidAmountDate: null,
          readFlag: "1",
          rebate: 0,
          refContractId: "caaaf19c-f172-44c4-a2a2-ce5fc4b23f07",
          saasCode: "25fa1f65-0019-475b-bfab-6020399adc60",
          send: "1",
          sendFlag: "0",
          signingDate: 1594915200000,
          sysDepartmentId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          userId: "25fa1f65-0019-475b-bfab-6020399adc60",
          username: "zzccss",
          valid: "1",
          version: 4,
          ykAmount: "0",
          ysAmount: "1000.00"
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
          text: "开票申请"
        },
        row.editable && {
          text: "发票详情"
        }
      ].filter(i => !!i);
    }
  }
};
</script>


