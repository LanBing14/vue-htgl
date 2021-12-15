<template>
  <el-container style="background:#fff">
    <el-header>
      <FxbHeader @reload="reload" />
    </el-header>
    <!-- 拖拽上传主体区域 -->
    <div class="main-bg">
      <el-main>
        <div class="upload">
          <div class="uploadFont">批量查询</div>
          <div class="main-upload">
            <el-upload
              class="upload-demo"
              ref="reUpload"
              :disabled="isClickDownLoad"
              :headers="uploadHeaders"
              name="excelFile"
              drag
              :limit="1"
              :on-progress="showLoading"
              :on-error="closeLoading"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              :on-success="handleUploadSuccess"
              :action="baseUrl+fxb+'/enterprise-search/excel-batchSearch'"
              multiple
            >
              <img src="../../assets/images/checkAll/fileIcon.png" alt class="imgIcon" />
              <div class="el-upload__text">
                <div style="margin-bottom:14px;">点击或将文件（xls、xlsx）拖拽至此处</div>
                <div>
                  <a  :href="baseUrl+fxb+'/enterprise-search/download'" @click="downLoadModel" class="downLoadModel">下载模板</a>
                </div>
                <div>
                  <el-button type="primary" style="width:134px;margin-top:13px">点击上传</el-button>
                </div>
              </div>
              <div class="el-upload__tip" slot="tip">
                <div>下载模板并填充企业名录信息</div>
                <div>上传文件不超过2M，仅支持Excel（xls、xlsx）文件</div>
                <div>单次查询企业数量不能超过200家</div>
              </div>
            </el-upload>
          </div>
        </div>
      </el-main>
    </div>
    <div class="main-bottom">
      <el-main>
        <div class="bottomTips">
          <ul class="bottomTipsWrap">
            <li class="oneStep" style="text-align:center">
              <img style="height:87px" src="../../assets/images/checkAll/oneStep.png" alt />
              <div class="fTitle">第 1 步</div>
              <div class="smallTitle">下载模板文件</div>
            </li>
            <li class="twoStep" style="text-align:center">
              <img style="height:87px" src="../../assets/images/checkAll/twoStep.png" alt />
              <div class="fTitle">第 2 步</div>
              <div class="smallTitle">上传文件进行查询</div>
            </li>
            <li class="threeStep" style="text-align:center">
              <img style="height:87px" src="../../assets/images/checkAll/threeStep.png" alt />
              <div class="fTitle">第 3 步</div>
              <div class="smallTitle">导出查询结果</div>
            </li>
            <img src="../../assets/images/checkAll/arrow.png" class="oneArrow arrow" />
            <img src="../../assets/images/checkAll/arrow.png" class="twoArrow arrow" />
          </ul>
        </div>
      </el-main>
    </div>
    <el-footer>
      <FxbFooter />
    </el-footer>
    <OpenVip ref="ref_OpenVip"></OpenVip>
  </el-container>
</template>

<script>
import { isString } from "lodash";
import { getToken } from "@/utils/auth";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import OpenVip from "@/views/userCenter/vipCenter/OpenVip.vue";
import { Api_versionProducts } from "@/api/userCenter/vip.js";
import { downloadModel } from "@/api/checkAll/checkAll.js";
import { fxb } from "@/utils/variables";
export default {
  name: "Buy",
  components: {
    FxbHeader,
    FxbFooter,
    OpenVip
  },
  data() {
    return {
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,  //地址
      loading:'',
      // 文件导入
      uploadHeaders: { Authorization: "Bearer" + getToken() },
      isRouterAlive: true,
      isClickDownLoad: false // 点击的是不是下载按钮，是的话不执行上传
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
    style() {
      if (this.isHeaderFixed) {
        return {
          left: this.headerLeft + "px",
          width: this.headerWidth + "px"
        };
      } else {
        return null;
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, false);
  },
  beforeDestory() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    // 下载模板
    downLoadModel() {
      // 下载模板的时候不弹出选择上传文件的弹窗
      this.isClickDownLoad = true;
      // 下载完成之后可以上传文件
      setTimeout(()=>{
        this.isClickDownLoad=false;
      },500)
    },

    //  上传过程中显示loading
   showLoading(){
      this.loading=this.$openLoading();
   },
   // 上传失败关闭loading
    closeLoading(){
       this.loading.close();
    },
    //  上传成功之后的返回值
    handleUploadSuccess(res) {
      
      //上传成功之后清空文件列表
      this.$refs.reUpload.clearFiles()
      // 上传成功后loading关闭
      setTimeout(()=>{
         this.loading.close();
         //  若是成功了,跳转到结果页面
         if(res.success===true && res.data.length>0){
           var dataToString=JSON.stringify(res.data);
          // //  跳转到结果页面
          // this.$router.push({
          //   name:'checkAllResults',
          //   params:{
          //     data:encodeURIComponent(dataToString)
          //   }
          // })

          /*  将数据保存在session中*/
          sessionStorage.setItem(this.userInfo.id+'batchQuery',dataToString);
          this.$router.push({
            name:'checkAllResults'
          })
         }else{
            this.$message.error(res.error);
         }
      },400)
    },

    handleExceed(files, fileList) {
      this.$message.warning(`只能上传1个文件！`);
    },

    //  上传之前做限制
    beforeUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 2;
 
 
        if(!extension && !extension2) {
          this.$message.error('只能上传 XLS 或 xlsx 格式');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传文件不能超过 2MB!');
        }
        return (extension || extension2) && isLt2M
    },
  
    isString,
    onScroll() {
      const scrollTop = window.scrollY;
      this.isHeaderFixed = scrollTop >= this.headerTop;
    },
    toLogin() {
      if (this.userInfo.id) {
        // 已 登录
        this.$message.info("您已登录风信标全面风险管理平台");
      } else {
        // 去 登录
        this.$login.register();
      }
    },
    otherLogin() {
      this.visible = true;
    },
    gotoVip(tag) {
      if (!this.$store.getters.userInfo.id) {
        this.$login.login();
      } else {
        this.$refs.ref_OpenVip.open(tag);
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  }
};
</script>

<style scoped lang="scss">
.main-bg {
  height: 465px;
  width: 100%;
  background-image: url("../../assets/images/checkAll/checkAllBg.png");
  background-repeat:no-repeat;
  background-size: cover;
  .upload {
    width: 880px;
    margin: 0 auto;
    .uploadFont {
      color: #ffffff;
      font-size: 26px;
      font-family: "微软雅黑";
      padding-bottom: 20px;
    }
  }
}

.bottomTipsWrap {
  display: flex;
  justify-content: space-between;
  width: 770px;
  margin: 0 auto;
  position: relative;
  .arrow {
    position: absolute;
    top: 80px;
    width: 46px;
    height: 23px;
  }
  .oneArrow {
    left: 194px;
  }
  .twoArrow {
    right: 194px;
  }
}

.fTitle {
  color: #888888;
  font-size: 14px;
  padding-top: 18px;
}

.smallTitle {
  font-size: 18px;
  font-family: "微软雅黑";
  color: #333;
  line-height: 18px;
  padding-top: 12px;
}

.bottomTipsWrap {
  padding-top: 50px;
  padding-bottom: 44px;
}
</style>
<style lang="scss">
.main-upload {
  .el-upload-dragger {
    width: 880px;
    background-image: url("../../assets/images/checkAll/uploadBg.png");
    background-repeat: no-repeat;
    height: 287px;
  }
  .imgIcon {
    padding-top: 55px;
    padding-bottom: 43px;
  }
  // 下载文字
  .downLoadModel {
    color: #4b9df3;
    font-size: 14px;
    font-family: "微软雅黑";
  }
  .el-upload__tip {
    display: flex;
    font-size: 13px;
    font-family: "微软雅黑";
    color: #fff;
    padding-top: 18px;
    justify-content: space-around;
  }

  .el-upload-dragger{
    border:none;
  }
}

.main-bottom{
  overflow: hidden;
  height:calc(100vh - 575px);
  @media screen and (max-height: 860px){
    height: 285px;
  }
}
</style>


