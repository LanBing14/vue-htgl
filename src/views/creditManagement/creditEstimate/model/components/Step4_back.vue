<template>
  <div>
    <TableWrapper
      ref="table"
      :data="tableData"
      :query="listQuery"
      :columns="tableCol"
      :tableProps="{rowKey: 'nid',defaultSort:{prop: 'priority', order: 'descending'}}"
    />
    <Dialog :title="modelStatus ? '新增等级':'修改等级'" :visible.sync="visible" :onOk="handleSure" @close="onClose">
      <el-form ref="form" :model="formData" :rules="formRules" label-width="8em">
        <el-form-item label="优先级" prop="priority">
          <el-input v-model.number="formData.priority" autocomplete="off" placeholder="请输入优先级"></el-input>
        </el-form-item>
        <el-form-item label="信用等级名称" prop="gradeName">
          <el-input v-model="formData.gradeName" placeholder="请输入信用等级名称"></el-input>
        </el-form-item>
        <el-form-item label="信用等级说明" prop="gradeDesc">
          <el-input v-model="formData.gradeDesc" :rows="4" type="textarea" placeholder="请输入信用等级说明"></el-input>
        </el-form-item>
        <el-form-item label="分值范围">
          <el-form-item prop="scoreBegin" style="display: inline-block;width: 100px;">
            <el-input v-model="formData.scoreBegin" placeholder="最小值"></el-input>
          </el-form-item>~
          <el-form-item prop="scoreEnd" style="display: inline-block;width: 100px;">
            <el-input v-model="formData.scoreEnd" placeholder="最大值"></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script type="text/jsx">
import { uniqueId, merge } from "lodash";
import Button from "@/components/Button";
import { Api_EvaluateModelFour, Api_EvaluateModelFourGet } from "@/api/creditManagement/creditEstimate/model";
export default {
  name: "Step4",
  props: {
    rowId: String, // 当前记录id
    defaultData: Array, // 默认数据，当前步骤返回上一层时有可能作了保存数据的操作，由此重新获得上一次保存的值
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      modelStatus: true,
      listQuery: {},
      formData: { priority: "", gradeName: "", gradeDesc: "", scoreBegin: "", scoreEnd: "", nid: "", id: "" },
      formRules: {
        priority: [
          { required: true, message: "优先级必填", trigger: "change" },
          { min: 1, max: 999, message: "请输入1-999之间的数字", type: "number", trigger: "change" },
        ],
        gradeName: createRules({ msg: "信用等级名称", required: true, max: 3 }),
        gradeDesc: createRules({ msg: "信用等级名称", max: 100 }),
        scoreBegin: [
          { required: true, message: "最小值必填", trigger: "change" },
          { pattern: /^\d+$|^\d\.\d{1,2}$/, message: "请输入数字，支持2位小数" },
          { validator: this.validatorMin },
        ],
        scoreEnd: [
          { required: true, message: "最大值必填", trigger: "change" },
          { pattern: /^\d+$|^\d\.\d{1,2}$/, message: "请输入数字，支持2位小数" },
          { validator: this.validatorMax },
        ],
      },
      tableData: merge([], this.defaultData),
      tableCol: [
        { key: "priority", label: "优先级" },
        { key: "gradeName", label: "信用等级名称" },
        { key: "gradeDesc", label: "信用等级说明" },
        { key: "scoreBegin", label: "分值范围自" },
        { key: "scoreEnd", label: "分值范围至" },
        {
          key: null,
          label: "操作",
          render: (h, data, row) => {
            return (
              <button-dropdown
                data={[
                  { text: "编辑", click: this.handleUpdate.bind(this, row) },
                  { text: "删除", click: this.handleDelete.bind(this, row) },
                ]}
              />
            );
          },
        },
      ],
    };
  },
  created() {
    if (this.rowId) {
      Api_EvaluateModelFourGet(this.rowId).then((res) => {
        this.tableData = res.map(({ priority, gradeName, gradeDesc, scoreBegin, scoreEnd, id, nid }) => {
          return { priority, gradeName, gradeDesc, scoreBegin, scoreEnd, id, nid };
        });
      });
    }
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        if (this.tableData.length) {
          Api_EvaluateModelFour(this.rowId, this.tableData)
            .then((res) => {
              resolve(this.tableData);
            })
            .catch((e) => {
              this.$message.error(e);
              reject(e);
            });
        } else {
          this.$message.warning("至少存在一个等级，请添加！");
          reject();
        }
      });
    },
    handleAdd() {
      this.modelStatus = true;
      this.visible = true;
    },
    handleUpdate(row) {
      console.log(row);
      this.modelStatus = false;
      this.formData = Object.assign({}, row);
      this.visible = true;
    },
    handleDelete(row) {
      const findIndex = this.tableData.findIndex((item) => item.id === row.id);
      this.tableData.splice(findIndex, 1);
      this.$message.success("删除成功");
    },
    handleSure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.modelStatus) {
            this.tableData.push({
              ...this.formData,
              nid: +new Date(),
              id: "",
              version: "",
            });
          } else {
            const findIndex = this.tableData.findIndex(
              (item) => item.id === (this.formData.id || this.formData.nid)
            );
            this.tableData.splice(findIndex, 1, Object.assign({}, this.formData));
          }
          this.visible = false;
        }
      });
    },
    onClose() {
      this.$refs.form.resetFields();
      this.visible = false;
    },
    validatorMin(rule, value, callback) {
      if (value) {
        if (this.formData.scoreEnd && Number(value) > Number(this.formData.scoreEnd)) {
          new Error(callback("最小值不能大于最大值"));
          return;
        }
        callback();
        return;
      }
      callback();
    },
    validatorMax(rule, value, callback) {
      if (value) {
        if (this.formData.scoreBegin && Number(value) < Number(this.formData.scoreBegin)) {
          new Error(callback("最大值不能小于最小值"));
          return;
        }
        callback();
        return;
      }
      callback();
    },
    editChange() {
      if (this.tableData.length) {
        return true;
      } else {
        return false;
      }
    },
    clearData() {
      // this.$refs.form.resetFields()
    },
  },
};
</script>

<style scoped>
</style>
