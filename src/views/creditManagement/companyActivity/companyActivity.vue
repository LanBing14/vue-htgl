<template>
  <div>
    <!-- <Breadcrumb :routes="routes" /> -->
    <div class="title-name">
        <span class="name-1">园区活动</span>
    </div>
    <div class="search-wrap">
      <el-input
        style="width: 200px"
        :clearable="true"
        v-model="companyActivity.activityName"
        placeholder="活动名称"
      ></el-input>
      <el-date-picker
        :clearable="true"
        value-format="yyyy-MM-dd"
        @change="changeDate(1)"
        style="width： 320px"
        v-model="companyActivity.startDate"
        type="daterange"
        range-separator="至"
        start-placeholder="活动开始时间"
        end-placeholder="活动开始时间"
      >
      </el-date-picker>
      <el-date-picker
        :clearable="true"
         value-format="yyyy-MM-dd"
        @change="changeDate(2)"
        style="width： 320px"
        v-model="companyActivity.endDate"
        type="daterange"
        range-separator="至"
        start-placeholder="活动截止时间"
        end-placeholder="活动截止时间"
      >
      </el-date-picker>
      <!-- <el-select
        style="width: 200px"
        :clearable="true"
        v-model="companyActivity.department"
        placeholder="主办部门"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
      <el-button type="primary" icon="el-icon-search" @click="search" style="margin-right:0">查询</el-button>
      <el-button icon="el-icon-refresh" @click="rest">重置</el-button>
    </div>
    <div class="companyActivities-list">
      <div class="common-flex title">
        <h3 class="secondTitle">园区活动列表</h3>
        <!-- <el-button type="primary" icon="el-icon-plus" @click="addActivities"
          >新增</el-button
        > -->
      </div>
      <div class="notice">
        活动状态：
        <el-checkbox-group @change="handleChange" v-model="companyActivity.noticeScope">
          <el-checkbox label="0">未开始</el-checkbox>
          <el-checkbox label="1">进行中</el-checkbox>
          <el-checkbox label="2">已结束</el-checkbox>
        </el-checkbox-group>
      </div>
      <ul class="common-flex list-items" v-if="listItems.length">
        <li class="items" v-for="(item, index) in listItems" :key="index" @click="linkToDetails(item)">
       
          <div class="items_wrap">
            <div class="images-wrap">
              <img :src="downUrl+item.files.filePath" alt="暂无封面"/>
              
              <span
                class="status"
                :class="item.noticeScope == '未开始'? 'notStart': item.noticeScope == '进行中'? 'active': 'end'"
              >
                {{
                  item.noticeScope === "未开始"
                    ? "未开始 "
                    : item.noticeScope === "进行中"
                    ? "进行中"
                    : "已结束"
                }}</span
              >
            </div>
            <div class="bottoms">
              <h3>{{item.ACTIVITYNAME || '--'}}</h3>
              <p><i  style="font-size: 16px;" class="el-icon-alarm-clock"></i>&nbsp;{{item.ACTIVITYTIME || '--'}}~{{item.ACTIVITYENDTIME || '--'}}</p>
              <p><i style="font-size: 16px;" class="el-icon-location-information"></i>&nbsp;{{item.ACTIVITYLOCATION || '--'}}</p>
              <div class="activitiesDetails">
              
                <template v-for="(v,index) in (item.ACTIVITYLABEL && item.ACTIVITYLABEL.split(',').slice(0,2))">
                    <span :key="index" v-if="v">{{v}}</span>
                </template>
              
              </div>
            </div>
          </div>
        </li>
      </ul>
      <img v-else src="@/assets/images/bg/no.jpg" style="margin: 0 auto;display: block;">
    </div>
  </div>
</template>
<script>
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import {api_search} from "@/api/creditManagement/companyActivity/companyActivity"
const routes = [
  {
    labelText: "园区活动",
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
      downUrl: process.env.VUE_APP_FILE_IMG_API,
      companyActivity: {
        startDate: [],
        endDate: [],
        noticeScope:[],
        activityName: "",
        activityBeginTimeStart: "",
        activityBeginTimeEnd: "",
        activityEndTimeStart: "",
        activityEndTimeEnd: ""
      },
      listItems: [],
      isShowNoDataImg: false,
      options: [
        {
          value: "选项1",
          label: "未至科技",
        },
      ],
    };
  },
  created(){
    this.getList();
  },
  methods: {
    changeDate(type){
      if(type === 1){
        this.companyActivity.activityBeginTimeStart = this.companyActivity.startDate[0];
        this.companyActivity.activityBeginTimeEnd = this.companyActivity.startDate[1];
      }else{
      this.companyActivity.activityEndTimeStart = this.companyActivity.endDate[1];
      this.companyActivity.activityEndTimeEnd = this.companyActivity.endDate[0];
      }
    },
    handleChange(){
      this.getList();
    },
    search() {
      this.getList();
    },
   async getList(){
       let {startDate,endDate,...params}  = this.companyActivity;
       params.noticeScope =  params.noticeScope.toString();  
       this.listItems = await api_search(params); 
    },
    linkToDetails(item){
      this.$router.push({
        name: "companyActivitiesDetails",
        params: {
          id: item.ID
        }
      });
    },
    addActivities() {
      this.$router.push({
        name: "addActivities",
      });
    },
    rest() {
      this.companyActivity = {
        name: "",
        startDate: [],
        endDate: [],
        noticeScope:[]
      };
    },
  },
};
</script>
<style scoped lang="scss">
.title-name {
  margin-bottom: 20px;
  .name-1 {
      height: 42px;
      display: inline-block;
      line-height: 42px;
      font-size: 16px;
      border-bottom: 2px solid $light-blue;
  }
}
.secondTitle{
  color: #222222;
  font-family: MicrosoftYaHei;
  font-size: 16px;
  margin-top: 32px;
  line-height: 16px;
}
h3,p {
  @include ellipsisM(1);
}
.bottoms{
    h3{
        margin:  0 0 10px;
        font-size: 14px;
    }
    padding: 15px 10px;
}
.activitiesDetails{
    min-height: 24px;
    margin-top: 5px;
    span{
        max-width: 90px;
        height: 24px;
        padding: 0 10px;
        text-align: center;
        float: left;
        border-radius: 2px;
        line-height: 24px;
        font-size: 12px;
        color: #2d8cf0;
        background: #e5f2ff;
        margin-right: 8px;
        margin-top: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
p {
  margin: 8px 0;
  font-size: 13px;
  color: #999;
}
.search-wrap {
  background: #fff;
  display: flex;
  align-items: center;
  border-radius: 10px;
  > * {
    margin-right:6px;
  }
}
.common-flex {
 @include flexContainer(start)
}
.notice {
  margin-top: 21px;
  margin-bottom: 20px;
  display: flex;
}
.list-items{
  flex-wrap: wrap;
  margin:0 -10px
}


.list-items .items {

  .items_wrap{
    background: #f6f7fb;
    border-radius: 4px;
  }
  flex:0 0 20%;
  height: 280px;
  padding: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  .images-wrap {
    position: relative;
    height: 135px;
    overflow: hidden;
    border-radius: 4px 4px 0 0;
    img{
      width: 100%;
      height: 100%;
    }
    .status {
      width: 56px;
      height: 24px;
      line-height: 24px;
      color: #fff;
      font-family: MicrosoftYaHei;
	    font-size: 13px;
      text-align: center;
      border-radius: 4px;
      position: absolute;
      top: 10px;
      left: 10px;
      &.active {
        background:rgba(255,160,1,0.8)
      }
      &.notStart {
        background: rgba(45,140,240,0.8);
      }
      &.end {
        background:rgba(119,122,128,0.8)
      }
    }
  }
}
</style>