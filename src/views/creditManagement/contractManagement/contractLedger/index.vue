<template>
  <div>
    <div v-show="!isShowCreateUpdate && !showDetail">
      <div class="page-header">
        <h1 class="page-name">
          <span>合同管理</span>
        </h1>
        <div>
          <el-button @click="handleAdd" class="btn-color-blue" icon="el-icon-plus">新增合同</el-button>
        </div>
      </div>
      <div class="page-content">
        <StatisticalSetting
          ref="ref_StatisticalSetting"
          :getFn="Api_contractOrderStatistics"
          :editFn="Api_contractOrderStatisticsEdit"
          :saveFn="Api_contractOrderStatisticsSave"
          :getQuery="{ order: false }"
        ></StatisticalSetting>
        <el-form ref="searchForm" :model="listQuery" :inline="true">
          <el-form-item prop="contractInfo">
            <el-input
              v-model="listQuery.contractInfo"
              placeholder="合同名称/编码"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="customerName">
            <el-input
              v-model="listQuery.customerName"
              placeholder="客户名称"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="listQuery.state" placeholder="合同状态">
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
            <el-popover
              ref="popoverQuery"
              visible-arrow="false"
              placement="bottom-start"
              trigger="click"
              v-model="treeShowQuery"
            >
              <el-tree
                :data="treeData"
                :render-content="renderContent"
                @node-click="handleNodeClickQuery"
              ></el-tree>
              <el-input
                slot="reference"
                type="text"
                readonly
                placeholder="所属部门"
                v-model="listQuery.deptName"
              ></el-input>
            </el-popover>
          </el-form-item>
          <el-form-item prop="userName">
            <el-select v-model="listQuery.userName" filterable placeholder="负责人">
              <el-option
                :key="item.id"
                @click.native="selectClick(item.id)"
                :value="item.name"
                v-for="item in departmentUsers"
              >{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
          <!-- department & user END -->
          <el-form-item prop="comboDate">
            <el-date-picker
              v-model="comboDate"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="合同签订日期起"
              end-placeholder="合同签订日期止"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="btns">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
            <el-button
              class="filter-item"
              icon="el-icon-refresh"
              @click="handleReset('searchForm')"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <RadioText :options="statusOptions" newName="快捷筛选" labelKey="name" @change="switchStatus"></RadioText>
        <div class="page-content-body">
          <TableWrapper
            ref="child"
            :fetchDataFn="Api_ContractGetList"
            :query="listQuery"
            :columns="tableCol"
          />
        </div>
      </div>
    </div>
    <CreateUpdate
      v-if="isShowCreateUpdate"
      ref="refCreateUpdateModel"
      :model-status="modelStatus"
      @getList="getList"
      :contract-id="contractId"
      @hideCreateUpdate="hideCreateUpdate"
    />
    <ContractDetail ref="ref_ContractDetail" v-if="showDetail" @hideDetail="hideDetail"></ContractDetail>
    <ContractRegistration ref="ref_ContractRegistration" @getList="getList"></ContractRegistration>
    <ChangeRecords
      ref="ref_ChangeRecords"
      @contractChangeChange="contractChange_change"
      @contractChangePromise="contractChange_promise"
      @contractChangeCancel="contractChange_cancel"
    ></ChangeRecords>
  </div>
</template>

<script type="text/jsx">
import PageHead from "@/components/PageHead";
import Button from "@/components/Button";
import CreateUpdate from "./CreateUpdate";
import ContractDetail from "./ContractDetail";
import ContractRegistration from "./ContractRegistration";
import StatisticalSetting from "@/components/StatisticalSetting/index.vue";
import RadioText from "@/components/RadioText";
import ChangeRecords from "./ChangeRecords";
import {
  Api_ContractGetList,
  Api_CancelContract,
  Api_ChangeContractJudge
} from "@/api/creditManagement/contractManagement/contract.js";
// department & user BEGIN
import {
  Api_DepartmentsFetchTree,
  Api_DepartmentUserList
} from "@/api/settings/dept.js";
// department & user END
import {
  Api_contractOrderStatistics,
  Api_contractOrderStatisticsEdit,
  Api_contractOrderStatisticsSave,
  Api_contractOrderCount
} from "@/api/creditManagement/contractManagement/orders.js";

export default {
  name: "ContractLedger",
  components: {
    PageHead,
    CreateUpdate,
    ContractDetail,
    ContractRegistration,
    StatisticalSetting,
    RadioText,
    ChangeRecords
  },
  props: { id: String },
  data() {
    return {
      listQuery: {
        contractInfo: "",
        customerName: "",
        state: "",
        department: "",
        startDate: "",
        endDate: "",
        // department & user BEGIN
        headDept: "",
        headId: "",
        deptName: "",
        userName: "",
        // department & user END
        fastFlag: 0
      },
      // department & user BEGIN
      treeShowQuery: false,
      treeData: [],
      departmentUsers: [],
      // department & user END
      statusOptions: [
        { id: 0, name: "全部" },
        { id: 1, name: "我负责的" },
        { id: 2, name: "待我处理" },
        { id: 3, name: "已到期的" },
        { id: 4, name: "到期提醒" }
      ],
      comboDate: [],
      modelStatus: "", // 模态框标题
      contractId: "",
      list: [], // 主列表数据
      isShowCreateUpdate: false,
      showDetail: false,
      tableCol: [
        {
          key: "contractCode",
          label: "合同编码",
          align: "left",
          width: 120,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span>
                {!row.readFlag && this.listQuery.fastFlag === 4 && (
                  <div class="unread-tag" style="margin-right: 4px"></div>
                )}
                {data}
              </span>
            );
          }
        },
        {
          key: "contractName",
          label: "合同名称",
          props: { "show-overflow-tooltip": true },
          align: "left",
          render: (h, data, row) => {
            return (
              <span
                class="canClick"
                onClick={this.contractDetail.bind(this, row)}
              >
                {data}
              </span>
            );
          }
        },
        {
          key: "customerName",
          align: "left",
          label: "企业名称",
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span
                class="a-link"
                onClick={this.$gotoCustomerDetail.bind(this, row.customerId)}
              >
                {data}
              </span>
            );
          }
        },
        {
          key: "contractAvailable",
          label: "合同金额(元)",
          align: "right",
          render: (h, data, row) => {
            return this.$toMoney(data);
          }
        },
        {
          key: "rebate",
          label: "回款比例",
          align: "right",
          width: "100px",
          render: (h, data, row) => {
            return row.contractAvailable
              ? ((data / row.contractAvailable) * 100).toFixed(2) + "%"
              : "0.00%";
          }
        },
        {
          key: "headName",
          label: "负责人",
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
          key: "state",
          label: "合同状态",
          width: "100px",
          render: (h, data) => {
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
        {
          key: "signDate",
          label: "签订日期",
          width: "100px",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          }
        },
        {
          key: null,
          label: "操作",
          width: "260px",
          render: (h, data, row) => {
            return [
              row.editable && row.state === "0" ? (
                <el-link type="primary" onClick={this.contractEdit.bind(this, row)}>编辑</el-link>) : (
                <el-link type="info" disabled>编辑</el-link>
              ),
              row.editable && row.state === "2" ? (<el-link type="primary" onClick={this.contractSign.bind(this, row)}>登记</el-link>) : (
             <el-link type="info" disabled>登记</el-link>),
              // (row.editable && row.state === "0") ?
              //     <el-link type="primary"  onClick={this.contractDelete.bind(this, row)}> 作废 </el-link> :
              //     <el-link type="info"   disabled> 作废 </el-link>,
              row.editable && row.displayable ? (
                <el-link type="primary" onClick={this.contractChange_change.bind(this, row)}>变更</el-link>) : (<el-link type="info" disabled>变更</el-link>
              ),
              // row.editable && row.displayable ? (
              //   <el-link type="primary" onClick={this.contractChange_promise.bind(this, row)}>完成</el-link>
              // ) : (<el-link type="info" disabled> 完成</el-link>)
              // (row.editable && row.displayable) ?
              //     <el-link type="primary"  onClick={this.contractChange_cancel.bind(this, row)}> 取消 </el-link> :
              //     <el-link type="info"  disabled> 取消 </el-link>,
              // (row.editable && row.displayable) ?
              //     <el-link type="primary" onClick={this.changeRecords.bind(this, row)}> 记录 </el-link> :
              //     <el-link type="info" disabled> 记录 </el-link>,
            ];
          }
        }
      ]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.contractDetail({ id: this.$route.query.id });
    }
    if (this.$route.query.new) {
      this.handleAdd();
    }
    this.$nextTick(() => {
      this.getList();
      this.handleNodeClickQuery({});
      // department & user BEGIN
      Api_DepartmentsFetchTree().then(res => {
        this.treeData = res;
      });
      // department & user END
    });
  },
  methods: {
    Api_ContractGetList,
    Api_contractOrderStatistics,
    Api_contractOrderStatisticsEdit,
    Api_contractOrderStatisticsSave,
    // 获取主列表数据
    getList() {
      this.listQuery.startDate =
        this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.listQuery.endDate =
        this.comboDate.length > 0 ? this.comboDate[1] : "";
      this.$refs.child.fetchData();
      this.$refs.ref_StatisticalSetting.getData();
      Api_contractOrderCount({ ...this.listQuery, order: false }).then(res => {
        this.statusOptions = [
          { id: 0, name: "全部" },
          { id: 1, name: "我负责的" },
          { id: 2, name: "待我处理" + (res.todo ? "(" + res.todo + ")" : "") },
          { id: 3, name: "已到期的" },
          {
            id: 4,
            name: "到期提醒" + (res.maturity ? "(" + res.maturity + ")" : "")
          }
        ];
      });
    },
    // 根据查询条件获取数据
    handleFilter() {
      this.getList();
    },
    // 重置查询条件
    handleReset(formName) {
      this.$refs[formName].resetFields();
      // department & user BEGIN
      this.listQuery.headId = "";
      this.listQuery.headDept = "";
      // department & user END
      this.listQuery.startDate = "";
      this.listQuery.endDate = "";
      this.comboDate = [];
      this.handleNodeClickQuery({});
    },
    // 重置form表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
      this.listQuery.headDept = item.id;
      Api_DepartmentUserList({
        currentPage: 1,
        pageSize: 100,
        departmentIds: item.id
      }).then(res => {
        this.listQuery.userName = "";
        this.departmentUsers = res.data;
        this.treeShowQuery = false;
      });
    },
    selectClick(id) {
      this.listQuery.headId = id;
    },
    // department & user END
    // 新增
    handleAdd() {
      if (this.$isVip()) {
        this.isShowCreateUpdate = true;
        this.$nextTick(() => {
          this.$refs.refCreateUpdateModel.open("add");
        });
      } else {
        this.$vipExpireConfirm();
      }
    },
    contractDetail(row) {
      // this.modelStatus = "info";
      // this.contractId = row.id;
      // this.$nextTick(() => {
      //     this.$refs.refCreateUpdateModel.open();
      // });
      this.showDetail = true;
      this.$nextTick(() => {
        this.$refs.ref_ContractDetail.open(row.id,row);
      });
    },
    hideDetail() {
      this.showDetail = false;
    },
    contractEdit(row) {
      this.isShowCreateUpdate = true;
      this.$nextTick(() => {
        this.$refs.refCreateUpdateModel.open(
          "update",row.id,undefined,undefined,row
        );
      });
    },
    // contractDelete(row) {
    //   this.$confirm("确定合同作废吗?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       const loading = this.$openLoading();
    //       Api_CancelContract(row.id)
    //         .then(() => {
    //           loading.close();
    //           this.$message.success("作废成功！");
    //           this.getList();
    //         })
    //         .catch(res => {
    //           loading.close();
    //           this.$message.error(res);
    //         });
    //     })
    //     .catch(() => {});
    // },
    contractChange(row) {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(row.id, { applyType: 2 })
        .then(res => {
          loading.close();
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", row.id, res);
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },

    //  点击变更的时候获取数据
    contractChange_change(row) {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(row.id, { applyType: 2,tabType:1})
        .then((res) => {
          loading.close();
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", row.id, res, "2",row);
          });
        })
        .catch((res) => {
          loading.close();
          this.$message.error(res);
        });
    },

    contractChange_promise(row) {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(row.id, { applyType: 3 })
        .then(res => {
          loading.close();
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", row.id, res, "3");
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },

    contractChange_cancel(row) {
      const loading = this.$openLoading();
      Api_ChangeContractJudge(row.id, { applyType: 4 })
        .then(res => {
          loading.close();
          this.modelStatus = "change";
          this.contractId = row.id;
          this.isShowCreateUpdate = true;
          this.$nextTick(() => {
            this.$refs.refCreateUpdateModel.open("change", row.id, res, "4");
          });
        })
        .catch(res => {
          loading.close();
          this.$message.error(res);
        });
    },
    showCreateUpdate() {
      this.isShowCreateUpdate = true;
    },
    hideCreateUpdate() {
      this.isShowCreateUpdate = false;
    },
    /**
     * @快捷筛选
     */
    switchStatus(_id) {
      this.listQuery.fastFlag = _id;
      this.getList();
    },
    contractSign(row) {
      this.modelStatus = "sign";
      this.contractId = row.id;
      this.$nextTick(() => {
        this.$refs.ref_ContractRegistration.open(row);
      });
    },
    /**
     * @变更记录
     */
    changeRecords(row) {
      this.$refs.ref_ChangeRecords.open(row);
    }
  }
};
</script>

<style scoped></style>
