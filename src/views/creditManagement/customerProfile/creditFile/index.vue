<template>
  <el-container>
    <el-header>
      <FxbHeader />
    </el-header>
    <div class="credit-company" v-loading="loading">
      <div class="fxb-container">
        <el-row :span="24" :gutter="20" type="flex" align="bottom">
          <el-col :span="3">
            <span
              class="font13 fxb-grey2"
              v-if="companyInfo.updatedDate"
              style="margin-left: 3px;"
            >更新：{{ companyInfo.updatedDate | dateFormat('yyyy-MM-dd') }}</span>
            <div class="company-avator">
              <img v-if="!companyInfo.ImageUrl" src="@/assets/images/default-logo.png" alt />
              <img v-if="companyInfo.ImageUrl" :src="companyInfo.ImageUrl" alt />
            </div>
          </el-col>
          <el-col :span="13">
            <h2 class="font30 fontwb fxb-wihte">{{ companyInfo.name || '-' }}</h2>
            <div class="company-attribute">
              <span class="fxb-grey2">
                <i class="el-icon-bell"></i>
                {{ companyInfo.status || '-' }}
              </span>
            </div>
            <!--<div class="company-tags">
                                        <el-tag type="success" size="small">大型企业</el-tag>
                                        <el-tag type="primary" size="small">上市企业</el-tag>
                                        <el-tag type="danger" size="small">被执行人</el-tag>
                                        <el-tag type="danger" size="small">失信被执行人</el-tag>
            </div>-->
          </el-col>
          <!--<el-col class="company-tools" :span="8" align="right">
                        <el-button
                            :loading="superviseLoading"
                            v-if="isSupervise === '0'"
                            @click="superviseCompany(-1)"
                            type="primary"
                            size="medium"
                            title="取消监测"
                        >
                            <svg-icon icon-class="jiance" />已监测
                        </el-button>
                        <el-button
                            :loading="superviseLoading"
                            v-if="isSupervise === '-1'"
                            @click="superviseCompany(0)"
                            type="primary"
                            size="medium"
                            title="添加监测"
                        >
                            <svg-icon icon-class="jiance" />添加监测
                        </el-button>

                        <el-button
                            v-if="attentionInfo"
                            icon="el-icon-star-off"
                            title="取消关注"
                            size="medium"
                            @click="cancleAttention"
                        >已关注</el-button>
                        <el-button
                            v-if="!attentionInfo"
                            icon="el-icon-star-off"
                            title="添加关注"
                            size="medium"
                            @click="openAddAttentionDialog"
                        >添加关注</el-button>
          </el-col>-->
        </el-row>
      </div>
    </div>
    <el-main style="padding-bottom: 50px;">
      <el-row class="credit-risk" type="flex" align="bottom">
        <el-col :span="4" class="font16">
          <img src="@/assets/images/icon-warning.png" alt class="marR10" />风险预警
        </el-col>
        <el-col :span="10" :offset="4">
          <span style="padding-left: 57px;">
            自身风险：
            <span
              class="font30 fxb-red"
              style="padding-left: 2px; padding-right: 10px;"
            >{{ ownRiskCount }}</span> 项
          </span>
          <span style="padding-left: 67px;">
            关联方风险：
            <span class="font30 fxb-red">{{ relationRiskCount }}</span> 项
          </span>
        </el-col>
        <!--<el-col :span="6" class="fxb-grey2">
                    <router-link
                        tag="a"
                        target="_self"
                        :to="'/creditFile/dynamicMon?id='+companyId"
                        class="marL40"
                    >查看更多...</router-link>
        </el-col>-->
      </el-row>
      <el-col :span="22" style="padding-right: 34px;">
        <ul class="credit-tab">
          <router-link tag="li" :to="'/test/test1?id='+companyId">基本信息</router-link>
          <router-link tag="li" :to="'/test/test2?id='+companyId">司法风险</router-link>
          <router-link tag="li" :to="'/test/test3?id='+companyId">经营状况</router-link>
          <router-link tag="li" :to="'/test/test4?id='+companyId">知识产权</router-link>
          <router-link tag="li" :to="'/test/test5?id='+companyId">尽职调查</router-link>
        </ul>
        <div class="credit-tab-next">
          <div class="credit-tab-next-container">
            <div>基础信息</div>
            <div>主要人员</div>
            <div>股东信息</div>
            <div>对外投资</div>
            <div>分支机构</div>
            <div>变更记录</div>
          </div>
          <div class="credit-tab-next-container">
            <div>开庭公告</div>
            <div>裁判文书</div>
            <div>被执行人</div>
            <div>失信被执行人</div>
            <div>法院公告</div>
            <div>立案信息</div>
          </div>
          <div class="credit-tab-next-container">
            <div>动产抵押</div>
            <div>股权出质</div>
            <div>清算信息</div>
            <div>经营异常名录</div>
            <div>行政处罚</div>
            <div>合同违约公示</div>
          </div>
          <div class="credit-tab-next-container">
            <div>专利信息</div>
            <div>软件著作权信息</div>
            <div>作品著作权信息</div>
            <div>网站信息</div>
            <div>证书信息</div>
            <div>商标信息</div>
          </div>
          <div class="credit-tab-next-container">
            <div>风险跟踪调查</div>
            <div>经营环境</div>
            <div>生产情况</div>
            <div>主要业务及收入</div>
            <div>供应商/客户</div>
            <div>公司治理及内控</div>
            <div>高层管理人员</div>
            <div>员工构成信息</div>
          </div>
        </div>
        <router-view />
      </el-col>
      <!--<el-col :span="2" align="right">
                <ul class="credit-report">
                    <li @click="openDownloadReportDialog('基础信息报告')">
                        <img src="@/assets/images/basicreport.png" alt />
                        <p>基础信息报告</p>
                    </li>
                    <li @click="openDownloadReportDialog('标准信用报告')">
                        <img src="@/assets/images/secondreport.png" alt />
                        <p>标准信用报告</p>
                    </li>
                    <li @click="openDownloadReportDialog('风险评级报告')">
                        <img src="@/assets/images/threereport.png" alt />
                        <p>风险评级报告</p>
                    </li>
                </ul>
      </el-col>-->
    </el-main>
    <el-footer>
      <FxbFooter />
    </el-footer>
    <MyConcernGroup
      ref="addAttentionDialog"
      :addGroup="true"
      @submitEditGroup="addAttentionConfirm"
    />
    <MySuperviseGroup
      ref="addSuperviseDialog"
      :addGroup="true"
      @submitEditGroup="addSuperviseGroupConfirm"
    />
    <DownloadReport
      ref="downloadReportDialog"
      @submitDownloadType="downloadReportConfirm"
      :companyName="companyInfo.name"
    />
  </el-container>
</template>

<script>
import FxbHeader from "@/views/layouts/fxb/components/FxbHeader";
import FxbFooter from "@/views/layouts/fxb/components/FxbFooter";
import { Api_getCteditCompanyInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";
import {
  Api_GetCompanyRiskCount,
  Api_HasSupervise,
  Api_SuperviseCompany
} from "@/api/creditMonitor";
import {
  Api_AddAttention,
  Api_GetAttentionInfo,
  Api_UpdateAttention
} from "@/api/userCenter/creditManage";
import MyConcernGroup from "@/views/userCenter/components/MyConcernGroup";
import MySuperviseGroup from "@/views/userCenter/components/MySuperviseGroup";
import DownloadReport from "@/views/advanceSearch/creditFile/DownloadReport";

export default {
  filters: { dateFormat },
  components: {
    FxbHeader,
    FxbFooter,
    MyConcernGroup,
    MySuperviseGroup,
    DownloadReport
  },
  data() {
    return {
      loading: false,
      // 监测加载
      superviseLoading: false,
      companyInfo: {},
      // -1未监测 0 监测
      isSupervise: "-1",
      attentionInfo: "",
      companyId: "",
      companyName: "",
      // 自身风险个数
      ownRiskCount: 0,
      // 关联风险个数
      relationRiskCount: 0
    };
  },
  computed: {},
  mounted() {
    this.companyId = this.$route.query.id;
    this.loadCompany();
  },
  methods: {
    /**
     * 添加/取消监测
     * @param status (0:添加监测 ；-1：取消监测)
     */
    superviseCompany(status) {
      if (status === -1) {
        // 取消监测添加确认框
        this.$confirm("确定将该企业移出监测列表吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.supervise(status);
          })
          .catch(() => {});
      } else {
        this.$refs.addSuperviseDialog.openDialog();
      }
    },
    supervise(status, groupIdList) {
      this.superviseLoading = true;
      Api_SuperviseCompany(this.companyInfo.companyId, status, groupIdList)
        .then(res => {
          this.$refs.addSuperviseDialog.closeLoading();
          this.$refs.addSuperviseDialog.closeDialog();
          this.superviseLoading = false;
            this.$message.success(
              status === 0 ? "添加监测成功" : "取消监测成功"
            );
            this.isSupervise = status === 0 ? "0" : "-1";
        })
        .catch(() => {
            this.$message.error("获取企业信息失败");
          this.superviseLoading = false;
        });
    },
    loadCompany() {
      // 企业信息
      this.loading = true;
      Api_getCteditCompanyInfo({
        companyId: this.companyId,
        companyName: this.companyName
      })
        .then(res => {
          this.loading = false;
            this.companyInfo = res.result[0];
        })
        .catch(() => {
          this.loading = false;
        });
      // 企业是否监测
      Api_HasSupervise(this.companyId).then(res => {
        if (res.stateCode === "1") {
          this.isSupervise = res.data;
        }
      });
     /* // 关注信息获取
      Api_GetAttentionInfo(this.companyId).then(res => {
        if (res.stateCode === "1") {
          this.attentionInfo = res.data ? res.data.attention : "";
        }
      });*/
      // 获取企业的风险个数
      Api_GetCompanyRiskCount(this.companyId).then(res => {
        if (res.stateCode === "1") {
          this.ownRiskCount = res.data.ownRiskCount;
          this.relationRiskCount = res.data.relationRiskCount;
        }
      });
    },
    // 添加关注-选择分组
    openAddAttentionDialog() {
      this.$refs.addAttentionDialog.openDialog();
    },
    // 添加企业监测
    addSuperviseGroupConfirm(groupIdList) {
      this.$refs.addSuperviseDialog.openLoading();
      this.supervise(0, groupIdList);
    },
    // 添加关注-确认
    addAttentionConfirm(groupIds) {
      this.$refs.addAttentionDialog.openLoading();
      Api_AddAttention({
        companyId: this.companyId,
        companyName: this.companyInfo.name,
        city: this.companyInfo.city,
        creditCode: this.companyInfo.creditCode,
        legalPerson: this.companyInfo.operName,
        groupIds: groupIds
      }).then(res => {
        this.$refs.addAttentionDialog.closeLoading();
        this.$refs.addAttentionDialog.closeDialog();
        if (res.stateCode === "1") {
          this.attentionInfo = res.data;
          this.$message.success("添加关注成功");
        } else {
          this.$message.error("添加关注失败");
        }
      });
    },
    // 取消关注
    cancleAttention() {
      this.$confirm("确定取消关注该企业吗？")
        .then(() => {
          Api_UpdateAttention({
            attentionId: this.attentionInfo.id,
            status: "-1" // 0 关注 -1 取消关注
          }).then(res => {
            if (res.stateCode === "1") {
              this.attentionInfo = "";
              this.$message.success("取消关注成功");
            } else {
              this.$message.error("取消关注失败");
            }
          });
        })
        .catch(() => {});
    },
    // 打开下载报告弹窗
    openDownloadReportDialog(PDFType) {
      if (PDFType === "风险评级报告") {
        this.$message.warning("报告功能尚未正式发布");
      } else {
        this.$refs.downloadReportDialog.openDialog(PDFType);
      }
    },
    // 确认下载报告
    downloadReportConfirm() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.fxb-page {
  position: relative;
  text-align: right;
  margin-top: 0;

  &.el-pagination {
    padding: 10px 1px;
    border-bottom: 1px solid #f1f1f1;
  }

  &.el-pagination .btn-prev,
  &.el-pagination .btn-next {
    min-width: 30px;
    height: 28px;
    padding: 0;
    background-color: #f4f4f5;
    border-radius: 3px;
    line-height: 28px;
  }

  &.el-pagination::before,
  &.el-pagination::after {
    width: 20px;
    border-top: 1px solid #f1f1f1;
    bottom: -1px;
    position: absolute;
  }

  &.el-pagination::before {
    left: -20px;
  }

  &.el-pagination::after {
    right: -20px;
  }

  .el-pager li {
    margin: 0 10px;
    min-width: 30px;
    border-radius: 3px;
    font-weight: 500;

    &.active,
    &:hover {
      color: #fff;
      background-color: #4b9df3;
    }
  }

  .el-pagination__jump {
    margin-left: 29px;
  }

  .el-pagination__rightwrapper {
    float: initial;
    margin-right: 6px;
    display: inline-block;
  }
}
.company-tags {
  .el-tag {
    color: #fff;
    border-radius: 2px;
    margin-right: 5px;

    &.el-tag--success {
      background-color: #0abab6;
    }

    &.el-tag--primary {
      background-color: #448ee7;
    }

    &.el-tag--danger {
      background-color: #ea4747;
    }
  }
}

.fxb-el-table {
  &.el-table th {
    background: #f7f8fc;
    color: #333;
    white-space: nowrap;
    font-weight: normal;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.credit-company {
  padding-top: 85px;
  background-color: #032c59;
}

.company-avator {
  width: 110px;
  padding: 15px 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
  margin-top: 10px;
  margin-left: 2px;
  background-color: #f7f8f9;
}

.company-avator img {
  width: 80px;
  height: 80px;
}

.company-attribute {
  margin: 20px 0 43px;
}

.company-attribute span {
  margin-right: 25px;
}

.company-tags,
.company-tools {
  margin-bottom: 27px;

  button {
    margin-left: 6px;
  }
}

.credit-tab {
  background-color: #fff;
  overflow: hidden;
  margin-bottom: 20px;

  li {
    float: left;
    width: calc(100% / 8);
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: #4b9df3;
    }

    &.router-link-active {
      color: #fff;
      background-color: #4b9df3;
      &:hover {
        color: #fff;
      }
    }
  }
}

.credit-tab-next {
  background-color: #fff;
  margin-bottom: 20px;
  padding: 10px 0;
  display: flex;

  .credit-tab-next-container {
    flex: 0 calc(100% / 8);
    > div {
      cursor: pointer;
      text-align: center;
      height: 32px;
      line-height: 32px;
      color: #606266;
    }
  }
}

.credit-risk {
  margin-left: 143px;
  margin-bottom: 24px;
}

.credit-report {
  li {
    height: 100px;
    width: 100px;
    color: #fff;
    padding-top: 13px;
    text-align: center;
    margin-bottom: 20px;
    margin-left: 0;
    cursor: pointer;

    &:nth-child(1) {
      background: #4083d3 url(../../../../assets/images/report-bg1.png)
        no-repeat left bottom;
    }

    &:nth-child(2) {
      background: #2daed8 url(../../../../assets/images/report-bg2.png)
        no-repeat left bottom;
    }

    &:nth-child(3) {
      background: #2bc7c3 url(../../../../assets/images/report-bg3.png)
        no-repeat left bottom;
    }

    p {
      padding-top: 8px;
      font-size: 12px;
    }
  }
}
</style>
