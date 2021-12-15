<template>
  <div>
    <Breadcrumb :routes="routes">
      <el-button icon="el-icon-s-promotion" type="primary">发布</el-button>
      <el-button icon="el-icon-s-claim" type="primary">保存</el-button>
      <el-button icon="el-icon-arrow-left" type="primary">返回</el-button>
    </Breadcrumb>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="发布范围" prop="region">
        <el-checkbox-group v-model="form.region">
          <el-checkbox label="小程序" name="region"></el-checkbox>
          <el-checkbox label="企业中心" name="region"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="活动开始日期" prop="startDate">
            <el-date-picker
              type="date"
              placeholder="请选择开始日期"
              v-model="form.startDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="截止日期" prop="endDate">
            <el-date-picker
              placeholder="请选择截止时间"
              v-model="form.endDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2"
          ><el-checkbox
            v-model="form.noLimit"
            label="不限"
            value="不限"
          ></el-checkbox
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="主办部门" prop="hostDepartment">
            <el-select
              v-model="form.hostDepartment"
              style="width: 100%"
              placeholder="请选择活动区域"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select> </el-form-item
        ></el-col>
        <el-col :span="14">
          <el-form-item label="园内协办部门">
            <el-select
              style="width: 100%"
              v-model="form.CoOrganizerInside"
              placeholder="请选择活动区域"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="园外协办部门">
        <el-col :span="24">
          <el-select
            style="width: 100%"
            v-model="form.CoOrganizerOutside"
            placeholder="请选择活动区域"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="activitiesDetails">
      <h3>活动详情</h3>
      <el-form
        :model="activitiesForm"
        :rules="activitiesRules"
        ref="activitiesForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="封面图" prop="name">
           <imgUpload1/>
        </el-form-item>
         <el-form-item label="活动图" prop="name">
            <imgUpload1/>
        </el-form-item>
          <el-form-item label="活动标签" prop="name">
           <el-tag
           class="activitiesTags"
           type="info"
  :key="tag+index"
  v-for="(tag,index) in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 支持自定义填写活动标签</el-button>
<p class="colorCCC">注：所添加的标签会展示在活动详情上，至少添加5个标签</p>
  <el-tag class="activitiesTags" @click="handleAddTags(tag,index)" v-for="(tag,index) in activitiesTagsList" :key="index+ 'tag'" type="info">+{{tag.tagName}}</el-tag>
  </el-form-item> 
  <el-form-item label="活动地点" prop="name">
       <el-col :span="16" style="margin-right:10px"><el-input v-model="activitiesForm.address"/></el-col>
       <el-col :span="5"><el-button type="primary" @click="showActivitiesAddress">常用活动地点</el-button></el-col>
    </el-form-item>
 <el-form-item label="开放报名" prop="type">
    <el-checkbox-group>
      <el-checkbox label="是" name="type"></el-checkbox>
      <el-checkbox label="否" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="活动可报名人数" prop="type">
    <el-checkbox-group>
      <el-checkbox label="是" name="type"></el-checkbox>
      <el-checkbox label="否" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  </el-form>
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import ImgUpload from "@/components/Upload/imgUpload.vue";
import imgUpload1 from "@/components/Upload/imgUpload1.vue";
import Ckeditor from "@/components/Ckeditor/index.vue";

const routes = [
  {
    labelText: "园区活动",
    pathName: "activities",
  },
  {
    labelText: "新增",
    pathName: "",
  },
];
export default {
  components: {
    Breadcrumb,
    ImgUpload,
    imgUpload1,
    Ckeditor
  },
  data() {
    return {
      routes,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      activitiesTagsList: [{
        id: 1,
        tagName: "娱乐活动"
      },
      {
        id: 2,
        tagName: "线上活动"
      },
      {
        id: 3,
        tagName: "科技活动"
      },
      {
        id: 4,
        tagName: "线下活动"
      },{
        id: 5,
        tagName: "人文活动"
      }
      ],
      form: {
        name: "",
        region: [],
        startDate: "",
        endDate: "",
        noLimit: "",
        hostDepartment: "",
        CoOrganizerInside: "",
        CoOrganizerOutside: "",
      },
 
      rules: {
        name: [
          { required: true, message: "请输入标题", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        startDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        endDate: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        hostDepartment: [
          { required: true, message: "请选中主办部门", trigger: "change" },
        ],
      },
      activitiesForm:{

      },
      activitiesRules: {

      },
      isShowActivitiesAddressDialog: false,
      options: [
        {
          value: "选项1",
          label: "未至科技",
        },
      ],
    };
  },
  methods: {
    handleClose(tag){
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag),1);
    },
    showInput(){
      this.inputVisible  = true;
      this.$nextTick(() =>{
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleInputConfirm(){
      let inputValue = this.inputValue;
      if(inputValue){
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleAddTags(obj){ 
      if(this.dynamicTags.indexOf(obj.tagName) > -1){
         this.$message.warning('不能添加相同标签');
          return
      }
      this.dynamicTags.push(obj.tagName);
    },
    showActivitiesAddress(){
       this.isShowActivitiesAddressDialog = true;
    }
  },
};
</script>
<style lang="scss" scoped>
.colorCCC{
  color: #ccc;
}
.demo-ruleForm {
  margin-top: 20px;
}
.activitiesTags{
  cursor: pointer;
  margin-right: 10px;
}
</style>

