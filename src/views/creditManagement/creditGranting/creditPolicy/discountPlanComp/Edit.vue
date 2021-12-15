<template>
  <Dialog :title="title" :visible.sync="visible" :onOk="handleSure" width="500px" @close="onClose">
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="6em"
      label-position="left"
      class="form"
      style="margin: auto"
    >
      <el-form-item label="方案名称" prop="name">
        <el-input v-model="formData.name" placeholder="请填写方案名称"></el-input>
      </el-form-item>
      <el-form-item label="方案描述" prop="remark">
        <el-input type="textarea" :rows="3" placeholder="请输入现金折扣方案描述信息及使用场景等信息" v-model="formData.remark"></el-input>
      </el-form-item>
      <el-table
        :data="formData.details"
        style="width: 100%; margin-bottom: 6px; margin-right: 6px"
        class="table-no-hidden form-table"
      >
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" label="付款天数">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              class="table-form-item"
              :prop="'details.'+scope.$index+'.payDay'"
              :rules="$createRules({msg:'付款天数',required:true,cipint0:true}).concat([{validator:valiPayDay(scope.row,scope.$index)}])"
            >
              <el-input v-model="scope.row.payDay" placeholder="付款天数"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" label="折扣率（%）">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              class="table-form-item"
              :prop="'details.'+scope.$index+'.discountRate'"
              :rules="$createRules({msg:'折扣率',required:true,numberTwo:true}).concat([isValiDiscount?{validator:valiDiscount(scope.row,scope.$index)}:{}])"
            >
              <el-input
                v-model="scope.row.discountRate"
                :disabled="scope.$index === formData.details.length - 1"
                placeholder="折扣率"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope" v-if="scope.$index !== formData.details.length - 1">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="addList(scope.$index)"
              circle
              style="padding: 8px 6px 6px"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-minus"
              @click="delList(scope.$index)"
              circle
              style="padding: 8px 6px 6px"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="有效期限" prop="applyStartDate" :rules="$createRules({required:true,msg:'有效期限'})">
        <el-date-picker
          v-model="comboDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="revertComboDate"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script type="text/jsx">
import {
  Api_AddCreditCustomerPlan,
  Api_EditCreditCustomerPlan,
  Api_GetDiscountPlan
} from "@/api/creditManagement/creditGranting/customer";
import { merge } from "lodash";

export default {
  name: "Edit",
  data() {
    return {
      title: "新增方案",
      visible: false,
      comboDate: [],
      id: "",
      formData: {
        name: "",
        remark: "",
        applyStartDate: "",
        applyEndDate: "",
        details: [
          { id: "", payDay: "", discountRate: "" },
          { id: "", payDay: "", discountRate: "0" }
        ]
      },
      formRules: {
        name: this.$createRules({ required: true, msg: "方案名称", max: 20 }),
        remark: this.$createRules({ required: true, msg: "方案描述", max: 200 })
      },
      isValiDiscount: false
    };
  },
  methods: {
    open(row) {

      if (row.id) {
        this.title = "修改方案";
        this.id = row.id;
        Api_GetDiscountPlan(this.id)
          .then(res => {
            this.formData.name = res.name;
            this.formData.remark = res.remark;
            this.formData.details = res.outVos;
            this.formData.applyStartDate = this.$dateFormat(res.applyStartDate, "yyyy-MM-dd");
            this.formData.applyEndDate = this.$dateFormat(res.applyEndDate, "yyyy-MM-dd");
            this.comboDate = [
              this.$dateFormat(res.applyStartDate, "yyyy-MM-dd"),
              this.$dateFormat(res.applyEndDate, "yyyy-MM-dd")
            ];
          })
          .catch(res => {
            this.$message.error(res);
          });
      }else{
         this.title = "新增方案";

      }
      this.visible = true;
    },
    handleSure() {
      let _data = JSON.parse(JSON.stringify(this.formData.details));
      const _last = _data.pop();
      _data = _data.sort((a, b) => a.payDay - b.payDay);
      _data.push(_last);
      this.formData.details = _data;
      this.isValiDiscount = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id) {
            const postData = merge({}, this.formData);
            postData.details = postData.details.map(i => ({
              id: i.id,
              payDay: i.payDay,
              discountRate: i.discountRate
            }));
            const loading = this.$openLoading();
            Api_EditCreditCustomerPlan(this.id, postData)
              .then(res => {
                this.$message.success(res);
                this.$emit("ok");
                loading.close();
                this.visible = false;
              })
              .catch(res => {
                loading.close();
                this.$message.error(res);
              });
          } else {
            const loading = this.$openLoading();
            Api_AddCreditCustomerPlan(this.formData)
              .then(res => {
                this.$message.success(res);
                this.$emit("ok");
                loading.close();
                this.visible = false;
              })
              .catch(res => {
                loading.close();
                this.$message.error(res);
              });
          }
        }
      });
    },
    onClose() {



        /*this.formData={
            name: "",
            remark: "",
            applyStartDate: "",
            applyEndDate: "",
            details: [
                { id: "", payDay: "", discountRate: "" },
                { id: "", payDay: "", discountRate: "0" }
            ]
        };*/
        this.id="";
      this.comboDate = [];
      this.$refs.form.resetFields();
      this.formData.details= [
          { id: "", payDay: "", discountRate: "" },
          { id: "", payDay: "", discountRate: "0" }
      ];

    },
    addList(index) {
      this.formData.details.splice(index + 1, 0, { id: "", payDay: "", discountRate: "" });
    },
    delList(_i) {
      if (this.formData.details.length > 2) {
        this.formData.details.splice(_i, 1);
      } else {
        this.$message.warning("至少保留两条条记录");
      }
    },
    valiPayDay(row, index) {
      return (rule, value, callback) => {
        if (value) {
          for (let i = 0; i < this.formData.details.length; i++) {
            if (i !== index) {
              if (this.formData.details[i].payDay === row.payDay) {
                callback(new Error("付款天数不能重复"));
                return false;
              }
              if (index === this.formData.details.length - 1) {
                if (this.$subtract(this.formData.details[i].payDay, value) > 0) {
                  callback(new Error("须为最大付款天数"));
                  return false;
                }
              }
            }
          }
          callback();
        }
        callback();
      };
    },
    valiDiscount(row, index) {
      return (rule, value, callback) => {
        if (index === 0) {
          if (this.$subtract(this.formData.details[index + 1].discountRate, value) > 0) {
            callback();
          }
        } else if (index === this.formData.details.length - 1) {
          if (this.$subtract(value, this.formData.details[index - 1].discountRate) > 0) {
            callback();
          }
        } else {
          if (this.$subtract(value, this.formData.details[index - 1].discountRate) > 0) {
            callback(new Error("须降序排列"));
          }
        }
        callback();
      };
    },
    revertComboDate(val) {
      this.formData.applyStartDate = this.comboDate.length > 0 ? this.comboDate[0] : "";
      this.formData.applyEndDate = this.comboDate.length > 0 ? this.comboDate[1] : "";
    }
  }
};
</script>

<style scoped lang="scss">
.el-range-editor.el-input__inner {
  width: 100%;
}

.form-table {
  .el-form-item {
    margin-bottom: 0;
    margin-right: 0;
  }
}
</style>
