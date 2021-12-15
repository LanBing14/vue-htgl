<template>
  <el-form :model="formData" label-width="6em" class="form">
    <div class="sub-title" style="margin-top: 0">
      授信总额限制
      <el-button size="small" @click="handleComp1">编辑</el-button>
    </div>
    <div style="padding: 0 20px; margin-top: 20px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="授信总额">
            {{ $toMoney(formData.totalCredit, 2) }}&nbsp;
            <span class="unit-number">元</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应收总额">
            {{ $toMoney(formData.totalReceivable, 2) }}&nbsp;
            <span class="unit-number">元</span>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="sub-title">授信等级方案</div>
    <TableWrapper ref="table" :fetchDataFn="Api_CreditPlan" :query="listQuery" :columns="tableCol" />
    <Comp1 ref="comp1" @ok="okComp"></Comp1>
    <Comp2 ref="comp2" @ok="okComp"></Comp2>
  </el-form>
</template>

<script type="text/jsx">
import Comp1 from "./tacticsComp/Comp1";
import Comp2 from "./tacticsComp/Comp2";
import {
  Api_CreditCustomerCheckModel,
  Api_CreditCustomerCheckFirst,
  Api_CreditCustomerCheckGrade,
  Api_CreditCustomerGetCreditStrategy,
  Api_CreditPlan,
  Api_CreditPlanChange,
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "Tactics",
  components: { Comp1, Comp2 },
  data() {
    return {
      formData: {
        totalCredit: null,
        totalReceivable: null,
      },
      listQuery: {
        id: "",
      },
      tableCol: [
        {
          key: "gradeName",
          label: "信用等级",
        },
        {
          key: "creditQuota",
          align: "right",
          label: "信用额度(元)",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "accountDays",
          label: "信用账期",
        },
        {
          key: "overdueQuota",
          align: "right",
          label: "允许逾期额度(元)",
          render: (h, data) => {
            return this.$toMoney(data, 2);
          },
        },
        {
          key: "overdueDays",
          label: "允许逾期天数",
        },
        {
          key: "",
          label: "操作",
          render: (h, data, row) => {
              return <el-link type="primary" onClick={this.handleComp2.bind(this, row)}> 编辑 </el-link>
          },
        },
      ],
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    Api_CreditPlan,
    getInfo() {
      // 判断是否是第一次配置授信策略
      Api_CreditCustomerCheckFirst().then((res) => {
        
        if (res) {

          // 判断当前是否有启用的模型
          Api_CreditCustomerCheckModel().then((res) => {
            if (res) {
              this.getPlan();
            } else {
              this.$alert(
                '当前查找不到启用状态的评估模型，请先前往"信用评估"-"评估模型"页面选择评估模型。',
                "提示"
              );
            }
          });

        } else {
          // "当前启用状态评估模型信用等级方案是否更改
          Api_CreditCustomerCheckGrade().then((res) => {
            if (res.result) {
              this.getPlan();
            } else {
              this.$confirm("当前启用状态评估模型信用等级方案已经更改，等级授信方案需要重新配置?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                    Api_CreditCustomerGetCreditStrategy().then((r) => {
                        //初始化数据
                        Api_CreditPlanChange(r.id  ? r.id :'super',res.modelHisId)
                            .then((res) => {
                                if (res) {
                                    //获取初始化后的数据
                                    this.getPlan();
                                }
                            })
                            .catch((res) => {
                                this.$message.error(res);
                            });
                    });
                })
                .catch(() => {
                  this.getPlan();
                });
            }
          });
        }
      });
    },
    getPlan() {
      Api_CreditCustomerGetCreditStrategy().then((res) => {
        if (res) {
          this.listQuery.id = res.id;
          this.formData.totalCredit = res.totalCredit;
          this.formData.totalReceivable = res.totalReceivable;
          this.$refs.table.fetchData();
        }
      });
    },
    handleComp1() {
      this.$refs.comp1.open(this.listQuery.id, this.formData.totalCredit, this.formData.totalReceivable);
    },
    okComp() {
      this.getInfo();
    },
    handleComp2(row) {
      this.$refs.comp2.open(row);
    },
  },
};
</script>

<style scoped>
</style>
