<template>
  <!--    项目信息-->
  <div>
    <el-form ref="form" :model="formData" :rules="formRules" label-width="8em">
      <el-form-item label="起止时间" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="截止时间"
          value-format="yyyy-MM"
        ></el-date-picker>

      </el-form-item>
      <el-form-item v-show="false" prop="beginDate"></el-form-item>
      <el-form-item v-show="false" prop="endDate"></el-form-item>
      <el-form-item prop="projectName" label="项目名称">
        <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item prop="peopleNum" label="项目人员总数">
        <el-input v-model="formData.peopleNum" placeholder="请输入项目人员总数">
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="totalSalary" label="薪酬总额">
        <el-input v-model="formData.totalSalary" placeholder="请输入薪酬总额">
          <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="turnoverRate" label="流动率">
        <el-input v-model="formData.turnoverRate" placeholder="请输入流动率">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement";

export default {
  name: "Comp71",
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
        date: '', //所有的时间
        beginDate: "", // 项目开始时间
        endDate: "", // 项目结束时间
        projectName: "", // 	项目名称
        peopleNum: "", // 	项目人员总数
        totalSalary: "", // 	薪酬总额
        turnoverRate: "" // 	流动率
      },
      formRules: {
        date: createRules({
          msg: "项目时间",
          required: true
        }),
        projectName: createRules({
          msg: "项目名称",
          required: true,
          max: 40
        }),
        peopleNum: createRules({
          msg: "项目人员总数",
          required: true,
          cipint0: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("项目人员总数必填"));
              return;
            }
            if (Number(value) > 10000) {
              callback(new Error("项目人员总数不能大于1万"));
            } else {
              callback();
            }
          }
        }),
        totalSalary: createRules({
          msg: "薪酬总额",
          required: true,
          numberFloatUp: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("薪酬总额必填"));
              return;
            }
            if (Number(value) > 1000000000) {
              callback(new Error("薪酬总额不能大于10亿"));
            } else {
              callback();
            }
          }
        }),
        turnoverRate: createRules({
          msg: "流动率",
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error("流动率必填"));
              return;
            }
            if (Number(value) < 0 || Number(value) > 100) {
              callback(new Error("请输入0-100之间的数字"));
            } else {
              callback();
            }
          }
        })
      },
      pickerOptions: {
          shortcuts: [{
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [new Date(), new Date()]);
            }
          }, {
            text: '今年至今',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), 0);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 6);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
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
        if(data['endDate']&&data['beginDate']){
          this.formData.date=[data['beginDate'],data['endDate']]
        }

      // console.log('看看' ,this.formData);
      // console.log('看看传过来的data',data);
      // this.date = [data.beginDate, data.endDate];
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              // ...this.formData,
              projectName: this.formData.projectName, // 	项目名称
              peopleNum: this.formData.peopleNum, // 	项目人员总数
              totalSalary: this.formData.totalSalary, // 	薪酬总额
              turnoverRate: this.formData.turnoverRate, // 	流动率
              id: this.data.id,
              beginDate: this.formData.date ? this.formData.date[0] : "", // 项目开始时间
              endDate: this.formData.date ? this.formData.date[1] : "", // 项目结束时间
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
      this.date = null;
    }
  }
};
</script>

<style scoped>
.el-date-editor.el-range-editor {
  width: 100%;
}
</style>
