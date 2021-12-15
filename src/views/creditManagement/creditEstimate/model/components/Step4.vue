<template>
  <div>
    <el-form ref="form" :model="form">
      <el-table ref="table" :data="form.tableData" style="width: 100%" class="table-no-hidden">
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="信用等级名称" prop="gradeName" align="center"></el-table-column>
        <el-table-column label="信用等级说明" align="center">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              :prop="'tableData.'+scope.$index+'.gradeDesc'"
              :rules="$createRules({ msg: '信用等级名称', max: 100 })"
            >
              <el-input v-model="scope.row.gradeDesc"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="分值范围自" align="center">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              :prop="'tableData.'+scope.$index+'.scoreBegin'"
              :rules="[{ required: true, message: '最小值必填', trigger: 'change' },{ pattern: /^\d+$|^\d\.\d{1,2}$/, message: '请输入数字，支持2位小数' },{ validator: validatorMin(scope.row) }]"
            >
              <el-input v-model="scope.row.scoreBegin"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="分值范围至" align="center">
          <template slot-scope="scope">
            <el-form-item
              label-width="0"
              :prop="'tableData.'+scope.$index+'.scoreEnd'"
              :rules="[{ required: true, message: '最大值必填', trigger: 'change' },{ pattern: /^\d+$|^\d\.\d{1,2}$/, message: '请输入数字，支持2位小数' },{ validator: validatorMax(scope.row) }]"
            >
              <el-input v-model="scope.row.scoreEnd"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
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
    return {
      form: {
        tableData: merge(
          [
            { gradeName: "A", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
            { gradeName: "B", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
            { gradeName: "C", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
            { gradeName: "D", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
            { gradeName: "E", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
            // { gradeName: "N", gradeDesc: null, scoreBegin: null, scoreEnd: null, id: null, nid: null },
          ],
          this.defaultData
        ),
      },
    };
  },
  mounted() {
    if (this.rowId) {
      Api_EvaluateModelFourGet(this.rowId).then((res) => {
        res.length &&
          (this.form.tableData = res.map(({ gradeName, gradeDesc, scoreBegin, scoreEnd, id, nid }) => {
            return { gradeName, gradeDesc, scoreBegin, scoreEnd, id, nid };
          }));
      });
    }
  },
  methods: {
    validatorMin(row) {
      return (rule, value, callback) => {
        if (value) {
          if (row.scoreEnd && Number(value) > Number(row.scoreEnd)) {
            new Error(callback("最小值不能大于最大值"));
            return;
          }
          callback();
          return;
        }
        callback();
      };
    },
    validatorMax(row) {
      return (rule, value, callback) => {
        if (value) {
          if (row.scoreBegin && Number(value) < Number(row.scoreBegin)) {
            new Error(callback("最大值不能小于最小值"));
            return;
          }
          callback();
          return;
        }
        callback();
      };
    },
    editChange() {
      if (this.form.tableData.length) {
        return true;
      } else {
        return false;
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            Api_EvaluateModelFour(this.rowId, this.form.tableData)
              .then((res) => {
                resolve(this.form.tableData);
              })
              .catch((e) => {
                this.$message.error(e);
                reject(e);
              });
          } else {
            reject();
          }
        });
      });
    },
  },
};
</script>

<style>
</style>