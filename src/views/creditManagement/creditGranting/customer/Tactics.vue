<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>授信策略</span>
      </h1>
      <div>
        <el-button size="small" @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form :model="formData" label-width="6em" label-position="left" class="form">
        <div class="sub-title">
          授信总额限制
          <el-button size="small" @click="handleEdit1">编辑</el-button>
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
        <div class="sub-title">等级授信方案</div>
        <div style="padding: 0 20px; margin-top: 20px">
          <el-row
            v-for="(el,index) in formData.schemes"
            :key="index"
            style="border-bottom: 1px #eaedf4 solid;margin-top: 10px"
          >
            <el-col class="flex v-center" style="margin-bottom: 10px;">
              <span class="flex-primary level-tip">{{ el.gradeName }}</span>
              <div>
                <el-button size="small" @click="handleEdit2(el, index)">编辑</el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <el-form-item label="授信总额" prop="key1">
                {{ $toMoney(el.creditQuota, 2) }}&nbsp;
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="信用账期" prop="key1">
                {{ $isNull(el.accountDays) }}&nbsp;
                <span class="unit-number">天</span>
              </el-form-item>
            </el-col>
            <!--<el-col :span="5">
                            <el-form-item label="单笔限额" prop="key1">
                                {{ $toMoney(el.singleQuota, 2) }}&nbsp;
                                <span class="unit-number">元</span>
                            </el-form-item>
            </el-col>-->
            <el-col :span="6">
              <el-form-item label="逾期额度" prop="key1">
                {{ $toMoney(el.overdueQuota, 2) }}&nbsp;
                <span class="unit-number">元</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="逾期天数" prop="key1">
                {{ $isNull(el.overdueDays) }}&nbsp;
                <span class="unit-number">天</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="text-align: center;margin-top: 30px;">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="back">取消</el-button>
      </div>
    </div>

    <Comp1 ref="comp1" @ok="okComp1"></Comp1>
    <Comp2 ref="comp2" @ok="okComp2"></Comp2>
  </div>
</template>

<script>
import { isNull } from 'lodash'
import Comp1 from "./Comp1"; // 授信总额限制——编辑弹框
import Comp2 from "./Comp2"; // 等级授信方案——编辑弹框
import {
  Api_CreditCustomerGetCreditStrategy,
  Api_CreditCustomerSaveCreditStrategy,
  Api_CreditCustomerEditCreditStrategy,
  Api_CreditCustomerGetGradeList
} from "@/api/creditManagement/creditGranting/customer";

export default {
  name: "Tactics",
  components: {
    Comp1,
    Comp2
  },
  props: {
    tacticsStatus: {
      // 新增或修改
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      id: "", // 授信策略id
      formData: {
        modelHisId: "",
        totalCredit: "",
        totalReceivable: "",
        schemes: [
          //     {
          //     creditQuota: '',
          //     singleQuota: '',
          //     creditPeriod: '',
          //     overdueDays: '',
          //     modelGradeHisId: '',
          //     gradeName: ''
          // }
        ]
      }
    };
  },
  created () {
    if (this.tacticsStatus) {
      Api_CreditCustomerGetGradeList().then(res => {
        if (res.length > 0) {
          this.formData.modelHisId = res[0].model_his_id;
          this.formData.schemes = res.map(item => {
            return {
              modelGradeHisId: item.grade_id,
              gradeName: item.grade_name
            };
          });
        }
      });
    } else {
      Api_CreditCustomerGetCreditStrategy().then(res => {
        this.id = res.id;
        this.formData.modelHisId = res.modelHisId;
        this.formData.totalCredit = res.totalCredit;
        this.formData.totalReceivable = res.totalReceivable;
        this.formData.schemes = res.transientGradeSchemes;
      });
    }
  },
  methods: {
    handleEdit1 () {
      this.$refs.comp1.open(this.formData.totalCredit, this.formData.totalReceivable);
    },
    handleEdit2 (data, index) {
      this.$refs.comp2.open(data, index);
    },
    okComp1 ({ totalCredit, totalReceivable }) {
      this.formData.totalCredit = totalCredit;
      this.formData.totalReceivable = totalReceivable;
    },
    okComp2 (data, index) {
      console.log(data)
      this.formData.schemes.splice(index, 1, data);
    },
    // 保存数据
    save () {
      if (this.formData.schemes.length > 0) {
        for (let i = 0; i < this.formData.schemes.length; i++) {
          if (this.formData.schemes[i].creditQuota === null || this.formData.schemes[i].creditQuota === undefined) {
            this.$message.error('请输入授信总额');
            return
          }
          // if (this.formData.schemes[i].singleQuota === null || this.formData.schemes[i].singleQuota === undefined) {
          //     this.$message.error('请输入单笔限额');
          //     return
          // }
          if (this.formData.schemes[i].overdueQuota === null || this.formData.schemes[i].overdueQuota === undefined) {
            this.$message.error('请输入逾期额度');
            return
          }
          if (this.formData.schemes[i].overdueDays === null || this.formData.schemes[i].overdueDays === undefined) {
            this.$message.error('请输入逾期天数');
            return
          }
          if (this.formData.schemes[i].accountDays === null || this.formData.schemes[i].accountDays === undefined) {
            this.$message.error('请输入信用账期');
            return
          }
        }
      }
      if (this.tacticsStatus) {
        Api_CreditCustomerSaveCreditStrategy(this.formData)
          .then(msg => {
            this.$message.success(msg);
            this.back();
          })
          .catch(e => {
            console.log(e);
            // this.$message.error(e.message);
          });
      } else {
        const newSchemes = [];
        for (let i = 0; i < this.formData.schemes.length; i++) {
          newSchemes[i] = {};
          newSchemes[i].modelGradeHisId = this.formData.schemes[i].modelGradeHisId;
          newSchemes[i].gradeName = this.formData.schemes[i].gradeName;
          newSchemes[i].creditQuota = this.formData.schemes[i].creditQuota;
          // newSchemes[i].singleQuota = this.formData.schemes[i].singleQuota;
          newSchemes[i].overdueQuota = this.formData.schemes[i].overdueQuota;
          newSchemes[i].overdueDays = this.formData.schemes[i].overdueDays;
          newSchemes[i].accountDays = this.formData.schemes[i].accountDays;
        }
        this.formData.schemes = newSchemes;
        Api_CreditCustomerEditCreditStrategy(this.id, this.formData)
          .then(msg => {
            this.$message.success(msg);
            this.back();
          })
          .catch(e => {
            this.$message.error(e.message);
          });
      }
    },
    back () {
      this.$emit("edit", false);
    }
  }
};
</script>

<style scoped lang="scss">
.level-tip {
  color: $--color-primary;
  font-size: 13px;
}
</style>
