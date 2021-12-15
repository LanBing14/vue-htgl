<template>
  <!--    收入构成-->
  <div>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="10em" label-position="left">
      <el-form-item prop="year" label="年度">
        <template v-if="isView">{{ formData.year }}</template>
        <el-date-picker
          v-model="formData.year"
          type="year"
          value-format="yyyy"
          placeholder="请选择年度"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="totalIncome" label="营业收入合计">
        <template v-if="isView">{{ formData.totalIncome }}</template>
        <el-input v-else v-model="formData.totalIncome" placeholder="请输入营业收入合计">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="totalGrossProfit" label="毛利润合计">
        <template v-if="isView">{{ formData.totalGrossProfit }}</template>
        <el-input v-else v-model="formData.totalGrossProfit" placeholder="请输入毛利润合计">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="grossMargin" label="综合毛利率">
        <template v-if="isView">{{ formData.grossMargin ? formData.grossMargin + '%' : '' }}</template>
        <el-input v-else v-model="formData.grossMargin" disabled>
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <div class="sub-title">主要产品/服务及其收入信息(前五)</div>
      <el-table :data="formData.products">
        <el-table-column label="产品名称" prop="year">
          <template slot-scope="scope">
            <el-form-item
              :prop="'products.'+scope.$index+'.productName'"
              :rules="[{required: true, message: '产品名称必填'},{max: 10, message: '产品名称最大长度为10个字'}]"
              label-width="0"
            >
              <el-input v-model="scope.row.productName" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="营业收入(万元)" prop="income">
          <template slot-scope="scope">
            <el-form-item
              :prop="'products.'+scope.$index+'.income'"
              :rules="$createRules({msg: '营业收入',required: true,numberFloatUp: true,validator: validatorIncome})"
              label-width="0"
            >
              <el-input v-model="scope.row.income" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="占比(%)" prop="incomeProportion">
          <template slot-scope="scope">
            <el-form-item :prop="'products.'+scope.$index+'.incomeProportion'" label label-width="0">
              <el-input :value="getIncomeProportion(scope.row.income, scope.$index)" disabled />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :render-header="renderHeader" prop="incomeProportion" width="80">
          <template slot="header">
            <el-button size="mini" @click="addProduct">新增</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="delProduct(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script type="text/jsx">
export default {
  name: "Comp32",
  props: {
    id: String, //  企业id
    modelStatus: Boolean, // 新增或修改状态
    data: Object, // 详情数据
    isView: Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      sourceOptions: [
        { label: "企业主要产品和服务(平方米)", value: "0" },
        { label: "办公用房面积(平方米)", value: "1" },
        { label: "房产原值或年租金(平方米)", value: "2" }
      ],
      options: [],
      formData: {
        year: this.$dateFormat(new Date(), "yyyy"), // 	总计
        totalIncome: "", // 	营业收入合计
        totalGrossProfit: "", // 	毛利润合计
        grossMargin: "", // 	综合毛利率
        products: [] //  主要产品/服务及其收入信息
      },
      formRules: {
        year: createRules({
          msg: "年度",
          max: 200
        }),
        totalIncome: createRules({
          msg: "营业收入合计",
          required: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("营业收入合计必填"));
              return;
            }
            if (parseInt(value) > 1000000000) {
              callback(new Error("营业收入合计不能大于10亿"));
            } else {
              callback();
            }
          }
        }),
        totalGrossProfit: createRules({
          msg: "毛利润合计",
          required: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("毛利润合计必填"));
              return;
            }
            const { totalIncome } = this.formData;
            if (totalIncome && Number(value) > Number(totalIncome)) {
              callback(new Error("毛利润合计不能大于营业收入合计"));
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
    },
    "formData.totalIncome"() {
      this.getPer();
    },
    "formData.totalGrossProfit"() {
      this.getPer();
    }
  },
  created() {
    this.$nextTick(() => {
      this.mergeData(this.data);
    });
  },
  methods: {
    mergeData(data) {
      if (!data || !data.id) {
        this.$nextTick(() => {
          this.$refs.form.resetFields();
          this.formData.products = [];
          return;
        });
      }
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = data[key] ? String(data[key]) : "";
      });
      this.formData.products = data.transientProducts;
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
    // 获取百分比
    getPer() {
      let per = "";
      const { totalIncome, totalGrossProfit } = this.formData;
      if (totalIncome && totalGrossProfit) {
        per = Math.round(this.$divide(Number(totalGrossProfit), Number(totalIncome)) * 10000) / 100;
      }
      this.formData.grossMargin = per;
    },
    validatorIncome(rule, value, callback) {
      if (!value) {
        callback(new Error("营业收入必填"));
        return;
      }
      const { totalIncome } = this.formData;
      if (totalIncome && Number(value) > Number(totalIncome)) {
        callback(new Error("营业收入不能大于营业收入合计"));
      } else {
        callback();
      }
    },
    getIncomeProportion(income, index) {
      const { totalIncome } = this.formData;
      let n = "";
      if (income && totalIncome && Number(income) <= Number(totalIncome)) {
        n = Math.round(this.$divide(income, this.formData.totalIncome) * 10000) / 100;
      }
      this.formData.products[index].incomeProportion = n;
      return n;
    },
    // 新增产品
    addProduct() {
      if (this.formData.products.length < 5) {
        this.formData.products.push({
          productName: "",
          income: "",
          incomeProportion: ""
        });
      } else {
        this.$message.warning("最多添加5条产品");
      }
    },
    // 删除产品
    delProduct(index) {
      this.formData.products.splice(index, 1);
    },
    renderHeader() {
      return (
        <el-button size="mini" onClick={this.addProduct.bind(this)}>
          新增
        </el-button>
      );
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-table {
  overflow: initial;

  .el-table__body-wrapper {
    overflow: inherit;

    .cell {
      overflow: inherit;
    }
  }
}
</style>
