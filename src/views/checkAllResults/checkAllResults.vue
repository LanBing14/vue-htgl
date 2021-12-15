<template>
  <el-container style="background:#f7f8fa">
    <el-header>
      <FxbHeader @reload="reload" />
    </el-header>
    <el-main>
      <div class="checkResultShow" v-if="userInfo.id">
        <div class="left">
          <div   :class="[isActive==1?'activeBg':'','tips','failTip']"       @click="allBtn">所有数据({{totalData.length}})</div>
          <div  :class="[isActive==2?'activeBg':'','tips','successTip']"    @click="successBtn">匹配成功({{successData.length}})</div>
          <div  :class="[isActive==3?'activeBg':'','tips','failTip']"    @click="failBtn">匹配失败({{failData.length}})</div>
        </div>
        <div class="right">
          <el-upload
            ref="reUpload"
            class="upload-demo"
            :headers="uploadHeaders"
            name="excelFile"
            style="display:inline-block;padding-right:10px;position:relative"
            :action="baseUrl+fxb+'/enterprise-search/excel-batchSearch'"
            :on-progress="showLoading"
            :on-error="closeLoading"
            :before-upload="beforeUpload"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :on-remove="removeFile"
            :on-success="handleUploadSuccess"
            :limit="1">
            <el-button size="small" type="text">重新导入</el-button>
          </el-upload>
          <el-button type="primary" style="display:inline-block" @click="exportData" size="small">导出数据</el-button>
        </div>
      </div>
      <div class="tableArea">
        <div class="titleResult">批量查询结果</div>
        <el-table
          :header-cell-style="{background:'#eaedf4',color:'#617c99',fontSize:'14px'}"
          :show-header="true"
          :data="chooseData"
          style="width: 100%"
        >
          <el-table-column label="企业名称" min-width="200" align="left" prop="name">
            <template slot-scope="scope">
              <span
                style="margin-left: 10px"
                :class="{active: scope.row.isFxb == false? true:false}"
              >{{ scope.row.name }}</span>
              <i
                class="el-icon-edit"
                @click="changeCompanyName(scope.row)"
                style="cursor:pointer;display:inline-block;padding-left:8px"
                v-show="scope.row.isFxb==false"
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="法定代表人" align="center" prop="operName"></el-table-column>
          <el-table-column label="企业状态" align="center" prop="status"></el-table-column>
          <el-table-column label="成立日期" align="center">
             <template slot-scope="scope">{{ scope.row.startdate | dateFormat('yyyy-MM-dd') }}</template>
          </el-table-column>
          <el-table-column label="注册资本" align="center" prop="registcapi"></el-table-column>
          <el-table-column min-width="200" label="注册地址" align="center" prop="address"></el-table-column>
        </el-table>

        <!-- 这里是分页 -->
        <div class="pagination">
          <el-pagination
            style="float:right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            :page-sizes="[10]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
          ></el-pagination>
        </div>
      </div>
      <!-- 修改企业名称对话框 -->
      <el-dialog
        title="修改企业名称"
        append-to-body
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="原来的名称" prop="oldName">
            <el-input v-model="ruleForm.oldName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改名称" prop="newName">
            <el-input v-model="ruleForm.newName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sure('ruleForm')">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </el-main>

    <el-footer>
      <FxbFooter />
    </el-footer>
    <OpenVip ref="ref_OpenVip"></OpenVip>
  </el-container>
</template>

<script>
import { isString } from "lodash";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import OpenVip from "@/views/userCenter/vipCenter/OpenVip.vue";
import { Api_versionProducts } from "@/api/userCenter/vip.js";
import { dateFormat } from "@/utils/index";
import { fxb } from "@/utils/variables";
import { getToken } from "@/utils/auth";
import { saveFile } from '@/utils';
import XLSX from 'xlsx';
import {changeCompanyName,exportExcel} from "@/api/checkAllResults/checkAllResults.js"
export default {
  filters: { dateFormat },
  components: {
    FxbHeader,
    FxbFooter,
    OpenVip
  },
  data() {
    return {
      isActive:1,//'激活状态'
      fxb,
      baseUrl: process.env.VUE_APP_BASE_API,  //地址
      // 文件导入
      uploadHeaders: { Authorization: "Bearer" + getToken() },
      loading:'',
      row:'', //当前点击要更改的row
      thisDataIsAllOrPart:2,// 判断table渲染的数据，1 是成功  0 是失败  2是所有的
      isRouterAlive: true,
      dialogVisible: false, // 修改企业名字的对话框是不是显示
      currentPage: 1, //  当前页
      isClickDownLoad: false, // 点击的是不是下载按钮，是的话不执行上传
      ruleForm: {
        oldName: "", //  原始公司名字
        newName: "" //更新的公司名字
      },
      fileList:[],
      totalData:[], // 总数据
      successData:[], //成功的总数组
      failData:[],//失败的总数组
      rules: {
        newName: [{ required: true, message: "请输入新公司名称", trigger: "blur" }],
      }
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
    },
    successPartData(){
     return  this.successData.slice((this.currentPage-1)*10,this.currentPage*10);
    },//成功的总数组的截取
    failPartData(){
      return this.failData.slice((this.currentPage-1)*10,this.currentPage*10);
    },// 失败的总数组的截取
    tableData(){
      if(this.totalData){
         return this.totalData.slice((this.currentPage-1)*10,this.currentPage*10);
      }
    },
    // 列表渲染的数据
    chooseData(){
      if(this.thisDataIsAllOrPart==2){
        // 所有的数据的部分
        return  this.tableData;
      }else if(this.thisDataIsAllOrPart==0){
        // 失败的数据的部分
        return this.failPartData

      }else if(this.thisDataIsAllOrPart==1){
        // 成功的数据的部分
        return this.successPartData
      }
    },
    totalPage(){
      if(this.thisDataIsAllOrPart==2){
        // 所有的数据的部分
        if(this.totalData){
          return  this.totalData.length
        }

      }else if(this.thisDataIsAllOrPart==0){
        // 失败的数据的部分
        return this.failData.length

      }else if(this.thisDataIsAllOrPart==1){
        // 成功的数据的部分
        return this.successData.length
      }
    }

  },

  watch: {
    userInfo:{
      handler(newVal){
          if(newVal){
              this.totalData=JSON.parse(sessionStorage.getItem(this.userInfo.id+'batchQuery'))
          }
      },
      immediate:true
    },

    totalData: {
      handler: function (val) {
        this.getSuccessData();
        this.getFailData();
        // 更新缓存
        if(this.userInfo.id){
          sessionStorage.setItem((this.userInfo.id+'batchQuery'),JSON.stringify(val))
        }
      },
      deep: true,
      immediate:true
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, false);
    // // 获取表格数据
    // if(this.$route.params.data){
    //   var data=JSON.parse(decodeURIComponent(this.$route.params.data));
    //   // 默认当前页为第一页
    //   this.currentPage=1;
    //   this.totalData=data;// 总数据赋值保存起来
    // }


  },
  beforeDestory() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    //  成功的按钮点击
    successBtn(){
      this.currentPage=1;
      this.isActive=2;
      this.thisDataIsAllOrPart=1
    },
    // 失败的按钮点击
    failBtn(){
      this.isActive=3;
      this.currentPage=1;
      this.thisDataIsAllOrPart=0
    },
    // 所有的数据点击
    allBtn(){
      this.isActive=1;
      this.currentPage=1;
      this.thisDataIsAllOrPart=2
    },
    // 查询成功的条数
    getSuccessData(){
      if(this.totalData){
        this.successData= this.totalData.filter(child=>{
              return  child.isFxb==true;
        })
      }
    },
    // 查询失败的条数
    getFailData(){
      if(this.totalData){
          this.failData= this.totalData.filter(child=>{
          return  child.isFxb==false;
        })
      }

    },
    changeCompanyName(row) {
      // 保存row数据,当前点击的row
      this.row=row;
      // 修改企业名称的对话框显示
      this.dialogVisible = true;
      //给form赋值,显示错误的名字
      this.ruleForm.oldName=row.name;
    },
    //  对话框关闭之前
    handleClose() {
      this.dialogVisible=false;
      // 清空验证
      this.$refs.ruleForm.resetFields();
    },

    //  这里是分页触发的事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 当前点击的
    handleCurrentChange(val) {
      //  val  就是当前点击的第几页  对总数据进行截取  按照每页10条截取
      this.currentPage=val;
    },



    postExcelFile(params, url) {
      //params是post请求需要的参数，url是请求url地址
      var form = document.createElement("form");
      form.style.display = "none";
      form.action = url;
      form.method = "post";
      form.target = 'callBackTarget';
      document.body.appendChild(form);
    // 动态创建input并给value赋值
      for (var key in params) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }

      form.submit();
      form.remove();
    },


  // 导出数据
  exportData(){
    // 若是存在数据则可以导出
      if(this.totalData&&this.totalData.length>0){
        //调用
        this.postExcelFile(
          {
          successInfos: JSON.stringify(this.successData),
          errorInfos: JSON.stringify(this.failData),
          successNum:this.successData.length,
          errorNum: this.failData.length
          },
          '/zuul/fxb/enterprise-search/excel'
        );
      }else{
        this.$message({
          message: '没有可以导出的数据',
          type: 'warning'
        });
      }
  },

    // 确定修改错误的名字
    sure(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            //  若是验证通过,则开始发送请求，搜索正确的

            // 首先改一下当前的
            changeCompanyName({
              name:this.ruleForm.newName
            }).then(res=>{
                if(res!=null){
                  //  若是查询到了就进行替换
                  // 查询所有数据中的this.row
                this.totalData.forEach((child, index, arr)=>{
                    if(child.name==this.row.name){
                      //  找到了,替换数据
                      //  arr[index]=res.result[0];
                      //  arr[index].isFxb=true;
                      var obj=res;
                      obj.isFxb=true;
                      this.$set(this.totalData, index, obj);   //将改变项利用$set()重置
                    }
                  })

                  // 关闭修改窗口
                  this.handleClose()
                }else{
                   this.$message.error('没有匹配到数据，请确认是否公司名填写完整');
                }
            })
          } else {
            return false;
          }
        });
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
         if(res.success===true){
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.totalData=res.data;
         }else{
           this.$message.error(res.error);
         }
      },400)
    },
    // 移除文件
    removeFile(){
      this.totalData=[]
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
    }

  }
};
</script>
<style scoped lang="scss">
.activeBg{
  background-color: #4b9df3!important;
  color:#fff!important;
}
.checkResultShow {
  height: 72px;
  padding-top: 22px;
  padding-right: 26px;
  padding-left: 26px;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    // width: 190px;
    justify-content: space-between;
  }
  .tips {
    height: 31px;
    padding:0 8px;
    margin:0 8px;
    line-height: 31px;
    font-size: 12px;
    color: #616266;
    background-color: #f7f8fa;
    border: 1px solid #ebeef3;
    text-align: center;
    cursor: pointer;
  }
}

.tableArea {
  padding-right: 32px;
  padding-left: 32px;
  background-color: #fff;
  .titleResult {
    font-size: 16px;
    color: #333333;
    padding-top: 26px;
    padding-left: 16px;
    background: url("../../assets/images/checkAll/sideLine.png") no-repeat;
    background-position: left 27px;
    padding-bottom: 22px;
  }
}

.pagination {
  background: #fff;
  padding-top: 43px;
  padding-bottom: 30px;
  &:after {
    display: block;
    clear: both;
    content: "";
  }
}

.active {
  color: #f24b5d;
}
</style>
<style>
 .checkResultShow .el-upload-list{
   position: absolute;
   right:0
}
</style>
