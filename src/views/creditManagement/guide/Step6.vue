<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>发货跟踪</span>
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
        <el-form-item prop="state">
          <el-select value placeholder="发货状态">
            <el-option :value="0" label="=待提交"></el-option>
            <el-option :value="1" label="待签收"></el-option>
            <el-option :value="2" label="已签收"></el-option>
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
            start-placeholder="订单签订日期起"
            end-placeholder="订单签订日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="page-content-body">
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="发货编码" prop="ship_code" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单名称" prop="contract_name" class-name="canClick" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="客户名称"
            prop="company_name"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="负责人/部门" prop="headUser"></el-table-column>
          <el-table-column label="发货日期" prop="delivery_time">
            <template slot-scope="scope">{{ $dateFormat(scope.row.delivery_time, "yyyy-MM-dd") }}</template>
          </el-table-column>
          <el-table-column label="当前状态" prop="state">
            <template slot-scope="scope">
              {{scope.row.state === "0"
              ? "待出库"
              : scope.row.state === "1"
              ? "待签收"
              : scope.row.state === "2"
              ? "已签收"
              : scope.row.state === "3"
              ? "签收异常"
              : "-"}}
            </template>
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
export default {
  name: "Step6",
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/shippingManagement/shippingTracking",
      text:
        "到货登记，登记客户签收后的到货信息反馈，确认发客户实际收到的货品种类、数量信息及收货时间，确保客户实际收货。",
      tableData: [
        {
          arrival_id: "56db774a-218b-4753-b86b-bec7ebcff161",
          company_id: "94b3288e9c436141280dd5b09172b571",
          company_name: "中山发电厂A厂",
          contract_id: "0f694d63-6432-40c3-9861-2aa805b6dd66",
          contract_name: "订单1",
          contract_no: "SO-2007-00024",
          create_date: 1595313973319,
          creator_id: "25fa1f65-0019-475b-bfab-6020399adc60",
          delivery_time: 1595260800000,
          editable: true,
          headDept: "zzccss",
          headUser: "zzccss",
          id: "9bd46b80-39b2-4d45-9495-873d529bea76",
          modify_date: 1595316346396,
          ship_code: "DGAC-2007-00006",
          ship_money: "",
          state: "3"
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
          text: "发货详情"
        },
        row.editable && {
          text: "到货登记"
        }
      ].filter(i => !!i);
    }
  }
};
</script>


