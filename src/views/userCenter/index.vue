<template>
  <el-container style="height: 100%;">
    <el-header>
      <FxbHeader @reload="reload"/>
    </el-header>
    <!--<div class="credit-company">
            <div class="fxb-container">
                <el-row :span="24" :gutter="20" type="flex" align="middle">
                    <el-col :span="3">
                        <div class="company-avator">
                            <img src="../../assets/images/default-logo1.png" alt/>
                            &lt;!&ndash; <img v-if="companyInfo.ImageUrl" :src="companyInfo.ImageUrl" alt=""> &ndash;&gt;
                        </div>
                    </el-col>
                    <el-col :span="20" class="company-detail">
                        <h2 class="font26 fxb-wihte">
                            {{
                            userInfo.saasName
                            ? userInfo.saasName
                            : userInfo.username
                            }}
                        </h2>
                        <div class="company-attribute">
                            <span class="fxb-grey2">{{ roles }}</span>
                        </div>
                    </el-col>
                    &lt;!&ndash; <el-col class="company-tools" :span="11" align="right">
                              <div id="chart1" style="width:100%;height:150px;"></div>
                    </el-col>&ndash;&gt;
                </el-row>
            </div>
    </div>-->
    <el-main style="height: calc(100vh - 50px);box-sizing: border-box;" class="main-yu-change">
      <div class="usercenter-container">
        <div class="side page-component__scroll" style="height: 100%;">
            <UserNav id="user-nav" class="sidebar-container" :basePath="basePath" :curRoutes="userNavList"/>  
        </div>
        <div class="conteraaa page-component__scroll" style="height: 100%;position:relative"  @mouseover="onMouseOver">
          <el-scrollbar  ref="scrollWrap"  class="scroll-wrap" style="height: 100%; width: 100%;">
            <router-view id="user-content" name="userCenter" v-if="isRouterAlive"/>
          </el-scrollbar>
        </div>
      </div>
    </el-main>
    <!-- <el-footer> -->
    <!-- <FxbFooter class="fxb-footer-2" /> -->
    <!-- </el-footer> -->
  </el-container>
</template>

<script>
import { getUserInfo } from "@/utils/auth";
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import UserNav  from "@/views/layouts/fxb/components/adminSidebar/index";
import { getRoleAuthInfo } from "@/utils/auth";

export default {
  name: "UserCenter",
  components: {
    FxbHeader,
    FxbFooter,
    UserNav,
  },
  data() {
    return {
      myChart: {},
      basePath:'',
      companyInfo: getUserInfo(),
      roleAuthInfo: {},
      isRouterAlive: true,
      userNavList: [
          // {
          //   name: "信用管理",
          //   url: "/userCenter/creditManage"
          // },
          // {
          //   name: "信用修复",
          //   url: "/userCenter/creditPepairing"
          // },

          // {
          //   name: "我的关注",
          //   url: "/userCenter/concern",
          //   icon: "icon-star"
          // },
          // {
          //   name: "订单管理",
          //   url: "/userCenter/order",
          //   icon: "icon-shopping"
          // },

    {
      path: '/userCenter/archives/companyCenterMain',
      meta:{
        icon: 'icon-qiye3',
        title:'当前企业'
      }
    },
    // {
      
    //   path: '/userCenter/mechanism',
    //   meta:{
    //     title: '所属机构',
    //     icon: 'icon-jigou2'
    //   }
    // },
    {
      path: '/userCenter/serveApply',
      meta:{
        title: '服务记录',
        icon: 'icon-shenqingjilu'
      },
      children: [
        {
        
          path: '/userCenter/serveApply',
          meta:{
            title: '访客预约',
            icon: 'icon-weibiaoti-1-12'
          },
        },
        {
          path: '/userCenter/serveRepair',
          meta:{
            title: '物业报修',
            icon: 'icon-baoxiu'
          },
        },
        {
          path: '/userCenter/serveDecoration',
          meta:{
            title: '装修服务',
            icon: 'icon-zhuangxiu'
          },
        }
      ]
    },
    // {
    //   name: "信用培训",
    //   url: "/userCenter/training",
    //   icon: "icon-read"
    // },
    // {
    //   name: "会员信息",
    //   url: "/userCenter/vip",
    //   icon: "icon-user"
    // },
      {
        path: '/userCenter/business',
        meta:{
          icon: 'icon-qiye3',
          title:'企业关系绑定'
        }
      },
      {
        path: "/userCenter/message",
        meta:{
          title: '消息中心',
          icon: 'icon-bell'
        },
      },
      // {
      //   name: "资料设置",
      //   url: "/userCenter/basic",
      //   icon: "icon-snippets"
      // },
      // {
      //   name: "意见反馈",
      //   url: "/userCenter/contact",
      //   icon: "icon-message"
    // }
      ]
    };
  },
  provide() {
    return {reload:this.reload };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    roles() {
      const { roles } = this.userInfo;
      if (roles) {
        return roles.map((item) => item.name).join(" | ");
      }
      return "";
    },
  },
  mounted() {
    // this.drawEchart();
    this.roleAuthInfo = getRoleAuthInfo();
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    onMouseOverMenu() {
      this.$refs.scrollWrapMenu.update();
    },
    onMouseOver() {
      this.$refs.scrollWrap.update();
    },
    /* drawEchart() {
                    this.myChart = EchartsVue.init(document.getElementById('chart1'));

                    var dataStyle = {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            },
                            shadowBlur: 0,
                            shadowColor: '#203665'
                        }
                    };
                    var option = {
                        // backgroundColor: "#20263f",
                        series: [{
                            name: '第一个圆环',
                            type: 'pie',
                            clockWise: false,
                            radius: [45, 55],
                            itemStyle: dataStyle,
                            hoverAnimation: false,
                            center: ['15%', '50%'],
                            data: [{
                                value: 25,
                                label: {
                                    normal: {
                                        rich: {
                                            a: {
                                                color: '#3a7ad5',
                                                align: 'center',
                                                fontSize: 20,
                                                fontWeight: "bold"
                                            },
                                            b: {
                                                color: '#fff',
                                                align: 'center',
                                                fontSize: 16
                                            }
                                        },
                                        formatter: function (params) {
                                            // return "{b|在线统计}\n\n" + "{a|" + params.value + "个}" + "\n\n{b|增长2%}";
                                        },
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '14',
                                            fontWeight: 'normal',
                                            color: '#fff'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#2c6cc4',
                                        shadowColor: '#2c6cc4',
                                        shadowBlur: 0
                                    }
                                }
                            }, {
                                value: 75,
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: '#24375c'
                                    },
                                    emphasis: {
                                        color: '#24375c'
                                    }
                                }
                            }]
                        }, {
                            name: '第二个圆环',
                            type: 'pie',
                            clockWise: false,
                            radius: [45, 55],
                            itemStyle: dataStyle,
                            hoverAnimation: false,
                            center: ['50%', '50%'],
                            data: [{
                                value: 50,
                                label: {
                                    normal: {
                                        rich: {
                                            a: {
                                                color: '#d03e93',
                                                align: 'center',
                                                fontSize: 20,
                                                fontWeight: "bold"
                                            },
                                            b: {
                                                color: '#fff',
                                                align: 'center',
                                                fontSize: 16
                                            }
                                        },
                                        formatter: function (params) {
                                            // return "{b|离线统计}\n\n" + "{a|" + params.value + "个}" + "\n\n{b|增长2%}";
                                        },
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '14',
                                            fontWeight: 'normal',
                                            color: '#fff'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#ef45ac',
                                        shadowColor: '#ef45ac',
                                        shadowBlur: 0
                                    }
                                }
                            }, {
                                value: 50,
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: '#412a4e'
                                    },
                                    emphasis: {
                                        color: '#412a4e'
                                    }
                                }
                            }]
                        }, {
                            name: '第三个圆环',
                            type: 'pie',
                            clockWise: false,
                            radius: [45, 55],
                            itemStyle: dataStyle,
                            hoverAnimation: false,
                            center: ['85%', '50%'],
                            data: [{
                                value: 75,
                                label: {
                                    normal: {
                                        rich: {
                                            a: {
                                                color: '#603dd0',
                                                align: 'center',
                                                fontSize: 20,
                                                fontWeight: "bold"
                                            },
                                            b: {
                                                color: '#fff',
                                                align: 'center',
                                                fontSize: 16
                                            }
                                        },
                                        formatter: function (params) {
                                            // return "{b|缺报统计}\n\n" + "{a|" + params.value + "个}" + "\n\n{b|增长2%}";
                                        },
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '14',
                                            fontWeight: 'normal',
                                            color: '#fff'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#613fd1',
                                        shadowColor: '#613fd1',
                                        shadowBlur: 0
                                    }
                                }
                            }, {
                                value: 25,
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: '#453284'
                                    },
                                    emphasis: {
                                        color: '#453284'
                                    }
                                }
                            }]
                        }]
                    }

                    this.myChart.setOption(option);
                }*/
  },
};
</script>

<style lang="scss">
.marT0 {
  margin-top: 0 !important;
}

.marT33 {
  margin-top: 33px !important;
}

.marT20 {
  margin-top: 20px !important;
}

.marT-2 {
  margin-top: -2px !important;
}

.marT5 {
  margin-top: 5px !important;
}

.marB0 {
  margin-bottom: 0 !important;
}

.marB13 {
  margin-bottom: 13px !important;
}

.marB3 {
  margin-bottom: 3px !important;
}

.marB49 {
  margin-bottom: 49px !important;
}

.padB0 {
  padding-bottom: 0 !important;
}

.fxb-tag-list span {
  display: inline-block;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 20px;
  cursor: pointer;
}

.fxb-tag-list span:first-child.active {
  color: #20a0ff;
}

.fxb-tag-list span:not(:first-child):hover,
.fxb-tag-list span:not(:first-child).active {
  color: #fff;
  background-color: #20a0ff;
}

.fxb-tag-list.sub {
  background-color: #f7f8fb;
}

.fxb-table-tool {
  margin-top: 20px;

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-button--small {
    padding: 7px 15px;
    font-size: 13px;
    vertical-align: middle;
  }

  .el-col-5 {
    width: 188px;
    margin-bottom: -2px;
  }

  .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .el-range-editor--small.el-input__inner {
    height: 30px;
    vertical-align: middle;
  }
}

.fxb-table-footer {
  border-top: 1px solid #f1f1f1;
  padding-top: 25px;
  padding-bottom: 7px;
  position: relative;

  .el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  .el-form-item {
    margin-bottom: 23px;
  }

  .el-button--primary {
    padding: 12px 34px;
  }

  .el-button + .el-button {
    margin-left: 9px;
  }

  &::before,
  &::after {
    width: 30px;
    border-top: 1px solid #f1f1f1;
    top: -1px;
    position: absolute;
  }

  &::before {
    left: -30px;
  }

  &::after {
    right: -30px;
  }
}

.fxb-table {
  // margin-bottom: 33px;

  &.el-table::before {
    height: 0;
  }

  &.el-table thead tr th {
    color: #7088a4;
    background-color: #eaedf4;
  }

  &.el-table--mini th,
  &.el-table--mini td {
    padding: 16px;
  }

  &.el-table--mini {
    font-size: 14px;
  }

  &.el-table th {
    padding: 13px 0;
    font-size: 14px;
  }

  &.el-table td {
    padding: 11px 0;
    font-size: 13px;
  }

  .el-table__expanded-cell {
    padding: 0 !important;
  }

  &.el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #f7f8fc;
  }

  &.el-table th.is-leaf,
  &.el-table td {
    border-bottom: 0;
  }

   .el-table--fit{
    border-bottom: 1px solid #ebeef5; 
  }
}

.row-tool-panel {
  cursor: pointer;
  padding: 18px 15px;
  background-color: #fff;
  border: 1px solid rgba(74, 157, 242, 0.5);
  text-align: center;
  width: 100%;
  box-shadow: 1px 0 15px rgba(74, 157, 242, 0.3);
  color: #999;

  svg {
    font-size: 18px;
    margin-right: 5px;
  }

  span {
    display: inline-block;
    padding: 2px 15px;

    &:first-child {
      color: #4a9df2;
    }

    &:hover {
      color: #4a9df2;
    }
  }
}

.user-center {
  padding: 20px 25px;
  background-color: #fff;
}

.user-center-top {
  // dayu 修改
  // border-bottom: 1px solid #e0e3ec;
  // 修改结束


  margin-bottom: 0 !important;

  .center-tab {
    background-color: #fff;
    overflow: hidden;
  }

  .center-tab li {
    float: left;
    height: 36px;
    margin-right: 32px;
    font-size: 16px;
    color: #abb7c5;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
  }


  .center-tab li.router-link-active,
  .center-tab li.active {
    color: #333;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      // height: 4px;

      // dayu修改

        height:2px;
      // 修改结束

      width: 100%;
      background-color: $--color-primary;
    }
  }
}

.error > .el-input__inner {
  border-color: #f56c6c;
}

.success > .el-input__inner {
  border-color: #67c23a;
}

.el-icon-error {
  color: #f56c6c;
}

.el-icon-success {
  color: #67c23a;
}
</style>
<style lang="scss" scoped>
.credit-company {
  background-color: #032c59;
  background-image: url("../../assets/images/tbg2.png");
  background-repeat: no-repeat;
  background-size: cover;

  .fxb-container {
    height: 220px;
  }
}

.company-avator {
  overflow: hidden;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-top: 70px;
  text-align: center;
  background: linear-gradient(#667f9f, #f7f8f9);
}

.company-avator img {
  width: 50px;
  height: 50px;
  margin-top: 20px;
}

.company-detail {
  margin-top: 88px;
}

.company-attribute {
  margin: 14px 0 10px;
}

.company-attribute span {
  margin-right: 25px;
}
/deep/ .el-main {
  width: 100%;
  /* padding: 0px 20px ; */
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
}

.usercenter-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // margin-top: 5px;
  /* height: 100vh;  */
  // margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  #user-nav {
    /* float: left; */
    width: 210px;
    margin-right: 30px;
  }
  .side,.conteraaa {
    height: 100%;
    
  }
  .conteraaa {
    flex: 1;

  }
  #user-content {
    /* flex: 1; */
    /* overflow: hidden auto; */
  }
  .page-component__scroll{
      height: 100%;
  }
  .page-component__scroll .el-scrollbar__wrap {
      overflow-x: auto;
  }
}
</style>


<style scoped>
/*笪玉修改*/
.side{
  background:#fff
}
#user-nav {
  margin-right: 0!important;
}

.conteraaa{
  margin-left:20px;
  background-color: #fff;
}

.main-yu-change{
  /* overflow: hidden; */
  padding: 20px;
  box-sizing: border-box;
}
</style>