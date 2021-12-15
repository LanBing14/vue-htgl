<template>
  <div class="companyActivitiesDetails">
    <!-- <Breadcrumb :routes="routes">
      <el-button @click="prev">返回</el-button>
    </Breadcrumb> -->
    <div class="details">
      <div class="container-l">
          <div class="activitiesBaseInfo">
            <h3 class="activity_title">{{activityDetails.activityName}}</h3>
            <div class="activitiesTags">
                <template v-for="(tag, index) in activityLabel">
                  <el-tag
                  @click="handleAddTags(tag, index)"
                  :key="index + 'tag'"
                  class="activitiesTag_item"
                  v-if="tag"
                  >{{ tag }}</el-tag
                >
                </template>
            </div>

        <p class="activity_time_wrap">
          <i
            style="font-size: 18px"
            class="primaryColor el-icon-alarm-clock"
          ></i
          ><span class="activity_time">活动时间</span>{{activityDetails.activityTime &&activityDetails.activityTime.slice(0,10)}} ~ {{activityDetails.activityEndTime && activityDetails.activityEndTime.slice(0,10)}}
        </p>
        <p class="activity_position_wrap">
          <i
            style="font-size: 18px"
            class="primaryColor el-icon-location-information"
          ></i
          ><span class="activity_position">活动地址</span>{{activityDetails.activityLocation}}
        </p>
          </div>

        <div class="activitiesDes">
          <section>
            <h3>活动详情</h3>
            <p v-html="activityDetails.eventDetails">
            </p>
          </section>
          <div class="download-con flex">
            <div class="name">
              <i class="primaryColor iconfontCXCY icon-fujiancopy"></i><span class="xgfj">相关附件:</span>
            </div>
            <ul class="downloadFile">
              <li
                class="files"
                @click="handleDownLoad(file)"
                v-for="(file, index) in filesList"
                :key="index + 'file'"
              >
                <a
                 :href="downUrl + file.filePath"
                target="_blank"
                download>
                   {{ file.fileName }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-r">
         <div class="prevBtn" style="text-align:right;margin-top:16px">
            <el-button @click="prev">返回</el-button>
        </div>
        <div class="slideshow">
          <el-carousel trigger="click" height="230px">
            <el-carousel-item v-for="(item,index) in sliderPicList" :key="index">
              <img :src="downUrl + item.filePath"/>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="common-con">
          <el-form class="demo-ruleForm">
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-renshu pr10"></i>
                  报名人数限制:
                </span>
              </span>
              <span>{{activityDetails.enrollmentLimit}}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-renshu pr10"></i>
                  当前报名人数:
                </span>
              </span>
              <span>{{activityDetails.participantsNumber}}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-huodongshijian pr10"></i>
                  活动报名截止时间:
                </span>
              </span>
              <span>{{activityDetails.activityEndTime && activityDetails.activityEndTime.slice(0,10)}}</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-con">
          <el-form class="demo-ruleForm">
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-kehulianxiren pr10"></i>
                  联系人:
                </span>
              </span>
              <span>{{activityDetails.activityContacts || '--'}}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-dianhualianxifangshi pr10"></i>
                  联系方式:
                </span>
              </span>
              <span>{{activityDetails.phone || '--'}}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label">
                <span class="span-box">
                  <i class="iconfontCXCY icon-zhuceyouxiang pr10"></i>
                  邮箱:
                </span>
              </span>
              <span>{{activityDetails.email || '--'}}</span>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="dialogTableVisible = true,handleDialog()"
            >活动报名</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog title="活动报名" width="500px" :visible.sync="dialogTableVisible">
        <img src="@/assets/images/bm.png"/>
        <el-select style="width: 100%;margin-top: 20px;" :clearable="true" v-model="optionsName" multiple filterable  placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <!--这里是第二种方法 -->
        <!-- <el-select
            v-model="optionsName"
            placeholder="请选择"
            multiple
            filterable
            collapse-tags
            style="width: 100%;margin-top: 20px;"
            clearable
            class="tags_select_input"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) of options"
              :key="index"
            >　　
　　　　　　
　　　　　　　　　　　<div style="width:200px;overflow:hidden;text-overflow: ellipsis;display:inline-block">{{item.name}}</div>
　　
　　　　　　　　　　<el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" v-if="item.name.length >= 10">
　　　　　　　　　　　　<div style="width:140px;overflow:hidden;text-overflow: ellipsis;display:inline-block">{{item.name}}</div>
　　　　　　　　　　</el-tooltip>
　　　　　　　　</el-option>
          </el-select> -->
          <!-- 第二种方法结束 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confrim">提交报名</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import {api_activitiesDetail,api_getEnterpriseUsers,api_comfirm} from "@/api/creditManagement/companyActivity/companyActivity"
const routes = [
  {
    labelText: "园区活动",
    pathName: "activities",
  },
  {
    labelText: "详情",
    pathName: "",
  },
];
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      routes,
     activityDetails:{
     },
     downUrl: process.env.VUE_APP_FILE_IMG_API,
     activityLabel: [],
     sliderPicList:[],
      filesList: [],
      dialogTableVisible:false,
      optionsName:[],
      options:[]
    };
  },
  created(){
    this.getDetails();
  },
  methods: {
    getDetails(){
        api_activitiesDetail(this.$route.params.id).then(res =>{
            this.activityLabel = res.label && res.label.split(",");
            this.activityDetails = res;
            this.filesList =  res.files.length && res.files.filter( v =>{
              return v.fileType=== "actOther"
            })
            let arr = [];
            res.files.length && res.files.forEach( v=>{
              if(v.fileType ==="actImg"){
                 arr.push(v)
              }
            })
            this.sliderPicList = arr;
        }).catch(err =>{
          console.log(err)
        });
    },
    prev() {
      this.$router.go(-1);
    },
    handleDownLoad(file) {
      return
      window.open(this.downUrl+file.filePath)
    },
    handleDialog(){
        this.optionsName=[]
        api_getEnterpriseUsers().then(res =>{
          this.options = res.filter( v=>{
            return v.name;
          });
        }).catch(err =>{
          console.log(err)
        })
    },
    confrim(){
      let params = {
          userIds: this.optionsName.toString(),
          activityId: this.$route.params.id
      };
       api_comfirm(params).then(res =>{
         this.$message.success(res);
         this.dialogTableVisible = false;
       }).catch(err =>{
         this.$message.error(err);
         console.log(err)
       });

    }
  },
};
</script>
<style  lang="scss" scoped>
/**这里是第二种方法 对应第二种方法的template  勿删除 */
// .tags_select_input /deep/ .el-select__tags {

//   white-space: nowrap;
//   overflow: hidden;
//   flex-wrap: nowrap;
// }
// .tags_select_input /deep/ .el-select__tags-text {
//   display: inline-block;
//   max-width: 300px;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
// .tags_select_input /deep/ .el-tag__close.el-icon-close {
//   top: -6px;
//   right: -4px;
// }
/**第二种方法结束 */

/deep/ .el-select__tags-text {
  display: inline-block;
  max-width: 195px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-select .el-tag__close.el-icon-close{
  top:-7px;
} 
</style>
<style lang="scss" scoped>

.pr10{
  padding-right: 10px;
}
.activity_time,.activity_position{
  	font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #606266;
    line-height: 14px;
    padding-left: 6px;
    margin-right:16px;
}
.xgfj{
    margin-left: 9px;
    font-family: MicrosoftYaHei;
    font-size: 13px;
    color: #333333;
}
.activity_time_wrap{
    padding-bottom: 25px;
    color: #333333;
    font-family: MicrosoftYaHei;
	  font-size: 14px;
}
.activity_position_wrap{
    font-size: 14px;
    color: #333333;
    font-family: MicrosoftYaHei;
}
.activitiesTag_item{
  color: #606266;
  font-family: MicrosoftYaHei;
  font-size: 13px;
  line-height: 13px;
  background-color: #eef0f2;
  border-radius: 2px;
  height: auto;
  padding: 7px 10px;
  border:none;
}
.activity_title{
  color: #333333;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  line-height: 16px;
  margin-bottom: 26px;
  margin-top: 16px;
}
/deep/ .el-carousel__indicators .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgb(255, 255, 255);
  opacity: 0.5;
}
/deep/ .el-carousel__indicators > li.is-active .el-carousel__button {
  opacity: 1;
}
.dialog-footer{
    text-align: center;
}
.primaryColor,
.span-box .iconfontCXCY {
  color: $--color-primary;
}
.details {
  display: flex;
  justify-content: space-between;
  .container-l {
    flex: 1;
    margin-right: 60px;
    .activitiesTags{
      margin-bottom: 21px;
    }
    .activitiesTags .el-tag{
      margin-right:8px;
    }
    .activitiesDes {
      padding: 25px 0;
      margin-top: 35px;
      border-top: 1px solid #eaedf4;
      h3 {
        font-size: 16px;
        padding-left: 16px;
        border-left: 4px solid $--color-primary;
      }
      p {
        line-height: 26px;
        font-size: 14px;
        color: #606266;
        margin-top: 15px;
      }
    }
  }
  .container-r {
    width: 400px;
    padding-bottom: 18px;
    .slideshow {
      background: #606266;
      border-radius: 6px;
      margin-top: 20px;
      overflow: hidden;
    }
    .common-con {
      min-height: 150px;
      padding: 20px;
      margin-top: 20px;
      background-color: #f8f9fb;
      border-radius: 6px;
    }
  }
}
// .activitiesBaseInfo >*{
//     padding: 10px 0;
// }
.download-con {
  margin-top: 25px;
  .downloadFile {
    margin-left: 30px;
  }
  .downloadFile li {
    list-style: square;
    font-size: 13px;
    cursor: pointer;
    color: $--color-primary;
  }

  .downloadFile li:not(:first-child) {
    padding: 10px 0;
  }
}
</style>
