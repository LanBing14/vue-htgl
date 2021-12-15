<template>
    <div class="dialogRisk">
        <div class="dialogRisk-register" >
            <div class="close-wrap"  @click="hideModel" style="cursor:pointer">
                <span>
                   <i class="el-dialog__close el-icon el-icon-close"></i>
               </span>
            </div>
                <div  class="dialogRisk-wrap">
                <p class="title" style="color: #333">恭喜注册成功 !</p>
                <p class="infotext" style="line-height：25px">您可以对您的企业进行认证，通过 <span style="color: #000">企业认证</span> ，
                    平台将免费为你提供 <span  style="color: #000">风险体检</span> ，帮助您获取当前最新的风险信息，同时为您提供更多服务，帮助您更好的管理信用风险</p>
                <div class="btn" style="margin-top: 22px">
                    <span class="goExamination"  style="cursor: pointer;" @click="goAuth">去认证</span>
                    <span class="fullInfo"  style="cursor: pointer;" @click="nextAuth">暂不认证</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {
    getToken,
    getUserInfo
} from '../../utils/auth';
    import {
  Api_CheckCompany,
} from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_getCreditScore } from "@/api/advanceSearch";
    export default {
        props:{
           
        },
        data(){
           return {
            regSuccess: false,
           }
        },
        computed: {
            userInfo () {
                return this.$store.getters.userInfo.saasName;
            },
        },
        created() {
           
        },
        methods: {
            hideModel(){
                this.$emit('hideModel', false)
            },
            nextAuth(){
                this.$emit('chageSuccess', true)
            },
            goAuth(){
                this.$router.push({path: '/enterpriseCertification', query:{ title :'register',name: this.userInfo }});
            }
        }
    }
</script>
<style scoped lang="scss">
.dialogRisk {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
    &.show {
        display: block;
    }
  }
  .infowarn {
      color: #fcab6a;
  }
 .close-wrap {
     position: absolute;
        right: 10px;
        top: 0;
        z-index: 999;
      span {
        // padding: 10px;
        // display: inline-block;   
        display: inline-block;
        padding-top: 24px;
        padding-right: 22px;

        i {
          font-size: 15px;
          color: #9b9fa4;
        }
      }
  }
  .dialogRisk-register{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 106px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    background: #fff url(../../assets/images/bg/zc1BG.png) no-repeat center;
      .infotext {
        font-size: 16px;
        color: #999;
        line-height: 22px;
      }
  }
.common {
    color:  $--color-primary ;
}

.title {
    font-size: 30px;
    margin-bottom: 21px;
    color: #333;
    }
.info {
    font-size: 16px;
    color: #999;

}
.goExamination{
    width: 200px;
    height: 60px;
    line-height: 60px;
    font-size: 25px;
    margin-right: 20px;
    text-align: center;
    display: inline-block;
    border-radius: 43px;
    cursor: pointer;
    border: 1px solid $--color-primary ;
    background-color: $--color-primary ;
    color: #ffffff;
}

.fullInfo {
    font-size: 20px;
    color:  $--color-primary;
    font-weight: 500;
    cursor: pointer;
}
.info1 {
    line-height:23px;
    font-size: 16px;
    color: #999;
}
.dialogRisk-company{
    width: 900px;
    height: 480px;
    margin: 100px auto;
    padding: 95px 120px 0 106px;
    background-color: #fff;
    background: #fff url(../../assets/images/bg/zc2BG.png) no-repeat center;
    border-radius: 10px;
    position: relative;
    
}

</style>