<template>
  <!--    客户-->
  <div>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="8em">
      <el-form-item prop="customerName" label="客户名称">
        <el-autocomplete
          v-model="formData.customerName"
          :fetch-suggestions="querySearch"
          :disabled="!modelStatus"
          placeholder="请输入客户名称"
          @select="handleSelect"
          style="width: 100%;"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item prop="promotingProducts" label="销售产品">
        <el-input v-model="formData.promotingProducts" placeholder="请输入销售产品" />
      </el-form-item>
      <el-form-item prop="salesAmount" label="销售金额">
        <el-input v-model="formData.salesAmount" placeholder="请输入销售金额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="proportionSales" label="销售金额占比">
        <el-input v-model="formData.proportionSales" placeholder="请输入销售金额占比">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="returnPeriod" label="回款周期">
        <el-input v-model="formData.returnPeriod" placeholder="请输入回款周期" />
      </el-form-item>
      <el-form-item prop="paymentMethod" label="付款方式">
        <el-input v-model="formData.paymentMethod" placeholder="请输入付款方式" />
      </el-form-item>
      <el-form-item prop="cooperationYears" label="合作年限">
        <el-input v-model="formData.cooperationYears" placeholder="请输入合作年限" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement";

export default {
  name: "Comp41",
  props: {
    id: String, //  企业id
    modelStatus: Boolean, // 新增或修改状态
    data: Object, // 详情数据
    isView: Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      formData: {
        customerName: "", // 	客户名称
        promotingProducts: "", // 	销售产品
        salesAmount: "", // 	销售金额
        proportionSales: "", // 	销售金额占比
        returnPeriod: "", // 	回款周期
        paymentMethod: "", // 	付款方式
        cooperationYears: "" // 	合作年限
      },
      formRules: {
        customerName: createRules({
          msg: "客户名称",
          required: true,
          max: 200
        }),
        promotingProducts: createRules({
          msg: "销售产品",
          required: true,
          max: 40
        }),
        salesAmount: createRules({
          msg: "销售金额",
          required: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("销售金额必填"));
              return;
            }
            if (Number(value) > 1000000000) {
              callback(new Error("销售金额不能大于10亿"));
            } else {
              callback();
            }
          }
        }),
        proportionSales: createRules({
          msg: "销售金额占比",
          required: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("销售金额占比必填"));
              return;
            }
            if (Number(value) > 100) {
              callback(new Error("销售金额占比不能大于100%"));
            } else {
              callback();
            }
          }
        }),
        returnPeriod: createRules({
          msg: "回款周期",
          required: true,
          max: 10
        }),
        paymentMethod: createRules({
          msg: "付款方式",
          required: true,
          max: 10
        }),
        cooperationYears: createRules({
          msg: "合作年限",
          required: true,
          cipint0: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("合作年限必填"));
              return;
            }
            if (Number(value) > 100) {
              callback(new Error("合作年限不能大于100"));
            } else {
              callback();
            }
          }
        })
      }
    };
  },
  watch: {
    data(val) {
      this.mergeData(val);
    }
  },
  created() {
    this.mergeData(this.data);
  },
  methods: {
    mergeData(data) {
      if (!data || !data.id) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
          return;
        });
      }
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = data[key] ? String(data[key]) : "";
      });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              ...this.formData,
              id: this.data.id,
              companyId: this.id // 	企业id
            });
          } else {
            reject();
          }
        });
      });
    },
    // 企业模糊查询
    querySearch(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      console.log(queryString);
      Api_SearchCompany({
        companyName: queryString
      })
        .then(res => {
          const temp = [];
          for (const elem of res.returnData) {
            temp.push({
              value: elem.name,
              companyId: elem.id,
              operName: elem.operName,
              creditCode: elem.creditCode
            });
          }
          cb(temp);
        })
        .catch(e => {
          cb([]);
          this.$message.error(e);
        });
    },
    handleSelect(item) {
      console.log(item);
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
