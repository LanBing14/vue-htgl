<template>
  <div>
    <div class="page-header">
      <h1 class="page-name">
        <span>特殊发货处理审批</span>
      </h1>
      <div>
        <el-button @click="back">返回</el-button>
      </div>
    </div>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="客户名称">
          <span class="canClick" @click="$gotoCustomerDetail(form.companyId)">{{ form.companyName }}</span>
        </el-form-item>
        <EnterpriseFile :enterpriseID="form.companyId"></EnterpriseFile>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="订单名称">
          <span
            class="canClick"
            @click="$gotoOrderDetail(form.contractId)"
          >{{ form.contractCode }}/{{ form.contractName }}</span>
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="限制措施">
          {{form.badCustomer?((form.badCustomer.isCredit ? ["停止赊销"] : [])
          .concat(form.badCustomer.isSend ? ["停止发货"] : [])
          .concat(form.badCustomer.isWork ? ["停止签约"] : [])
          .join(",")):'-'}}
        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item
          label="列入原因"
        >{{(form.badCustomer?form.badCustomer.reasons.map(item => item.reason).join(","):'-')}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="申请理由">{{form.remark||'-'}}</el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-form-item label="附件上传">
          <!-- <div v-if="form.files&&form.files.length" class="demo-image__preview">
            <el-image
              v-for="(item, index) in form.files"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 6px"
              :src="item.url"
              :preview-src-list="form.files"
            ></el-image>
          </div>
          <span v-else>无</span> -->

           <ImgView :urls="form.files"></ImgView>



        </el-form-item>
        <el-divider class="detail-divider"></el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="当前状态">
              {{form.state === "1"
              ? "待提交"
              : form.state === "2"
              ? "待审批"
              : form.state === "3"
              ? "审批通过"
              : form.state === "4"
              ? "审批驳回"
              : "-"}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人">{{form.headName||'-'}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间">{{form.createDate?form.createDate.substr(0,10):'-'}}</el-form-item>
          </el-col>
        </el-row>
        <el-divider class="detail-divider"></el-divider>
      </el-form>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import EnterpriseFile from "@/components/EnterpriseFile/index.vue";
import { Api_specialSendDetail } from "@/api/creditManagement/shippingManagement/overstayShipment.js";
import ImgView from "@/components/ImgView"
export default {
  name: "SpecialSend",
  components: { EnterpriseFile,ImgView },
  props: {
    modelStatus: Boolean,
    row: Object
  },
  data() {
    return {
      form: {}
    };
  },
  mounted() {
    const loading = this.$openLoading();
    Api_specialSendDetail(this.row.business_key)
      .then(res => {
        this.form = res;
        loading.close();
      })
      .catch(res => {
        loading.close();
      });
  },
  methods: {
    back() {
      this.$emit("edit", false);
    }
  }
};
</script>

<style>
</style>