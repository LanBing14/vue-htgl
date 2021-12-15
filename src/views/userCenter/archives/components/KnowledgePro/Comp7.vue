<template>
    <div>
      <h4 class="flex">
        <span class="flex-primary">产品信息</span>
        <el-row>
          <el-col :span="11" >
             <el-button @click="openModal" style="padding: 8px 20px;" v-if="!isreadOnly">新增</el-button>
          </el-col>
        </el-row>
      </h4>

      <el-table 
       :data="companyPartnersData.data" 
       style="width: 100%"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       stripe>
        <template slot="empty">
          <img src="../../../../../assets/images/bg/no.jpg" alt="" style="width: 300px;height:280px">
        </template>
        <el-table-column align="center"  width="50" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + ( currentPage - 1) * pageSize + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品图片"> 
            <template slot-scope="scope">
              <img :src="formatterColumn(scope)" style="width: 150px;height:150px;" v-if="scope.row.picAddress">
            </template>
        </el-table-column>
        <el-table-column label="产品名" prop="productName"></el-table-column>
        <el-table-column prop="fieldDesc" label="所属领域" ></el-table-column>
        <el-table-column prop="productRemark" label="产品介绍" ></el-table-column>
        <el-table-column label="网址" prop="website"  ></el-table-column>
        <!-- <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="openModal(scope.row)" type="text" size="small">查看</el-button>
          </template>
      </el-table-column> -->
      </el-table>
      <el-pagination
        class="fxb-page"
        background
        layout="prev, pager, next"
        v-show="companyPartnersData.totalRecords > 0"
        :total="companyPartnersData.totalRecords"
        :page-size="companyPartnersData.pageSize"
        :current-page.sync="currentPage"
        @current-change="((val)=>{ pageChange(val) })"
      />

      <Dialog
        title="产品信息详情"
        :visible.sync="visibleComp7 "
        width="1100px"
        @close="onCloseComp7"
        :modal-append-to-body='true'
        :showBtn="false"
      >
        <el-form
          ref="ref_formComp7"
          :model="formComp7"
          label-width="6em"
          label-position="right"
          :rules="rules7"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品图片" prop="productImg" required>
                <!-- <img-upload id="upload-btn-size" @onPreview="handlePictureCardPreview"  v-model="uploadUrls" fileType="png,jpg" :limit="1"  list-type="picture-card" :fileSize="20"></img-upload>
                <el-dialog
                 :visible.sync="dialogVisiblepic" 
                 :close-on-click-modal="false"
                 @close="onCloseCompModelImg"
                 :append-to-body="true"
                 >
                  <img width="100%" :src="dialogImageUrl" >
                </el-dialog> -->
                <img  :src="formComp7.picAddress" >
              </el-form-item>
              <el-form-item label="产品名" prop="productName" required>
                <el-input
                  placeholder="请输入产品名"
                  v-model="formComp7.productName"
                  maxlength="50" 
                  clearable
                  disabled>
                </el-input>
              </el-form-item>
              <el-form-item label="所属领域" prop="ownIntro">
                <el-select v-model="formComp7.fieldCode" placeholder="请选择" disabled style="width: 100%;">
                  <el-option
                    v-for="item in ownOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品介绍" prop="productRemark">
                <el-input
                  type="textarea"
                  :rows="2"
                  disabled
                  placeholder="请输入内容"
                  maxlength="500" 
                  v-model="formComp7.productRemark">
                </el-input>
              </el-form-item>
              <el-form-item label="网址" prop="website">
                <el-input
                  placeholder="请输入内容"
                  disabled
                  v-model="formComp7.website"
                  maxlength="50" 
                  clearable>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </Dialog>
    </div>
  </template>
  <script>

    import {
      Api_enterpriseProductPage ,
    } from "@/api/creditManagement/customerProfile/customerManagemCustomer/knowledgePro";
    import { dateFormat } from "@/utils";
    import ImgUpload from "@/components/Upload/imgUpload.vue";
    import { mapGetters } from "vuex";
    export default {
      name: "comp7",
      components: { ImgUpload },
      filters: { dateFormat },
      props: {
        id: String, // 客户id，用于查询详情数据
        companyName: String,
        isFxb: Boolean,
        isreadOnly:Boolean
      },
      computed: {
        ...mapGetters(["CompanyId"]),
      },
      data() {
        return {
          formComp7:{},
          imgUrl: process.env.VUE_APP_FILE_IMG_API,
          companyPartnersLoading:false,
          companyPartnersData:{
            pageNo: 1,
            pageSize: 10,
            totalRecords: 0,
            data:[]
          },
          showTotalCount: true,
          listQuery: {
            id: this.CompanyId,
          },
          isFlase:false,
          rules7:{
              productName: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
              ],
              productImg: [
                { required: true, message: '请上传图片', trigger: 'change' }
              ],
              productName: [
                { required: true, message: '请输入产品名',  trigger: 'blur'  }
              ],
              productWebsite: [
                { message: '请输入活动名称', trigger: 'blur' },
                { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
              ]
          },
          uploadUrls:[],
          dialogVisiblepic:false,
          dialogImageUrl: '',
          disabled7:true,
          belongingValue:'',
          currentPage:1,
          pageSize:10,
          visibleComp7: false,
          ownOptions:[
            {
              value: '0',
              label: '医疗健康',
              disabled:true
            },
            {
              value: '1',
              label: '金融',
              disabled:true
            },
            {
              value: '2',
              label: '生活服务',
              disabled:true
            },
            {
              value: '3',
              label: '硬件',
              disabled:true
            }
          ]
        };
      },
      mounted() {
        this.listQuery.id = this.CompanyId;
        this.getList();
      },
      methods: {
        formatterColumn(row2) {
          let row=row2.row;
          if (row.picAddress){
            if(row.picAddress.substr(0,7)=="http://"){
              return row.picAddress
            }else {
              return this.imgUrl + row.picAddress
            }
          }
        },
        handleAvatarSuccess(res, file) {
            this.imageUrlPic = URL.createObjectURL(file.raw);
        },
        pageChange(val) {
          this.currentPage = val
          this.getList();
        },
        getList() {
          var params = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
          Api_enterpriseProductPage(params).then(res=>{
            this.companyPartnersData = res
            this.companyPartnersData.totalRecords = res.totalRecordNumber
          })
        },
        onCloseCompModelImg(){
          this.isFlase = true
          this.dialogVisiblepic = false;
        },
        // 图片上传
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisiblepic = true;
        },
        beforeAvatarUpload(file) {
          const isMatch = /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/.test(file.name);
          const isLt2M = file.size / 1024 < 10240;
          if (!isMatch) {
            this.$message.warning("仅支持jpg、jpeg、png格式");
          }
          if (!isLt2M) {
            this.$message.warning("图片大小不超过10M");
          }
          return isMatch && isLt2M;
        },
        openModal(row){
          this.visibleComp7 = true
          console.log(row);
          this.formComp7 = row
        },
        onCloseComp7() {
          this.$refs.ref_formComp7.resetFields();
          this.imageUrl = [];
          this.$nextTick(() => {
            this.visibleComp7 = false;
          });
        },
      },
    };
</script>

<style lang="scss" scoped>
/deep/.el-upload--picture-card{
  height:126px!important;
  line-height: 126px;
  width: 194px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item{
  height:126px!important;
  width: 194px;
}

/deep/ .has-gutter tr th {
  background-color: rgb(234, 237, 244);
    color: rgb(112, 136, 164);
}
</style>
 