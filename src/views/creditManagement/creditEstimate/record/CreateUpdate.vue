<template>
  <Dialog title="创建评估记录" :visible.sync="visible" :onOk="handleSure" width="500px" class="size-btn-change" @close="onClose">
    <el-form ref="form" :model="formData" :rules="formRules" label-width="6em">
      <el-form-item label="评估模型">
        <el-input v-model="modelName" disabled></el-input>
      </el-form-item>
      <el-form-item label="评估人员" prop="evaluateId">
        <el-select v-model="formData.evaluateId" placeholder="评估人员" style="width: 100%">
          <el-option v-for="item in personOptions" :key="item.id" :label="item.name || item.username" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评估范围" prop="radio" v-show="false">
        <el-radio-group v-model="formData.radio">
          <!-- <el-radio label="1">全部客户</el-radio> -->
          <!-- <el-radio label="2">按企业分组</el-radio> -->
          <el-radio label="3">指定客户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.radio==='2'" label="企业分组" prop="groupId">
        <el-radio-group v-model="formData.groupId">
          <el-radio v-for="(el, index) in companyGroup" :key="index" :label="el.id">{{ el.group_name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.radio==='3'">
        <el-form-item label="客户名称" prop="companyId" :rules="$createRules({required:true,msg:'客户名称'})">
          <el-select
            v-model="formData.companyId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入企业名称关键词"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            style="width: 100%;"
          >
            <el-option
              v-for="item in options"
              :key="item.customer_id"
              :label="item.company_name"
              :value="item.customer_id"
              @click.native="selectChange(item.customer_id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="company">
          <ul class="list">
            <li v-for="(el,index) in formData.company" :key="index" class="flex">
              <span class="flex-primary">{{ el.company_name }}</span>
              <el-button type="text" @click="delRow(index)" >删除</el-button>
            </li>
          </ul>
        </el-form-item>
      </template>
    </el-form>
  </Dialog>
</template>

<script>
import { merge } from "lodash";
import { Api_EvaluateRecordAddition } from "@/api/creditManagement/creditEstimate/record";
import { Api_SearchCompany } from "@/api/creditManagement/customerProfile/customerManagement";
import { Api_CustomerGetCustomerList, Api_RecordUser } from "@/api/creditManagement/index";

export default {
  name: "CreateUpdate",
  props: {
    companyGroup: Array, // 企业分组
  },
  data() {
    return {
      visible: false,
      modelName: "",
      formData: {
        evaluateId: "", // 评估人员id
        evaluateName: "", // 评估人员姓名
        company: [], // 拟评估客户
        radio: "3",
        companyId: null,
      },
      formRules: { evaluateId: [{ required: true, message: "评估人员必选" }] },
      selectLoading: false,
      options: [],
      personOptions: [], // 评估人员下拉框数据
    };
  },
  created() {
    Api_RecordUser().then((res) => {
      this.personOptions = res;
    });
  },
  methods: {
    Api_SearchCompany,
    open(modelName) {
      this.modelName = modelName;
      this.visible = true;
    },
    handleSure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const postData = merge({}, this.formData);
          postData.evaluateName = this.personOptions.find((item) => item.id === postData.evaluateId).username;
          if (postData.radio === "3") {
            postData.groupId = "";
            postData.company = postData.company.map(({ company_name, customer_id }) => ({
              companyName: company_name,
              companyId: customer_id,
            }));
          } else if (postData.radio === "2") {
            postData.company = [];
          } else {
            postData.groupId = "";
            postData.company = [];
          }
          if (postData.hasOwnProperty("companyId")) {
            delete postData.companyId;
          }
          delete postData.radio;
          const loading = this.$openLoading();
          Api_EvaluateRecordAddition(postData)
            .then((res) => {
              // res为true表示成功添加，res为中文信息表示添加失败
              if (res === true) {
                this.$message.success("创建成功");
                this.$emit("getList");
                this.visible = false;
              } else {
                this.$message.error(res);
              }
              loading.close();
            })
            .catch((e) => {
              this.$message.error(e);
              loading.close();
            });
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.selectLoading = true;
        Api_CustomerGetCustomerList(query).then((res) => {
          this.selectLoading = false;
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
    selectChange(val) {
      // 查找是否已存在“拟评估客户”中
      const findResYes = this.formData.company.find((item) => item.customer_id === val);
      if (findResYes) {
        return;
      }
      if (this.formData.company.length > 10) {
        this.$message.warning("最多添加10个拟评估客户");
        return;
      }
      const findResNew = this.options.find((item) => item.customer_id === val);
      this.formData.company.push(Object.assign({}, findResNew));
    },
    delRow(index) {
      this.formData.company.splice(index, 1);
    },
    onClose() {
      this.$refs.form.resetFields();
      this.options = [];
      this.modelName = "";
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  li + li {
    border-top: 1px dotted #e4e7ed;
  }
}

.el-radio-group {
  .el-radio {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
