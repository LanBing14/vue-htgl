<template>
    <div>
        <el-row class="credit-tab-content" v-loading="comLoading"   element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
            <h4 class="flex cp-title-wrap">
                <span class="flex-primary  cp-title">人才项目</span>
            </h4>
           <div class="rencai-item" v-for="(item,index) in arrList" :key="index">
               <div class="flexWrap flex-item">
                   <div class="flex-title">获批人才姓名：</div>
                   <div class="people-name">{{item.approvedTalentsName || '-'}}</div>
               </div>
               <div class="flexWrap flex-item">
                   <div class="flexWrap">
                       <div class="flex-title">国籍：</div>
                       <div class="flex-content">{{item.nationality || '-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">出生日期：</div>
                       <div class="flex-content">{{$dateFormat(item.birthDate) || '-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">证件信息：</div>
                       <div class="flex-content">{{item.certificateInformation || '-'}}</div>
                   </div>
               </div>
                <div class="flexWrap flex-item">
                   <div class="flexWrap">
                       <div class="flex-title">最高学历：</div>
                       <div class="flex-content">{{item.highestEducation=='specialty'? '专科':item.highestEducation=='undergraduate'? '本科':item.highestEducation=='master'? 'master':item.highestEducation=='doctor'? '博士':item.highestEducation=='postdoctor'? '博士后':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title"> 毕业院校：</div>
                       <div class="flex-content">{{item.graduateSchool || '-'}}</div>
                   </div>
                
               </div>
  
               <div class="flexWrap flex-item">
                   <div class="flexWrap">
                       <div class="flex-title">留学经历：</div>
                       <div class="flex-content"> {{item.isStudiedAbroad==0? '否':item.isStudiedAbroad==1? '是':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">留学国家：</div>
                       <div class="flex-content">{{item.studyAbroadCountry}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">留学学校：</div>
                       <div class="flex-content">{{item.studyAbroadSchool || '-'}}</div>
                   </div>
                   <div class="flexWrap">
                       <div class="flex-title">留学学历：</div>
                       <div class="flex-content">{{item.educationBackground=='specialty'? '专科':item.educationBackground=='undergraduate'? '本科':item.educationBackground=='master'? 'master':item.educationBackground=='doctor'? '博士':item.educationBackground=='postdoctor'? '博士后':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">持股比例：</div>
                       <div class="flex-content">{{$toMoney(item.shareholdingRatio) || '-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">认缴金额：</div>
                       <div class="flex-content">{{$toMoney(item.subscriptionAmount)}}</div>
                   </div>                   
               </div>

               <div class="flexWrap flex-item">
                   <div class="flexWrap">
                       <div class="flex-title">是否获取人才项目：</div>
                       <div class="flex-content"> {{item.isTalentProject==0? '否':item.isTalentProject==1? '是':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">获批年度：</div>
                       <div class="flex-content">{{item.approvedYear || '-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">获批层次：</div>
                       <div class="flex-content">{{item.approvalLevel=='country'? '国家':item.approvalLevel=='province'? '省':item.approvalLevel=='city'? '市':item.approvalLevel=='area'? '区':item.approvalLevel=='other'? '其他':'-'}}</div>
                   </div>
                   <div class="flexWrap">
                       <div class="flex-title">获批类型：</div>
                       <div class="flex-content">{{item.approvedType==0? '千人计划':item.approvedType==1? '万人计划':item.approvedType==2? '创新人才推进计划':item.approvedType==3? '省双创人才':item.approvedType==4? '省双创博士':item.approvedType==5? '省科技创新团队':item.approvedType==6? '姑苏领军人才':item.approvedType==7? '高新区领军人才':item.approvedType==8? '其他':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">项目名称：</div>
                       <div class="flex-content">{{item.projectName || '-'}}</div>
                   </div>
             
               </div>

               <div class="flexWrap flex-item">
                   <div class="flexWrap">
                       <div class="flex-title">项目类型：</div>
                       <div class="flex-content">  {{item.projectType==0? '创业':item.projectType==1? '创新':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">获批等级：</div>
                       <div class="flex-content">{{item.approvedGrade || '-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">获批金额：</div>
                       <div class="flex-content"> {{$toMoney(item.approvedAmount) || '-'}}</div>
                   </div>
                   <div class="flexWrap">
                       <div class="flex-title">验收情况：</div>
                       <div class="flex-content">{{item.acceptance==0? '通过':item.acceptance==1? '未通过':item.acceptance==2? '待验收':item.acceptance==3? '终止':item.acceptance==4? '未运作':'-'}}</div>
                   </div>
                    <div class="flexWrap">
                       <div class="flex-title">项目来源： </div>
                       <div class="flex-content">{{item.projectSource==0? '招商中心':item.projectSource==1? '指标内':'-'}}</div>
                   </div>
             
               </div>

               
               <div class="flexWrap2 flex-item">
                   <div class="flexWrap2">
                       <div class="flex-title"> 拨款情况：</div>
                       <div class="flex-content">
                          {{item.funding || '-'}}
                        </div>
                   </div>
               </div>

               <div class="flexWrap2 flex-item">
                   <div class="flexWrap2">
                       <div class="flex-title"> 备注：</div>
                       <div class="flex-content">
                           {{item.remarks || '-'}}
                        </div>
                   </div>
               </div>
               <div class="flexWrap2 flex-item">
                   <div class="flexWrap2">
                       <div class="flex-title"> 相关附件：</div>
                       <div class="flex-content">
                           <div>
                               -
                           </div>
                        </div>
                   </div>
               </div>


           </div>
           <!-- 暂无数据 -->
            <div class="noMessage" v-show="!arrList.length" style="text-align:center;">
                <el-image :src="require('../../../../../assets/images/bg/no.jpg')" style="width: 300px;height:280px;" ></el-image>
            </div>

        </el-row>
    </div>
</template>
<script>
import {
  Api_rencaiInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default{
    
    data(){
        return{
            arrList:[],
            comLoading:false
        }
    },
    created(){
        let id=this.$store.getters.userInfo.companyId;
        this.comLoading=true;
        Api_rencaiInfo({id}).then(res=>{
            this.comLoading=false;
            this.arrList=this.$deepCopy(res);
        }).catch(err => {
            this.comLoading=false;
            this.$message.error(err);
        });
    }
}
</script>
<style lang="scss" scoped>
 .name{
    font-size: 22px;
    margin-left: 18px;
}
.flexWrap{
    display:flex;
    margin-right: 40px;
    align-items:center;
    .flex-title{
        // width: 10em;
        min-width:5em;
        flex:0 0 auto;
        text-align: right;
    }
    .flex-content{
        //  margin-left: 18px;
    }
    .people-name{
        font-size: 22px;
        margin-left: 18px;
    }
}

.flexWrap2{
    display: flex;
    .flex-title{
        // width: 10em;
        min-width:5em;
        flex:0 0 auto;
        text-align: right;
    }
    .flex-content{

    }
}

.flex-item{
    margin-bottom: 20px;
}

.rencai-item{
    border: solid 1px #dcdfe6;
    line-height: 26px;
    padding: 30px 30px 20px 30px;
    margin-bottom: 30px;
}
</style>