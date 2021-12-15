<template>
  <Dialog
    ref="drawer"
    title="新增收入构成"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="120px" style="padding: 0 16px">
      <el-form-item label="年度" prop="year">
        <el-date-picker v-model="form.year" type="year"></el-date-picker>
      </el-form-item>
      <el-form-item label="营业收入合计" prop="total">
        <el-input v-model="form.total"></el-input>
      </el-form-item>
      <el-form-item label="毛利润合计" prop="profit">
        <el-input v-model="form.profit"></el-input>
      </el-form-item>
      <el-form-item label="综合毛利率" prop="margin">
        <el-input v-model="form.margin"></el-input>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div v-for="(item, index) in productions" :key="index">
      <el-form :model="item" label-width="120px" style="padding: 0 16px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业收入">
              <el-input v-model="item.income"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="占比">
              <el-input v-model="item.proportion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button icon="el-icon-minus" type="danger" circle @click="minusProduction(index)"></el-button>
              <el-button
                v-if="(index+1)===productions.length"
                icon="el-icon-plus"
                circle
                type="primary"
                @click="plusProduction"
              ></el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </Dialog>
</template>

<script>
export default {
  name: "NewIncomeStructure",
  data() {
    return {
      visible: false,
      form: {
        year: new Date().getFullYear(),
        total: undefined,
        profit: undefined,
        margin: undefined,
        productions: undefined
      },
      productions: [{ name: "", income: "", proportion: "" }],
      policyOptions: [
        { label: "鼓励", value: "1" },
        { label: "限制", value: "2" },
        { label: "禁止", value: "3" }
      ],
      positionOptions: [
        { label: "良好", value: "1" },
        { label: "较好", value: "2" },
        { label: "一般", value: "3" },
        { label: "恶化", value: "4" }
      ],
      drawerBtns: [
        {
          text: "返回",
          click: () => {
            this.visible = false;
          }
        },
        {
          text: "确定",
          type: "primary",
          click: () => {
            this.visible = false;
          }
        }
      ]
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    minusProduction(index) {
      if (this.productions.length === 1) {
        return false;
      }
      this.productions.splice(index, 1);
    },
    plusProduction() {
      if (this.productions.length === 5) {
        return false;
      }
      this.productions.push({ name: "", income: "", proportion: "" });
    }
  }
};
</script>

<style>
</style>
