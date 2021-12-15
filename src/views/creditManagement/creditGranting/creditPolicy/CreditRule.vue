<template>
  <div>
    <!--<el-button size="small" style="float: right;margin-bottom: 10px" @click="handleEdit">新增</el-button>-->
    <TableWrapper ref="table" :fetchDataFn="Api_CreditRule" :columns="tableCol" />
    <Detail ref="ref_detail"></Detail>
    <Edit ref="ref_edit" @ok="getList"></Edit>
  </div>
</template>

<script type="text/jsx">
import Detail from "./creditRuleComp/Detail";
import Edit from "./creditRuleComp/Edit";
import {
  Api_AddCreditCustomerRule,
  Api_CreditRule,
  Api_GdelDiscountRule,
  Api_DiscountRuleOn
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "CreditRule",
  components: { Detail, Edit },
  data () {
    return {
      dataList: [
        {
          state: true
        }
      ],
      tableCol: [
        {
          key: "name",
          label: "规则名称",
          align: "left",
          render: (h, data, row) => {
            return <el-link type="primary" onClick={this.handleDetail.bind(this, row)}>  {data} </el-link>
          }
        },
        {
          key: "remark",
          label: "规则描述",
          props: { "show-overflow-tooltip": true }
        },
        {
          key: "isCredit",
          label: "采取措施",
          align: "left",
          render: (h, data, row) => {
            return (
              (data ? "停止赊销" : "") +
              (row.isSend ? (data ? ",停止发货" : "停止发货") : "") +
              (row.isWork ? (data || row.isSend ? ",停止业务往来" : "停止业务往来") : "")
            );
          }
        },
        {
          key: "state",
          label: "规则状态",
          render: (h, data, row) => {
            return (
              <el-switch
                value={data}
                active-color="#409eff"
                inactive-color="#dcdfe6"
                onChange={this.statusChange.bind(this, row)}
              ></el-switch>
            );
          }
        },
        {
          key: "",
          label: "操作",
          render: (h, data, row) => {
            return [
              <el-link type="primary" onClick={this.handleEdit.bind(this, row)}> 编辑 </el-link>,
              <el-link type="primary" onClick={this.handleDel.bind(this, row)}> 删除 </el-link>
            ]
          }
        }
      ]
    };
  },
  mounted () {


    this.firstAdd(() => {
      this.getList();
    });


    
  },
  methods: {
    Api_CreditRule,
    // 页面加载调用
    firstAdd (cb) {
      Api_AddCreditCustomerRule()
        .then(res => {
          console.log(res);
          cb && cb();
        })
        .catch(res => {
          console.log(res)
          // this.$message.error(res);
        });
    },
    // 获取列表
    getList () {
      this.$refs.table.fetchData();
    },
    // 详情
    handleDetail (row) {
      this.$refs.ref_detail.open(row);
    },
    // 修改
    handleEdit (row) {
      this.$refs.ref_edit.open(row);
    },
    // 删除
    handleDel (row) {
      Api_GdelDiscountRule(row.id)
        .then(res => {
          this.$message.success(res);
          this.getList();
        })
        .catch(res => {
          this.$message.error(res);
        });
    },
    // 状态
    statusChange (row) {
      Api_DiscountRuleOn({ state: row.state ? false : true }, row.id)
        .then(res => {
          this.$message.success(res);
          this.getList();
        })
        .catch(res => {
          this.$message.error(res);
        });
    }
  }
};
</script>

<style scoped>
</style>
