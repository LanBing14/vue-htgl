<template>
  <div>
    <h4 class="flex">
      <span class="flex-primary">基本信息</span>
      <el-button size="mini" @click="open" v-if="!isFxb">{{ companyInfo.id ? '编辑' : '新增' }}</el-button>
    </h4>
    <el-row v-loading="comLoading"  element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
      <table border="0" cellpadding="0" cellspacing="0" class="fxb-info-table">
        <tr>
          <th>企业名称</th>
          <td colspan="3">{{ companyInfo.companyName }}</td>
        </tr>
        <tr>
          <th>统一信用代码/注册号</th>
          <td colspan="3">{{ companyInfo.creditCode }}</td>
        </tr>
        <tr>
          <th>成立日期</th>
          <td>{{ $dateFormat(companyInfo.termStart) }}</td>
          <th>最新登记日期</th>
          <td>{{ $dateFormat(companyInfo.checkDate) }}</td>
        </tr>
        <tr>
          <th>注册资本</th>
          <td>{{ companyInfo.registCapi !== null ? companyInfo.registCapi : '-' }}</td>
          <th>法定代表人</th>
          <td>{{ companyInfo.operName !== null ? companyInfo.operName : '-' }}</td>
        </tr>
        <tr>
          <th>企业类型</th>
          <td colspan="3">{{ companyInfo.econKind !== null ? companyInfo.econKind : '-' }}</td>
          <!-- <th>是否为纳税信用A级</th> -->
          <!-- <td>下载报告可见</td> -->
          <!-- <th></th> -->
          <!-- <td></td> -->
        </tr>
        <tr>
          <th>登记状态</th>
          <td>{{ companyInfo.status !== null ? companyInfo.status : '-' }}</td>
          <th>登记机关</th>
          <td>{{ companyInfo.belongOrg !== null ? companyInfo.belongOrg : '-' }}</td>
        </tr>
        <tr>
          <th>注册地址</th>
          <td colspan="3">{{ companyInfo.address !== null ? companyInfo.address : '-' }}</td>
        </tr>
        <tr>
          <th>经营范围</th>
          <td colspan="3">{{ companyInfo.scope !== null ? companyInfo.scope : '-' }}</td>
        </tr>
        <tr>
          <th>企业网站</th>
          <td colspan="3">
            <a :href="'http://' + companyInfo.website" target="_blank">{{ companyInfo.website }}</a>
          </td>
        </tr>
      </table>
    </el-row>
    <Dialog
      :title="companyInfo.id ? '修改基本信息': '新增基本信息'"
      :visible.sync="visible"
      :onOk="handleSure"
      append-to-body
      width="500px"
      @close="onClose"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="11em"
        label-position="right"
      >
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="formData.companyName"></el-input>
        </el-form-item>
        <el-form-item label="统一信用代码/注册号" prop="creditCode">
          <el-input v-model="formData.creditCode"></el-input>
        </el-form-item>
        <el-form-item label="成立日期" prop="termStart">
          <el-date-picker
            type="date"
            v-model="formData.termStart"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="最新登记日期" prop="checkDate">
          <el-date-picker
            type="date"
            v-model="formData.checkDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="注册资本" prop="registCapi">
          <el-input v-model="formData.registCapi"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="operName">
          <el-input v-model="formData.operName"></el-input>
        </el-form-item>
        <el-form-item label="企业类型" prop="econKind">
          <el-input v-model="formData.econKind"></el-input>
        </el-form-item>
        <el-form-item label="登记状态" prop="status">
          <el-input v-model="formData.status"></el-input>
        </el-form-item>
        <el-form-item label="登记机关" prop="belongOrg">
          <el-input v-model="formData.belongOrg"></el-input>
        </el-form-item>
        <el-form-item label="注册地址" prop="address">
          <el-input v-model="formData.address" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="经营范围" prop="scope">
          <el-input v-model="formData.scope"></el-input>
        </el-form-item>
        <el-form-item label="企业网站" prop="website">
          <el-input v-model="formData.website"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import {
  Api_CustomerArchivesGetCompanyInfo,
  Api_CustomerArchivesCompanyInfoAdd,
  Api_CustomerArchivesCompanyInfoUpdate
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp1",
  props:{
    isFxb:Boolean
  },
  data() {
    const createRules = this.$createRules;
    return {
      visible: false,
      comLoading: false,
      companyInfo: {},
      formData: {
        companyId: this.$store.getters.userInfo.companyId,
        companyName:'',
        creditCode: "",
        termStart: "",
        checkDate: "",
        registCapi: "",
        operName: "",
        econKind: "",
        status: "",
        belongOrg: "",
        address: "",
        scope: "",
        website: ""
      },
      formRules: {
        companyName: createRules({
          msg: "企业名称",
          required: true
        })
      }
    };
  },
  created() {
    this.getDetail();
  },
  methods: {

    open() {
      this.visible = true;
      if (this.companyInfo.id) {
        Object.keys(this.formData).forEach(key => {
          this.formData[key] = this.companyInfo[key];
        });
      }
    },
    getDetail() {
      this.comLoading = true;
      Api_CustomerArchivesGetCompanyInfo(this.formData.companyId)
        .then(res => {
          this.companyInfo = res;
          this.comLoading = false;
          this.$emit("updateBaseInfo", { ...res });
        })
        .catch(() => {
          this.comLoading = false;
        });
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const id = this.companyInfo.id;
        const postData = {
          ...this.formData,
          saasCode: this.$store.getters.saasCode
        };
        const loading = this.$openLoading();
        const promiseRes = !id
          ? Api_CustomerArchivesCompanyInfoAdd(
              this.formData.companyId,
              postData
            )
          : Api_CustomerArchivesCompanyInfoUpdate(id, this.formData.companyId, {
              ...postData,
              version: this.companyInfo.version
            });
        promiseRes
          .then(res => {
            loading.close();
            this.getDetail();
            this.visible = false;
            this.$message.success(res);
            this.onClose();
          })
          .catch(e => {
            loading.close();
            this.$message.error(e);
          });
      });
    },
    onClose() {
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
