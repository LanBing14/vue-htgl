<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>催收预警</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true" class="xiu-form">
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="客户名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="companyName">
          <el-input
            v-model="listQuery.companyName"
            placeholder="订单名称"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item prop="deptName">
          <el-popover ref="popoverQuery" visible-arrow="false" placement="bottom-start" trigger="click">
            <el-tree :data="treeData" :render-content="renderContent" @node-click="handleNodeClickQuery"></el-tree>
            <el-input v-model="listQuery.deptName" slot="reference" type="text" readonly placeholder="所属部门"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item prop="userId">
          <el-select v-model="listQuery.userId" filterable placeholder="负责人">
            <el-option
              v-for="item in departmentUsers"
              :key="item.id"
              :label="item.name || item.username"
              :value="item.name || item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userId">
          <el-select v-model="listQuery.status" placeholder="处理状态">
            <el-option v-for="item in statusOptions" :key="item.id" :value="item.id" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="programmeId">
          <el-select v-model="listQuery.programmeId" placeholder="催收类型">
            <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :value="item.id"
              :label="item.collectionType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="预警日期起"
            end-placeholder="预警日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <RadioText :options="statusOptions2" newName="快捷筛选" @change="onStatusChange"></RadioText>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CollectionWarningPage"
        :query="listQuery"
        :columns="tableCol"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";
import {
  Api_CollectionWarningPage,
  Api_CollectionWarningType
} from "@/api/creditManagement/creditCollection/collectionWarning";
import { Api_CollectionCollectionCount } from "@/api/creditManagement/creditCollection/overdueCollection";
// department & user BEGIN
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept";
// department & user END

export default {
  name: "Main",
  components: {
    RadioText
  },
  props: {
    typeOptions: Array // 催收类型下拉数据
  },
  data() {
    return {
      treeData: [],
      departmentUsers: [],
      dateArr: [],
      listQuery: {
        deptId: "", // 部门id
        userId: "", // 负责人id
        companyName: "", // 合作方企业名称
        programmeId: "", // 催收类型id
        startDate: "", // 催收日期起
        endDate: "", // 催收日期止
        status: "",
        searchType: ""
      },
      selectData: {}, // 选中的数据
      statusOptions: [
        {
          id: "1",
          label: "待处理"
        },
        {
          id: "2",
          label: "已处理"
        }
      ],
      statusOptions2: [
        {
          // 快捷筛选
          id: "",
          label: "全部"
        },
        {
          id: "1",
          label: "我负责的"
        },
        {
          id: "2",
          label: "待我处理"
        }
      ],
      tableCol: [
        {
          key: "receivableCode",
          label: "应收编码",
          width: 150,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoReceivablesDetail.bind(this, row.receivableId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "companyName",
          label: "客户名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "contractName",
          label: "订单名称",
          align: "left",
          props: { "show-overflow-tooltip": true, "min-width": 150 },
          render: (h, data, row) => {
            const { orders } = row;
            const fn = orders
              ? this.$gotoOrderDetail.bind(this, row.contractId)
              : this.$gotoContractDetail.bind(this, row.contractId);
            return (
              <span class="canClick" onClick={fn}>
                {row.contractCode}/{data}
              </span>
            );
          }
        },
        {
          key: "endDate",
          label: "到期日"
        },
        {
          key: "oweMoney",
          label: "应收未收金额(元)",
          align: "right",
          render: (h, data) => {
            return this.$toMoney(data);
          }
        },
        {
          key: "collectionType",
          label: "催收类型",
          align: "left"
        },
        {
          key: "processStatus",
          label: "处理状态",
          render: (h, data) => {
            return data ? "已处理" : "未处理";
          }
        },
        {
          key: "createDate",
          label: "创建时间",
          render: (h, data) => {
            return data ? data.substr(0, 10) : "-";
          }
        },
        {
          key: "dutyName",
          label: "催收负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip class="item" effect="dark" content={data + "/" + row.deptName} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 170,
          render: (h, data, row) => {
            return    [
                (!row.processStatus) ?
                    <el-link type="primary" onClick={this.handleSign.bind(this, row)}> 预警登记 </el-link> :
                    <el-link type="info" disabled> 预警登记 </el-link>,
                row.editable ?
                    <el-link type="primary" onClick={ this.handleDetail.bind(this, row)}> 催收详情 </el-link> :
                    <el-link type="info" disabled> 催收详情 </el-link>,
            ]
          }
        }
      ],
      pickerOptionsStart: {
        disabledDate: time => {
          const { endDate } = this.listQuery;
          if (endDate) {
            return time.getTime() > new Date(endDate).getTime();
          } else {
            return false;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const { startDate } = this.listQuery;
          if (startDate) {
            return time.getTime() < new Date(startDate).getTime();
          } else {
            return false;
          }
        }
      }
    };
  },
  watch: {
    dateArr(date) {
      if (date) {
        this.listQuery.startDate = date[0];
        this.listQuery.endDate = date[1];
      } else {
        this.listQuery.startDate = "";
        this.listQuery.endDate = "";
      }
    }
  },
  mounted() {
    this.getList();
    this.handleNodeClickQuery({});
    // department & user BEGIN
    Api_DepartmentsFetchTree().then(res => {
      this.treeData = res;
    });
    // department & user END
    this.getCount();
  },
  methods: {
    Api_CollectionWarningPage,
    getCount() {
      Api_CollectionCollectionCount(1).then(res => {
        if (res) {
          this.statusOptions2[2].label = `待我处理(${res})`;
        } else {
          this.statusOptions2[2].label = `待我处理`;
        }
      });
    },
    // 登记
    handleSign(row) {
      // this.selectData = row;
      // this.$refs.checkIn.openModel(row);
      this.$emit("edit", true, 1, row);
    },
    // 详情
    handleDetail(row) {
      this.$emit("edit", true, 2, row);
    },
    // 获取主列表数据
    getList(flag) {
      this.$refs.table.fetchData(flag);
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList(true);
    },
    // 重置查询条件
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.dateArr = null;
      this.handleNodeClickQuery({});
    },
    // 处理状态变化
    onStatusChange(value) {
      this.listQuery.searchType = value;
      this.getList(true);
    },
    // department & user BEGIN
    renderContent(h, { node, data }) {
      let name = data.label;
      if (data.label.length > 11) {
        name = data.label.substring(0, 11) + "...";
      }
      return (
        <span class="custom-tree-node" title={data.label}>
          {" "}
          {name}{" "}
        </span>
      );
    },
    handleNodeClickQuery(item) {
      this.listQuery.deptName = item.label;
      this.listQuery.deptId = item.id;
      Api_DepartmentUserList({
        currentPage: 1,
        pageSize: 100,
        departmentIds: item.id
      }).then(res => {
        this.listQuery.userId = "";
        this.departmentUsers = res.data;
      });
    }
  }
};
</script>

<style scoped>
</style>
