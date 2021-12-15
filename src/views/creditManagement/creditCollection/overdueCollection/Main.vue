<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>逾期催收</span>
      </h1>
    </div>
    <div class="page-content">
      <el-form ref="searchForm" :model="listQuery" :inline="true" class="xiu-form">
        <el-form-item prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="合作方企业名称"
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
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="处理状态">
            <el-option v-for="item in statusOptions" :key="item.id" :value="item.id" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userId">
          <el-select v-model="listQuery.userId" filterable placeholder="负责人">
            <el-option v-for="item in departmentUsers" :key="item.id" :value="item.id" :label="item.name"></el-option>
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
            start-placeholder="创建日期起"
            end-placeholder="创建日期止"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="btns">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
      <RadioText :options="statusOptions2" newName="快捷筛选" @change="onStatusChange"></RadioText>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_CollectionOverduePage"
        :query="listQuery"
        :columns="tableCol"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import RadioText from "@/components/RadioText";
import DeptUsers from "@/components/DeptUsers";
import {
  Api_CollectionOverduePage,
  Api_CollectionCollectionCount
} from "@/api/creditManagement/creditCollection/overdueCollection";
import { Api_DepartmentsFetchTree, Api_DepartmentUserList } from "@/api/settings/dept";

export default {
  name: "Main",
  components: {
    RadioText,
    DeptUsers
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
          props: {
            "show-overflow-tooltip": true
          },
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
          props: {
            "show-overflow-tooltip": true,
            "min-width": 150
          },
          render: (h, data, row) => {
           
            return (
              // <span class="canClick" onClick={this.handleDetail.bind(this, row)}>
              <span class="canClick" onClick={this.$gotoCustomerDetail.bind(this, row.companyId)}>
                {data}
              </span>
            );
          }
        },
        {
          key: "contractName",
          label: "订单名称",
          width: 150,
          align:'left',
          props: {
            "show-overflow-tooltip": true
          },
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
        // , {
        //     key: 'startDate',
        //     label: '确认日期'
        // }
        {
          key: "endDate",
          label: "到期日"
        },
        {
          key: "oweMoney",
          label: "逾期金额(元)",
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
        // {
        //     key: 'registerDate',
        //     label: '催收日期'
        // },
        {
          key: "dutyName",
          label: "催收负责人",
          render: (h, data, row) => {
            return (
              <el-tooltip className="item" effect="dark" content={`${data}/${row.deptName}`} placement="top">
                <span>{data}</span>
              </el-tooltip>
            );
          }
        },
        {
          key: null,
          label: "操作",
          align: "center",
          width: 100,
          render: (h, data, row) => {
              const { processStatus } = row
            return [
                <el-link type="primary" onClick={this.handleDetail.bind(this, row)}> 催收详情 </el-link>,
                !processStatus ?
                    <el-link type="primary" onClick={this.handleCheckIn.bind(this, row)}> 催收登记 </el-link> :
                    <el-link type="info" disabled> 催收登记 </el-link>,
              
                    // processStatus ?
                    // <el-link type="primary" onClick={ this.handleCreate.bind(this, row)}> 生成催收函 </el-link>,
                    //  :
                    // <el-link type="info" disabled> 生成催收函 </el-link>,
                    // (row.overdueFile &&
                    // row.overdueFile.length) ?
                    // <el-link type="primary" onClick={ this.handleDownload.bind(this, row)}> 下载催收函 </el-link>
                    //      :
                    // <el-link type="info" disabled> 下载催收函 </el-link>,
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
    Api_CollectionOverduePage,
    getCount() {
      Api_CollectionCollectionCount(0).then(res => {
        if (res) {
          this.statusOptions2[2].label = `待我处理(${res})`;
        } else {
          this.statusOptions2[2].label = `待我处理`;
        }
      });
    },
    handleDetail(row) {
      this.$emit("edit", true, 3, row);
    },
    // 逾期催收登记
    handleCheckIn(row) {
      this.$emit("edit", true, 1, row);
    },
    // 生成催收函
    handleCreate(row) {
      this.$emit("edit", true, 2, row);
    },
    // 下载催收函
    handleDownload(row) {
     
      if (row.pdfFile && row.pdfFile.length) {
         window.open(row.pdfFile[0].url);
      }
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
