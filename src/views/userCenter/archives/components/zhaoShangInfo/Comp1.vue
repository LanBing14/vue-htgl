<template>
  <div class="baseInfo-comp1">
    <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">招商信息</span>
    </h4>
    <el-row v-loading="comLoading"  element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
    
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="7em" size="medium">

          <el-row>
            <el-col :span="6">
              <el-form-item label="项目来源" prop="projectSource">
                  <el-input v-model="ruleForm.projectSource" :disabled="isreadOnly"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目经理" prop="projectManager">
                  <el-input v-model="ruleForm.projectManager"  :disabled="isreadOnly"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入驻日期" prop="projectManager">
                    <el-date-picker
                    :disabled="isreadOnly"
                    v-model="ruleForm.projectManager"
                    type="date"
                   >
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="户管企业" prop="householdEnterprise">
                  <el-input v-model="ruleForm.householdEnterprise"  :disabled="isreadOnly"></el-input>
              </el-form-item>
            </el-col>
          </el-row>  
          <el-row>
             <el-form-item label="招商需求" prop="attractInvestmentDemand">
                 <el-input type="textarea" :disabled="isreadOnly" v-model="ruleForm.attractInvestmentDemand" :rows="4" resize='none'></el-input>
              </el-form-item>
          </el-row>
          <el-row>
             <el-form-item label="重要备注" prop="remarks">
                 <el-input type="textarea" :disabled="isreadOnly" v-model="ruleForm.remarks" :rows="4" resize='none'></el-input>
              </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="附件" prop="qyly">
              
            </el-form-item>
          </el-row>
      </el-form>
    </el-row>

  </div>
</template>

<script>
 import {
  Api_investmentInformationInfoInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp2",
  
  props:{
    /**是不是只读 */
    isreadOnly:Boolean,
    id:String
  },
  data() {
     const createRules = this.$createRules;
    return {
        /** 基本信息loading*/
        comLoading:false,
        /**单位选项 */
         options: [
          {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        /**企业概况form */
        ruleForm: {
          companyName: ''
        },
        rules: {
         companyName:createRules({msg:'企业名称',required:true},'blur')
        },

        /**图片上传 */
         imageUrl: '',
        /**远程搜索 */
        restaurants: [],
        timeout:  null

    };
  },
  created() {
    this.getInfo()
  },
  mounted(){
   
  },
  methods: {
     
    getInfo(){
      this.comLoading=true;
      Api_investmentInformationInfoInfo(this.id).then((res)=>{
        this.ruleForm=this.$deepCopy(res);
        this.comLoading=false;
        this.ruleForm.householdEnterprise=this.ruleForm.householdEnterprise==0? '正常':this.ruleForm.householdEnterprise==1? '虚租,挂靠':''
      }).catch(err=>{
         this.$message.error(err);
         this.comLoading=false;
      })
    }


  }
};
</script>

<style lang="scss">
/**这里是上传样式 */
  .baseInfo-comp1{

    .el-upload{
      width:100%;
      height: 317px;
      background-color: #f7f8f9;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color:#2d8cf0;;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%;
      display: block;
    }

    .upload-main{
      padding: 32px 0 66px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;;
      .upload-title{
        	font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 14px;
          letter-spacing: 0px;
          color: #333333;
          padding-bottom: 35px;
      }

      .guihui{
        padding-bottom: 30px;
        padding-top: 11px;
      }
       .upload-content{
          width: 118px;
          height: 139px;
          margin-bottom:32px;
          background: url("./../../../../../assets/images/baseInfo/uploadBg.png");
          background-size:cover;
      }
      .upload-tips{
        	font-family: MicrosoftYaHei;
          font-size: 13px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 13px;
          letter-spacing: 0px;
          color: #999999;
      }
    }
   



  /** 所属载体样式*/
   .sszt-wrap{
     .el-autocomplete{
       width:100%;
     }
   }

  }
  


  

</style>


