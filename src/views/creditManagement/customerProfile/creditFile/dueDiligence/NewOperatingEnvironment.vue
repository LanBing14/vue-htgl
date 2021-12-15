<template>
  <Dialog
    ref="drawer"
    title="新增经营环境"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="150px" style="padding: 0 16px">
      <el-form-item label="业务覆盖区域" prop="area">
        <el-input type="textarea" :rows="3" v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item label="所属行业及代码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="区域信用优势与关注" prop="advantage">
        <el-input type="textarea" :rows="3" v-model="form.advantage"></el-input>
      </el-form-item>
      <el-form-item label="行业政策指向" prop="policy">
        <el-select v-model="form.policy" style="width: 100%">
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in policyOptions"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业市场集中度" prop="center">
        <el-input type="textarea" :rows="3" v-model="form.center"></el-input>
      </el-form-item>
      <el-form-item label="产业链所处位置" prop="position">
        <el-select v-model="form.position" style="width: 100%">
          <el-option
            :label="item.label"
            :value="item.value"
            :key="item.value"
            v-for="item in positionOptions"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行业近期发展趋势" prop="trend">
        <el-input type="textarea" :rows="3" v-model="form.trend"></el-input>
      </el-form-item>
      <el-form-item label="行业分析" prop="analyze">
        <el-input type="textarea" :rows="3" v-model="form.analyze"></el-input>
      </el-form-item>
      <el-form-item label="行业风险提示" prop="tip">
        <el-input type="textarea" :rows="3" v-model="form.tip"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewOperatingEnvironment",
  data() {
    return {
      visible: false,
      form: {
        area: undefined,
        code: undefined,
        advantage: undefined,
        policy: undefined,
        center: undefined,
        position: undefined,
        trend: undefined,
        analyze: undefined,
        tip: undefined
      },
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
    }
  }
};
</script>

<style>
</style>
