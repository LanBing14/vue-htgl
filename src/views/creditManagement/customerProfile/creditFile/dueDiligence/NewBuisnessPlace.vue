<template>
  <Dialog
    ref="drawer"
    title="新增经营场所现场视察情况"
    :visible.sync="visible"
    :btns="drawerBtns"
    :close="closeDialog"
  >
    <el-form ref="form" :model="form" label-width="150px" style="padding: 0 16px">
      <el-form-item label="占地面积(公顷)" prop="area">
        <el-input v-model="form.area"></el-input>
      </el-form-item>
      <el-form-item label="地理位置和周边环境" prop="outEnvironment">
        <el-input type="textarea" :rows="3" v-model="form.outEnvironment"></el-input>
      </el-form-item>
      <el-form-item label="经营地址内部环境" prop="inEnvironment">
        <el-input type="textarea" :rows="3" v-model="form.inEnvironment"></el-input>
      </el-form-item>
      <el-form-item label="主要经营设施" prop="facility">
        <el-input type="textarea" :rows="3" v-model="form.facility"></el-input>
      </el-form-item>
      <el-form-item label="经营设施使用情况" prop="situation">
        <el-input type="textarea" :rows="3" v-model="form.situation"></el-input>
      </el-form-item>
      <el-form-item label="库存及库存质量" prop="quality">
        <el-input type="textarea" :rows="3" v-model="form.quality"></el-input>
      </el-form-item>
      <el-form-item label="员工素质" prop="natrue">
        <el-input type="textarea" :rows="3" v-model="form.natrue"></el-input>
      </el-form-item>
      <el-form-item label="员工工作积极性" prop="enthusiasm">
        <el-input type="textarea" :rows="3" v-model="form.enthusiasm"></el-input>
      </el-form-item>
      <el-form-item label="员工对上级评价" prop="judge">
        <el-input type="textarea" :rows="3" v-model="form.judge"></el-input>
      </el-form-item>
      <el-form-item label="管理层素质" prop="managerNatrue">
        <el-input type="textarea" :rows="3" v-model="form.managerNatrue"></el-input>
      </el-form-item>
      <el-form-item label="管理风格和水平" prop="level">
        <el-input type="textarea" :rows="3" v-model="form.level"></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
export default {
  name: "NewBuisnessPlace",
  data() {
    return {
      visible: false,
      form: {
        area: undefined,
        outEnvironment: undefined,
        inEnvironment: undefined,
        facility: undefined,
        situation: undefined,
        quality: undefined,
        natrue: undefined,
        enthusiasm: undefined,
        judge: undefined,
        managerNatrue: undefined,
        level: undefined
      },
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
