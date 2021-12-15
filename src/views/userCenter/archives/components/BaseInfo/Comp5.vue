<template>
  <div class="gqjg">
     <h4 class="flex cp-title-wrap">
      <span class="flex-primary  cp-title">留学生情况</span>
    </h4>
    <el-row>
      <TableWrapper
        ref="table"
        :fetchDataFn="Api_studentInfo"
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
              <el-col :span="8">
                  <el-form-item label="留学生姓名" prop="internationalStudentName">
                      <el-input v-model="form.internationalStudentName" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="留学国" prop="studyAbroadCountry">
                      <el-input v-model="form.studyAbroadCountry" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                  <el-form-item label="留学学校" prop="studyAbroadSchool">
                      <el-input v-model="form.studyAbroadSchool" :disabled="isreadOnly"></el-input>
                  </el-form-item>
              </el-col>

            </el-row>
            <el-row>
              <el-col :span="8">
                  <el-form-item label="学历" prop="education">
                        <el-select v-model="form.education" :disabled="isreadOnly" style="width:100%">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="持股比例" prop="shareholdingRatio">
                            <el-input v-model="form.shareholdingRatio" :disabled="isreadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align:center;line-height:36px">
                        %
                    </el-col>
                </el-row>
          
              </el-col>

            </el-row>

            <el-row>
                <el-col :span="24">
                  <el-form-item label="证件信息" prop="certificateInformation">
                      <el-input type="textarea" :disabled="isreadOnly" v-model="form.certificateInformation" resize='none'></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-form-item label="附件">
                      <div v-if="!isreadOnly">
                         <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-remove="beforeRemove"
                          multiple
                          :limit="3"
                          :on-exceed="handleExceed"
                          :file-list="fileList">
                          <el-button size="small" type="primary">上传附件</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                      </div>
                      <div v-else>
                        
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
  Api_studentInfo
} from "@/api/creditManagement/customerProfile/customerManagemCustomer/baseInfo";

export default {
  name: "Comp5",
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

      /**上传文件 */
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      /**详情弹窗隐藏 */
      visible: false,

      /**学历选项 */
      options: [{
        value: 'specialty',
        label: '专科'
      }, {
        value: 'undergraduate',
        label: '本科'
      }, {
        value: 'master',
        label: '硕士'
      }, {
        value: 'doctor',
        label: '博士'
      }, {
        value: 'postdoctor',
        label: '博士后'
      }],

      /**详情的form */
      form:{
        niandu:''  //年度
      },
      rules:{
         lxsxm:createRules({msg:'留学生姓名',required:true})
      },
      listQuery: {
        companyId: this.$store.getters.userInfo.companyId
      },

      tableCol1: [
        { label: "留学生姓名", key: "internationalStudentName" },
        { label: "留学国", key: "studyAbroadCountry" },
        { label: "留学学校", key: "studyAbroadSchool"},
        { 
          label: "学历",
          key: "education",
          render:(h,data,row)=>{
            return data=='specialty'? '专科':data=='undergraduate'? '本科':data=='master'? '硕士':data=='doctor'? '博士':data=='postdoctor'? '博士后':''
          }
         },
        { label: "持股比例（%）", key: "shareholdingRatio" },
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
    Api_studentInfo,
    getList() {
      this.$refs.table.fetchData();
    },


    /**查看详情 */
    openModal(row) {
      this.visible = true;
      this.form=this.$deepCopy(row);
    },

    /**关闭弹窗 */
    onClose() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      });
      this.$refs.form.resetFields();
    },

    /**弹窗确定 */
    handleSure() {

      Object.keys(this.form).forEach(key => {
        this.form[key] = ''
      });
      this.$refs.form.resetFields();
      this.visible=false;
    },
    // 表格加载数据成功后
    onSuccessData(list, totalRecordNumber) {
      this.list=list;
    },
    toogleExpand(row) {
      this.$refs.table.toogleExpand(row)
    },


    /**上传文件 */
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
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
