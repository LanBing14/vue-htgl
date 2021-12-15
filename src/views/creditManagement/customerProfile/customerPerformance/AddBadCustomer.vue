<template>
  <Dialog
    ref="drawer"
    title="列入不良客户"
    :visible.sync="visible"
    :onOk="addBadCustomer"
    @close="closeDialog"
    width="500px"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="客户编码">{{ customerNum }}</el-form-item>
      <el-form-item label="客户名称">{{ customerName }}</el-form-item>
      <el-form-item label="申请理由" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入客户不良情况描述及原因分析" />
      </el-form-item>
      <el-form-item label="列入原因" prop="btl" :rules="$createRules({required:true,msg:'列入原因'})">
        <el-select v-model="form.btl" style="width: 100%" multiple placeholder="请选择列入原因">
          <el-option v-for="item in badTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限制措施">
        <el-checkbox-group v-model="form.isCredit">
          <el-checkbox label="true">停止赊销</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.isSend">
          <el-checkbox label="true">停止发货</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.isWork">
          <el-checkbox label="true">停止签约</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="处理详情" prop="dealRemark">
        <el-input v-model="form.dealRemark" type="textarea" placeholder="请输入详细处理措施描述" />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script>
import { Api_AddBadCustomer } from "@/api/creditManagement/customerProfile/customerPerformance.js";

export default {
  name: "AddBadCustomer",
  data() {
    return {
      visible: false,
     
      customerNum: "",
      customerName: "",
     
      rowData: {},
      form: {
        remark: "",
        btl: [],
        badType: "",
        isCredit: false,
        isSend: false,
        isWork: false,
        dealRemark: ""
      },
      badTypeOptions: [
        { label: "一年以上没有与本公司交易者", value: "0" },
        { label: "拖欠货款逾期一年且无意归还者", value: "1" },
        { label: "破产、倒闭、经营严重亏损者", value: "2" },
        { label: "有严重违反国家法律法规行为，或不正当经营者", value: "3" },
        { label: "其他有严重损坏本公司形象、业务情形者", value: "4" }
      ],
      badTypeLists: [],
      rules: {
        remark: [{ required: true, message: "请输入不良情况", trigger: "change" }],
        badType: [{ required: true, message: "请选择不良种类", trigger: "change" }],
        dealRemark: [{ message: "请输入详细处理措施描述,不超过200字", max: 200, trigger: "change" }]
      }
    };
  },
  methods: {
    open(row) {
   
      this.rowData = row;
      this.customerNum = row.customerNo;
      this.customerName = row.companyName;
      this.visible = true;
     
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.form.isCredit=false;
      this.form.isSend=false;
      this.form.isWork=false;
      this.visible = false;

    },
    addBadCustomer() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const loading = this.$openLoading();
          // 整理 badTypeLists
          this.badTypeLists = [];
          for (let i = 0; i < this.form.btl.length; i++) {
            this.badTypeLists = this.badTypeLists.concat(
              this.badTypeOptions.filter(item => item.value === this.form.btl[i])
            );
          }
          Api_AddBadCustomer(this.rowData.id, {
            customerId: this.rowData.customerId,
            companyId: this.rowData.companyId,
            customerName: this.rowData.companyName,
            remark: this.form.remark,
            badTypeLists: this.badTypeLists.map(item => ({
              badType: item.label,
              badTypeCode: item.value
            })),
            isWork: this.form.isWork,
            isCredit: this.form.isCredit,
            isSend: this.form.isSend,
            dealRemark: this.form.dealRemark
          })
            .then(data => {
             
              this.$message({
                  dangerouslyUseHTMLString: true,
                  message:data,
                  type: 'success'
                });
              loading.close();
             
              

              this.$refs.form.resetFields();
              this.form.isCredit=false;
              this.form.isSend=false;
              this.form.isWork=false;
 
              this.visible = false;
              this.$emit("getList");
            })
            .catch(data => {
              console.log(data);
              this.$message.error(data);
            });
        }
      });
    },
    changeBadType(vv) {
      this.form.badType = this.badTypeOptions.filter(item => item.value === vv)[0].label;
    }
  }
};
</script>

<style scoped>
</style>
