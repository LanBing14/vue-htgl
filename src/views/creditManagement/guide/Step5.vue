<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>待发货订单</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :inline="true">
        <el-form-item prop="contractInfo">
          <el-input placeholder="订单名称/编码" class="filter-item" />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input placeholder="客户名称" class="filter-item" />
        </el-form-item>
        <el-form-item prop="state">
          <el-select value placeholder="待发货">
            <el-option :value="0" label="待发货"></el-option>
            <el-option :value="1" label="已发货"></el-option>
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
      <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name"></RadioText>
      <div class="page-content-body">
        <el-table :data="tableData" class="table-no-hidden">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="订单编码/名称" prop="contractNo" class-name="canClick" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.contractNo }}/{{scope.row.contractName}}</template>
          </el-table-column>
          <el-table-column
            label="客户名称"
            prop="companyName"
            align="left"
            class-name="canClick"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="负责人" prop="headName"></el-table-column>
          <el-table-column label="发货日期" prop="outGoodsDate">
            <template slot-scope="scope">{{ $dateFormat(scope.row.outGoodsDate) }}</template>
          </el-table-column>
          <el-table-column label="销售数量" prop="num" align="right"></el-table-column>
          <el-table-column label="已发数量" prop="sendNum" align="right"></el-table-column>
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
  name: "Step5",
  components: {
    RadioText
  },
  data() {
    return {
      popShow: false,
      url: "/front/creditManagement/shippingManagement/pendingOrders",
      text: "发货登记，登记发货信息，确认发货品类及数量信息，输入发货时间，确保订单按时发货。",
      tableData: [
        {
          companyId: "94b3288e9c436141280dd5b09172b571",
          companyName: "中山发电厂A厂",
          contractName: "订单1",
          contractNo: "SO-2007-00024",
          createDate: 1594963096245,
          editable: true,
          headDept: "zzccss",
          headDeptId: "fcf1d363-9a48-405a-8c3e-93163e877b13",
          headName: "zzccss",
          id: "0f694d63-6432-40c3-9861-2aa805b6dd66",
          isBad: null,
          noShipReadFlag: "0",
          num: 100,
          outGoodsDate: 1594915200000,
          send: "0",
          sendNum: 20,
          state: "3",
          userId: "25fa1f65-0019-475b-bfab-6020399adc60"
        }
      ],
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" },
        { id: 3, name: "已到期的" },
        { id: 4, name: "到期提醒" }
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
          text: "发货登记"
        },
        row.editable && {
          text: "订单详情"
        }
      ].filter(i => !!i);
    }
  }
};
</script>


