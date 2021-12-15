<template>
  <div class="gqjg">
     <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">人力资源</span>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_humanQInfo"
        :query="listQuery"
        :columns="tableCol1"
        @onSuccessData="onSuccessData"
      >
      </TableWrapper>
    </el-row>
    <!-- 详情弹窗 -->
    <Dialog
      :visible.sync="visible"
      :onOk="handleSure"
      width="1150px"
      title="人力资源详情"
      append-to-body
      @close="onClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="8em" size="medium">
            <el-row>
              <el-col :span="6">
                  <el-form-item label="年度" prop="eyear">
                         <el-date-picker
                          v-model="form.eyear"
                          :disabled="isreadOnly"
                          type="date"
                          style="width:100%"
                          placeholder="选择日期">
                        </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="员工总数" prop="master">
                      <el-input v-model="form.master" :disabled="isreadOnly"> </el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="博士" prop="employeesNumber">
                      <el-input v-model="form.employeesNumber" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="硕士" prop="doctor">
                      <el-input v-model="form.doctor" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                  <el-form-item label="本科" prop="undergraduate">
                      <el-input v-model="form.undergraduate" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="大专及其他" prop="juniorCollegeOthers">
                      <el-input v-model="form.juniorCollegeOthers" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="管理人员" prop="management">
                      <el-input v-model="form.management" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="研发人员" prop="developmentPersonnel">
                      <el-input v-model="form.developmentPersonnel" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                  <el-form-item label="销售人员" prop="salesman">
                      <el-input v-model="form.salesman" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="高级职称技术" prop="seniorTitle">
                      <el-input v-model="form.seniorTitle" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="中高级以上职称" prop="mediumAdvancedLevel">
                      <el-input v-model="form.mediumAdvancedLevel" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="中级职称" prop="intermediate">
                      <el-input v-model="form.intermediate" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                  <el-form-item label="初级职称" prop="junior">
                      <el-input v-model="form.junior" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="留学生" prop="overseasStudent">
                      <el-input v-model="form.overseasStudent" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remarks">
                      <el-input type="textarea" v-model="form.remarks" resize='none' :disabled="isreadOnly"></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="相关附件">
                      <div>
                         
                      </div>
                  </el-form-item>
              </el-col>
            </el-row>
      </el-form>     
    </Dialog>







  </div>
</template>

<script type="text/jsx">
import {
  Api_humanQInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp2",
  props: {
    baseInfo: {
      type: Object,
      default: () => ({})
    },
    /**是不是只读 */
    isreadOnly:Boolean,
  },
  data() {
    
    const createRules = this.$createRules;
    return {
      /**详情弹窗隐藏 */
      visible: false,
      /**详情的form */
      form:{
        niandu:''  //年度
      },

      rules:{
         niandu:createRules({msg:'niandu',required:true})
      },
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId
      },

      tableCol1: [
        { label: "年度", key: "eyear" },
        { label: "员工总数", key: "master" },
        { label: "博士", key: "employeesNumber"},
        { label: "硕士", key: "doctor" },
        { label: "本科", key: "undergraduate" },
        { label: "大专及其他", key: "juniorCollegeOthers"},
       
        {
          label: "操作",
          key: null,
          render: (h, data, row) => {
              return [<el-link type="primary" onClick={this.openModal.bind(this, row)}> 详情 </el-link>
              ] 
          }
        }
      ]
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    Api_humanQInfo,
    getList() {
      this.$refs.table.fetchData();
    },

    onSuccessData(list){
     
    },
    /**查看详情 */
    openModal(row) {
      this.visible = true;
      this.form=this.$deepCopy(row);
    },

    /**关闭弹窗 */
    onClose() {
      this.$refs.form.resetFields();
    },

    /**弹窗确定 */
    handleSure() {
      this.$refs.form.resetFields();
      this.visible=false;
    },

    toogleExpand(row) {
      this.$refs.table.toogleExpand(row)
    }
  }
};
</script>

<style lang="scss">
.gqjg{
  .el-table__expand-icon{
    .el-icon.el-icon-arrow-right{
      display: none;
    }
  }
  
}

</style>
