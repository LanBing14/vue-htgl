<template>
  <div class="monitoringTrends">
    <!--        <div class="page-header">-->
    <!--            <h1 class="page-name">-->
    <!--                <span>监测动态</span>-->
    <!--            </h1>-->
    <!--        </div>-->
    <!--        <div class="page-content">-->
  <el-tabs v-model="activeName" @tab-click="seeThings">
    <el-tab-pane label="自身动态" name="0">
    
    </el-tab-pane>
    <el-tab-pane label="关联动态" name="1">
    
    </el-tab-pane> 
 </el-tabs>
      
   <!-- <div class="page-header">
      <h1 class="page-name" :class="{'active':type ==='0'}" @click="tabClick('0')"> <span>自身动态</span> </h1>
      <h1 class="page-name" :class="{'active':type ==='1'}" @click="tabClick('1')"> <span>关联动态</span> </h1>
    </div>  -->

    <el-row>
      <el-row class="fxb-table">
        <el-form inline class="marB0">
          <el-form-item class="marB13">
            <el-input placeholder="搜索已列入监测的企业" v-model="listQuery.name" size="small" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item class="btns" id="upload-btn-size">
            <el-button type="primary" icon="el-icon-search" class="filter-item" @click="getList(1)">查询</el-button>
            <el-button icon="el-icon-refresh" class="filter-item" @click="resetQueryParam">重置</el-button>
          </el-form-item>
        </el-form>
        <el-form label-width="100px">
          <el-form-item label="企业分组：" class="fxb-tag-change marT-2 marB10">
            <span :class="{ 'active': listQuery.groupId === ''}" @click="listQuery.groupId = '';getList(1)">全部</span>
            <template v-for="(group,index) in groupList">
              <span
                :key="index"
                :class="{'active': listQuery.groupId === group.id}"
                @click="listQuery.groupId = group.id;getList(1)"
              >{{ group.group_name }}</span>
            </template>
          </el-form-item>
          <el-form-item label="时间：" class="fxb-tag-change marT-2 marB10">
            <div class="block">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="变动时间起"
                end-placeholder="变动时间止"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
                @change="getList"
                align="center"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="风险项：" class="fxb-tag-change marT-2 marB10">
            <span
              :class="{ 'active': listQuery.riskType === ''}"
              @click="listQuery.riskType = ''; riskSmallItems=[]; getList(1)"
            >全部</span>
            <template v-for="(risk,index) in riskItems">
              <span
                :key="index"
                :class="{'active': listQuery.riskType === risk.firstLevelCode}"
                @click="listQuery.riskType = risk.firstLevelCode; riskSmallItems=risk.children; getList(1)"
              >{{ risk.firstLevelName }}</span>
            </template>
          </el-form-item>
          <el-form-item v-if="riskSmallItems.length" class="fxb-tag-change-s marT-2 marB10">
            <template v-for="(risk2,index) in riskSmallItems">
              <span
                :key="index"
                :class="{'active': listQuery.riskType === risk2.typeCode}"
                @click="listQuery.riskType = risk2.typeCode; getList(1)"
              >{{ risk2.typeName }}</span>
            </template>
          </el-form-item>
          <el-form-item label="级别：" class="fxb-tag-change marT-2">
            <span :class="{'active': listQuery.level === ''}" @click="listQuery.level='';getList(1)">全部</span>
            <span :class="{'active': listQuery.level === '0'}" @click="listQuery.level='0';getList(1)">良好信息</span>
            <span :class="{'active': listQuery.level === '1'}" @click="listQuery.level='1';getList(1)">提示信息</span>
            <span :class="{'active': listQuery.level === '2'}" @click="listQuery.level='2';getList(1)">警示信息</span>
          </el-form-item>
        </el-form>
      </el-row>

      <div class="page-content-body">
        <TableWrapper
          v-if="isShow"
          ref="child"
          :fetchDataFn="Api_GetDynamicList"
          :query="listQuery"
          :columns="tableCol0"
        />
          <TableWrapper
          v-if="!isShow"
          ref="child"
          :fetchDataFn="Api_GetDynamicList"
          :query="listQuery"
          :columns="tableCol1"
        />
      </div>
    </el-row>
    <ContentDetail ref="ref_ContentDetail"></ContentDetail>
  </div>
</template>

<script type="text/jsx">
import router from "@/router/index.js";
import ContentDetail from "./ContentDetail";
import { dateFormat } from "@/utils";
import { Api_GetCustomerGroup } from "@/api/creditManagement/customerProfile/customerManagement.js";
import { Api_GetDynamicList, Api_GetRiskItems } from "@/api/creditManagement/monitoring/monitoring";
const jsDiff = require('diff');
export default {
  name: "EnterpriseInfo",
  filters: {
    dateFormat,
  },
  props: {
    // type: {
    //   // 0：监测动态，1：关联动态
    //   type: String,
    //   default: "0",
    // },
    // searchName: String,
  },
  components: { ContentDetail },
  data() {
    const { name } = this.$route.query;
    const {tab} =this.$route.query;
    return {
      isShow:true,
      newinner:'',
      activeName:'0',
      type: '0',
      searchName: name,
      searchTab:tab,
      Api_GetDynamicList,
      additionalPageIndex: false,
      riskItems: [],
      riskSmallItems: [],
      // 风险项
      groupList: [],
      riskList: [
        { typeCode: "A01", typeName: "正面信息" },
        { typeCode: "A02", typeName: "企业负面" },
        { typeCode: "A03", typeName: "企业经营" },
        { typeCode: "A04", typeName: "业务变更" },
        // { typeCode: "A05", typeName: "关联风险" },
      ],
      // 选中的时间区间
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "全部",
            onClick: (picker) => {
              const end = "";
              const start = "";
              picker.$emit("pick", [start, end]);
              this.listQuery.dateType = "0";
            },
          },
          {
            text: "今日",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
              this.listQuery.dateType = "1";
            },
          },
          {
            text: "近一周",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
              this.listQuery.dateType = "2";
            },
          },
          {
            text: "近一个月",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit("pick", [start, end]);
              this.listQuery.dateType = "3";
            },
          },
          {
            text: "近一年",
            onClick: (picker) => {
              const end = new Date();
              const start = new Date();
              start.setFullYear(start.getFullYear() - 1);
              picker.$emit("pick", [start, end]);
              this.listQuery.dateType = "4";
            },
          },
        ],
      },
      listQuery: {
        name: "",
        groupId: "",
        level: "",
        startDate: "",
        endDate: "",
        dateType: "0",
        riskType: "",
        isRelated: "",
      },
      tableCol0: [
        {
          key: "companyName",
          label: "企业名称",
          width: 200,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCompanyDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "groupNames",
          label: "企业分组",
          width: 120,
          align: "left",
          props: { "show-overflow-tooltip": true },
        },
        {
          key: "secTypeName",
          label: "风险项",
          width: 120,
          props: { "show-overflow-tooltip": true },
        },
        {
          key: "level",
          label: "信息分类/级别",
          width: 140,
          render: (h, data) => {
            // return data === "0" ? "良好信息" : data === "1" ? "提示信息" : data === "2" ? "警示信息" : "-";
            if(data === "0"){
              return (
                <el-tag type="success" size="mini">良好信息</el-tag>
              )
            }else if(data==='1'){
              return (
                <el-tag type="warning"  size="mini">提示信息</el-tag>
              )
            }else if(data==='2'){
              return (
                <el-tag type="danger"  size="mini">警示信息</el-tag>
              )
            }else{
              return '-'
            }
          },
        },
        {
          key: "monitorContent",
          label: "事件内容",
          align: "center",
          render: (h, data, row) => {
            if (
              row.typeCode === "A010101" ||
              row.typeCode === "A010104" ||
              row.typeCode === "A010201" ||
              row.typeCode === "A010202"
            ) {
              return (
                <router-link to={{ name: "dynamicMon", query: { id: row.codeCompanyId } }} target="_blank">
                  <span style="color: #4b9df3;cursor: pointer">{data}</span>
                </router-link>
              );
            } else {
              if (row.typeCode === "A010301") {
                // 商标注册
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "1")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A010401") {
                // 专利申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "2")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020101") {
                // 失信被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "3")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020201") {
                // 被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "4")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020301") {
                // 法院公告
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "5")}>
                    {data}
                  </span>
                );
              }
              if (row.typeCode === "A020401") {
                // 裁判文书
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "6")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A010501") {
                // 软著申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "7")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020501") {
                // 行政处罚
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "8")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020601") {
                // 经营异常
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "9")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A030101") {
                // 股权出质
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "10")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A030401") {
                // 动产抵押
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "11")}>
                    {data}
                  </span>
                );
              } else {
                const str1=data.replace(/(.*从“)(.*)(变更为.*)/,function(a,b,c,d){
                    return  c
                });   
                var str11="“"+str1;  
                
                const str2 =data.replace(/(.*从“)(.*)(”变更为)/g,"");  
                
                const diffArr = jsDiff.diffChars(str11, str2);
               
                var newinner=data;
                var addStr="";// 这是用来装变更后的内容
                var removeStr="";//这是用来装变更前的内容
                diffArr.map((item, index) => {
                  if(!item.added&&!item.removed){
                    removeStr+=item.value;
                    addStr+=item.value;
                  }else if(item.removed){
                    removeStr+="<span class='removed'>"+item.value+"</span>";
                  }else if(item.added){
                    addStr+="<span class='added'>"+item.value+"</span>";
                  }          
                })
                var allStr= newinner.replace(/(.*从“)(.*)(变更为)(.*)/,function(a,b,c,d){
                   var bChange=b.substring(0, b.lastIndexOf('“'))
                    return bChange+removeStr+d+addStr
                });   
               return <div domPropsInnerHTML={allStr}></div>
              }
            }
          },
        },
        {
          key: "modifyDate",
          label: "变动时间",
          width: 100,
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
      ],
      tableCol1: [
        {
          key: "companyName",
          label: "企业名称",
          width: 160,
          props: { "show-overflow-tooltip": true },
          render: (h, data, row) => {
            return (
              <span class="canClick" onClick={this.gotoCompanyDetail.bind(this, row)}>
                {data}
              </span>
            );
          },
        },
        {
          key: "relatedName",
          align: "left",
          label: "关联企业/自然人",
          render: (h, data, row) => {
            return (
              <span>
                <span
                  class="canClick"
                  onClick={this.gotoCompanyDetail.bind(this, { companyId: row.relatedId })}
                >
                  {data}
                </span>
                <br />
                <span>
                  {row.relatedType}
                  {(row.secTypeName === "股东" || row.secTypeName === "对外投资") && row.relatedProportion}
                </span>
              </span>
            );
          },
        },
        {
          key: "groupNames",
          label: "企业分组",
          width: 140,
          props: { "show-overflow-tooltip": true },
        },
        {
          key: "secTypeName",
          label: "风险项",
          width: 120,
          props: { "show-overflow-tooltip": true },
        },
        {
          key: "level",
          label: "信息分类/级别",
          width: 140,
          // render: (h, data) => {
          //   return data === "0" ? "良好信息" : data === "1" ? "提示信息" : data === "2" ? "警示信息" : "-";
          // },
          render: (h, data) => {
            // return data === "0" ? "良好信息" : data === "1" ? "提示信息" : data === "2" ? "警示信息" : "-";
            if(data === "0"){
              return (
                <el-tag type="success" size="mini">良好信息</el-tag>
              )
            }else if(data==='1'){
              return (
                <el-tag type="warning"  size="mini">提示信息</el-tag>
              )
            }else if(data==='2'){
              return (
                <el-tag type="danger"  size="mini">警示信息</el-tag>
              )
            }else{
              return '-'
            }
          },

        },
        {
          key: "monitorContent",
          label: "事件内容",
          align: "left",
          render: (h, data, row) => {
            if (
              row.typeCode === "A010101" ||
              row.typeCode === "A010104" ||
              row.typeCode === "A010201" ||
              row.typeCode === "A010202"
            ) {
              return (
                <router-link to={{ name: "basicArchive", query: { id: row.codeCompanyId } }} target="_blank">
                  <span style="color: #4b9df3;cursor: pointer">{data}</span>
                </router-link>
              );
            } else {
              if (row.typeCode === "A010301") {
                // 商标注册
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "1")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A010401") {
                // 专利申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "2")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020101") {
                // 失信被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "3")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020201") {
                // 被执行人
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "4")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020301") {
                // 法院公告
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "5")}>
                    {data}
                  </span>
                );
              }
              if (row.typeCode === "A020401") {
                // 裁判文书
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "6")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A010501") {
                // 软著申请
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "7")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020501") {
                // 行政处罚
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "8")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A020601") {
                // 经营异常
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "9")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A030101") {
                // 股权出质
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "10")}>
                    {data}
                  </span>
                );
              } else if (row.typeCode === "A030401") {
                // 动产抵押
                return (
                  <span style="color: #4b9df3;cursor: pointer" onClick={this.openWin.bind(this, row, "11")}>
                    {data}
                  </span>
                );
              } else {
                const str1=data.replace(/(.*从“)(.*)(变更为.*)/,function(a,b,c,d){
                    return  c
                });   
                var str11="“"+str1;  
                
                const str2 =data.replace(/(.*从“)(.*)(”变更为)/g,"");  
                
                const diffArr = jsDiff.diffChars(str11, str2);
               
                var newinner=data;
                var addStr="";// 这是用来装变更后的内容
                var removeStr="";//这是用来装变更前的内容
                diffArr.map((item, index) => {
                  if(!item.added&&!item.removed){
                    removeStr+=item.value;
                    addStr+=item.value;
                  }else if(item.removed){
                    removeStr+="<span class='removed'>"+item.value+"</span>";
                  }else if(item.added){
                    addStr+="<span class='added'>"+item.value+"</span>";
                  }          
                })
                var allStr= newinner.replace(/(.*从“)(.*)(变更为)(.*)/,function(a,b,c,d){
                   var bChange=b.substring(0, b.lastIndexOf('“'))
                    return bChange+removeStr+d+addStr
                });   
               return <div domPropsInnerHTML={allStr}></div>
              }
            }
          },
        },
        {
          key: "modifyDate",
          label: "变动时间",
          width: 100,
          render: (h, data) => {
            return this.$dateFormat(data);
          },
        },
      ],
    };
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
  methods:{
    //  对比
    contrast(data){
          const str1=data.replace(/(.*从“)(.*)(变更为.*)/,function(a,b,c,d){
              return  c
          });   
          var str11="“"+str1;  
          
          const str2 =data.replace(/(.*从“)(.*)(”变更为)/g,"");  
          
          const diffArr = jsDiff.diffChars(str11, str2);
          
          var newinner=data;
          var addStr="";// 这是用来装变更后的内容
          var removeStr="";//这是用来装变更前的内容
          diffArr.map((item, index) => {
            if(!item.added&&!item.removed){
              removeStr+=item.value;
              addStr+=item.value;
            }else if(item.removed){
              removeStr+="<span class='removed'>"+item.value+"</span>";
            }else if(item.added){
              addStr+="<span class='added'>"+item.value+"</span>";
            }          
          })
          var allStr= newinner.replace(/(.*从“)(.*)(变更为)(.*)/,function(a,b,c,d){
              var bChange=b.substring(0, b.lastIndexOf('“'))
              return bChange+removeStr+d+addStr
          });   
          return <div domPropsInnerHTML={allStr}></div>
    }
  },
  created() {
    if (this.searchName) {
      const preDate = new Date().setFullYear(new Date().getFullYear() - 1);
      this.listQuery.name = this.searchName;
      this.activeName=this.searchTab.name;
      
      if(this.searchTab.name=='1'){
        this.listQuery.isRelated='1';
        this.isShow=false;
      }else{
        this.listQuery.isRelated='0';
        this.isShow=true;
      }
    
      // const end = new Date();
      // const start = new Date();
      // start.setFullYear(start.getFullYear() - 1);
      // this.listQuery.dateType = "4";
      // this.dateRange = [this.$dateFormat(start), this.$dateFormat(end)];
      // this.listQuery.startDate = this.$dateFormat(preDate);
      // this.listQuery.endDate = this.$dateFormat(+new Date());
    }
  },
  // 初始化数据
  mounted() {
    Api_GetCustomerGroup().then((res) => {
      this.groupList = res;
    });
    Api_GetRiskItems().then((res) => {
      this.riskItems = res.filter( item => item.firstLevelName !== "关联风险" );
    });
    this.getList();
  },
  methods: {
    seeThings(tab){
      this.$refs.child.columnsData = (tab.name == '0'? this.tableCol0 : this.tableCol1);
      this.listQuery.isRelated = tab.name;
      this.getList(1);
    },
    tabClick(type){
      this.type = type;
      this.$refs.child.columnsData = (type === '0'? this.tableCol0 : this.tableCol1);
      this.listQuery.isRelated = type;
      this.getList(1);
    },
    getList(tag) {
      if (!this.dateRange) {
        this.dateRange = [];
      }
      if (tag) {
        this.additionalPageIndex = true;
      } else {
        this.additionalPageIndex = false;
      }
      this.listQuery.startDate = this.dateRange.length ? this.dateRange[0] : "";
      this.listQuery.endDate = this.dateRange.length ? this.dateRange[1] : "";
      this.$refs.child.fetchData(tag === 1);
    },
    resetQueryParam() {
      this.listQuery.groupId = "";
      this.listQuery.name = "";
      this.listQuery.level = "";
      this.dateRange = [];
      this.listQuery.dateType = "0";
      this.listQuery.startDate = "";
      this.listQuery.endDate = "";
      this.listQuery.riskType = "";
    },
    // 打开详情窗口
    openWin(row, _isShow) {
      this.$refs.ref_ContentDetail.open({monitorContentId: row.monitorContentId , typeCode: row.typeCode , sercondId: row.sercondId }, _isShow);
    },
    gotoCompanyDetail(row) {
      const newpage = router.resolve({
        name: "basicArchive",
        query: {
          id: row.companyId
        },
      });
      window.open(newpage.href, "_blank");
    },
  },
};
</script>
<style lang="scss" scoped>
.page-header .page-name{
  flex: inherit;
  margin-right: 40px;
  cursor: pointer;
  span {
    border-bottom: 0px solid #4b9df3;
  }
  &.active{
    color: #4b9df3;
    span {
      border-bottom: 2px solid #4b9df3;
    }
  }
}
.fxb-tag-change.second .el-form-item__content {
  background-color: #f7f8fb;
}

.fxb-tag-change span {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}

.fxb-tag-change span:first-child.active {
  // color: #20a0ff;
   color:#4b9df3;
}

.fxb-tag-change span:not(:first-child):hover,
.fxb-tag-change span:not(:first-child).active {
  // color: #fff;
  // background-color: #20a0ff;
  color:#4b9df3;
}

.fxb-tag-change-s.second .el-form-item__content {
  background-color: #f7f8fb;
}

.fxb-tag-change-s span {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}

.fxb-tag-change-s span:hover,
.fxb-tag-change-s span.active {
   color:#4b9df3;
  // color: #fff;
  // background-color: #20a0ff;
}

</style>

<style lang="scss">
.monitoringTrends{
  .el-tabs__item {
		height: auto;
		line-height: initial;
		font-size: 16px;
    padding-bottom: 11px;
    margin-top:2px;
    margin-bottom: 1px;
  
	}

	.el-tabs__nav-wrap::after {
		display: none;
  }
  

  .el-tabs__header {
    margin-bottom: 22px;
  }

}
 
.added{
  color:red;
}
.removed{
  color:red
}
</style>
