<template>
  <div class="gqjg">
     <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">股权结构</span>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_guQInfo"
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
      width="1000px"
      title="股权结构详情"
      append-to-body
      @close="onClose"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="7em" size="medium">
            <el-row>
              <el-col :span="6">
                  <el-form-item label="股东名称" prop="shareholderName">
                      <el-input v-model="form.shareholderName" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="20">
                      <el-form-item label="股东比例" prop="shareholdersProportion">
                          <el-input v-model="form.shareholdersProportion" :disabled="isreadOnly"></el-input>
                      </el-form-item>
                  </el-col>
                   <el-col :span="4" style="text-align:center;line-height:36px">
                     %
                  </el-col>
                </el-row>
                  
              </el-col>
              <el-col :span="6">
                  <el-form-item label="出资金额" prop="contributionAmount">
                      <el-input v-model="form.contributionAmount" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="6">
                  <el-form-item label="出资形式" prop="contributionForm">
                      <el-input v-model="form.contributionForm" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                  <el-form-item label="股东背景" prop="shareholdersBackground">
                      <el-input type="textarea" v-model="form.shareholdersBackground" resize='none' :disabled="isreadOnly"></el-input>
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
  Api_guQInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp3",
  props: {
    /**是不是只读 */
    isreadOnly:Boolean,
  },
  data() {
    
    const createRules = this.$createRules;
    return {
      /**详情弹窗隐藏 */
      visible: false,
      /**详情的form */
      form:{},

      rules:{
         gdmc:createRules({msg:'股东名称',required:true},'blur')
      },
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId
      },

      tableCol1: [
        { label: "股东名称", key: "shareholderName" },
        { label: "股东比例（%）", key: "shareholdersProportion" },
        { label: "出资金额（万元）", key: "contributionAmount"},
        { 
          label: "出资形式", 
          key: "contributionForm",
          render:(h,data,row)=>{
              return (
                data==0? '货币':data==1? '实物':data==2? '知识产权':data==3? '土地使用权':''
              )
          }
        },
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
    Api_guQInfo,
    getList() {
      this.$refs.table.fetchData();
    },


    /**查看详情 */
    openModal(row) {
      this.visible = true;
      this.form=this.$deepCopy(row);
      this.form.contributionForm=this.form.contributionForm==0? '货币':this.form.contributionForm==1? '实物':this.form.contributionForm==2? '知识产权':this.form.contributionForm==3? '土地使用权':''

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
    // 表格加载数据成功后
    onSuccessData(list, totalRecordNumber) {
  
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
