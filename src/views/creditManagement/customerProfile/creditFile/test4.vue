<template>
  <el-row class="credit-tab-content">
    <h3 class="font20 fontwb">知识产权信息</h3>
    <h4>专利信息</h4>
    <el-table
      v-loading="patentData.loading"
      :data="patentData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (patentData.pageNo - 1) * patentData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="专利名称"></el-table-column>
      <el-table-column prop="publicationNumber" label="公示号"></el-table-column>
      <el-table-column prop="kindCodeDesc" label="专利类型"></el-table-column>
      <el-table-column label="公开日期" width="110">
        <template slot-scope="scope">{{ scope.row.pubDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="patentData.totalRecords > 0"
      :total="patentData.totalRecords"
      :page-size="patentData.pageSize"
      :current-page.sync="patentData.pageNo"
      @current-change="getAssetPatentDetailByPage"
    />

    <h4>软件著作权信息</h4>
    <el-table
      v-loading="softwareCopyrightsData.loading"
      :data="softwareCopyrightsData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (softwareCopyrightsData.pageNo - 1) * softwareCopyrightsData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="registerNo" label="登记号"></el-table-column>
      <el-table-column prop="owner" label="著作权人"></el-table-column>
      <el-table-column label="登记日期" width="110">
        <template slot-scope="scope">{{ scope.row.registerAperDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
      <el-table-column prop="category" label="作品类型"></el-table-column>
      <el-table-column label="发布日期" width="110">
        <template slot-scope="scope">{{ scope.row.publishDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="softwareCopyrightsData.totalRecords > 0"
      :total="softwareCopyrightsData.totalRecords"
      :page-size="softwareCopyrightsData.pageSize"
      :current-page.sync="softwareCopyrightsData.pageNo"
      @current-change="getSoftwareCopyrightsByPage"
    />

    <h4>作品著作权信息</h4>
    <el-table
      v-loading="copyrightData.loading"
      :data="copyrightData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (copyrightData.pageNo - 1) * copyrightData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="registerNo" label="登记号"></el-table-column>
      <el-table-column prop="owner" label="著作权人"></el-table-column>
      <el-table-column label="登记日期" width="110">
        <template slot-scope="scope">{{ scope.row.registerDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
      <el-table-column prop="category" label="作品类型"></el-table-column>
      <el-table-column label="发布日期" width="110">
        <template slot-scope="scope">{{ scope.row.publishDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="copyrightData.totalRecords > 0"
      :total="copyrightData.totalRecords"
      :page-size="copyrightData.pageSize"
      :current-page.sync="copyrightData.pageNo"
      @current-change="getOperationCopyrightByPage"
    />

    <h4>网站信息</h4>
    <el-table
      v-loading="websiteData.loading"
      :data="websiteData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (websiteData.pageNo - 1) * websiteData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="homeSite" label="网址"></el-table-column>
      <el-table-column prop="typeName" label="网站类别"></el-table-column>
      <el-table-column prop="yuMing" label="域名"></el-table-column>
      <el-table-column prop="beiAn" label="网站备案/许可证号"></el-table-column>
      <el-table-column label="审核时间" width="110">
        <template slot-scope="scope">{{ scope.row.sDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="websiteData.totalRecords > 0"
      :total="websiteData.totalRecords"
      :page-size="websiteData.pageSize"
      :current-page.sync="websiteData.pageNo"
      @current-change="getOperationWebsiteByPage"
    />

    <h4>证书信息</h4>
    <el-table
      v-loading="certificationData.loading"
      :data="certificationData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (certificationData.pageNo - 1) * certificationData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="证书名称"></el-table-column>
      <el-table-column prop="certificateNumber" label="证书编号"></el-table-column>
      <el-table-column label="发证日期" width="110">
        <template slot-scope="scope">{{ scope.row.startDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
      <el-table-column prop="currentState" label="证书状态" width="120"></el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="certificationData.totalRecords > 0"
      :total="certificationData.totalRecords"
      :page-size="certificationData.pageSize"
      :current-page.sync="certificationData.pageNo"
      @current-change="getAssetCertificationByPage"
    />

    <h4>商标信息</h4>
    <el-table
      v-loading="tmInfoData.loading"
      :data="tmInfoData.result"
      style="width: 100%"
      border
      class="fxb-el-table"
    >
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (tmInfoData.pageNo - 1) * tmInfoData.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商标名称"></el-table-column>
      <el-table-column label="商标图案">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" :onerror="errorImg" width="50" />
        </template>
      </el-table-column>
      <el-table-column prop="regno" label="申请/注册号"></el-table-column>
      <el-table-column label="申请日期" width="110">
        <template slot-scope="scope">{{ scope.row.appDate | dateFormat('yyyy-MM-dd') }}</template>
      </el-table-column>
      <el-table-column prop="applicantCn" label="申请人名称"></el-table-column>
      <el-table-column prop="intClsDesc" label="商标类型"></el-table-column>
      <el-table-column label="商标状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">有效</span>
          <span v-else-if="scope.row.status == '2'">无效</span>
          <span v-else-if="scope.row.status == '3'">待审</span>
          <span v-else-if="scope.row.status == '4'">不定</span>
          <span v-else-if="scope.row.status == '5'">未知状态</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="fxb-page"
      v-show="tmInfoData.totalRecords > 0"
      :total="tmInfoData.totalRecords"
      :page-size="tmInfoData.pageSize"
      :current-page.sync="tmInfoData.pageNo"
      @current-change="getAssetTmInfoByPage"
    />
  </el-row>
</template>
<script>
import { Api_getBasicInfo } from "@/api/advanceSearch";
import { dateFormat } from "@/utils/index";

export default {
  name: "KnowledgePro",
  filters: { dateFormat },
  data() {
    return {
      errorImg: 'this.src="' + require("@/assets/images/zanwutupian.png") + '"',
      companyId: null,
      companyName: null,
      // 专利信息，包括列表和分页信息
      patentData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      },
      // 软件著作权信息，包括列表和分页信息
      softwareCopyrightsData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      },
      // 作品著作权信息，包括列表和分页信息
      copyrightData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      },
      // 网站信息，包括列表和分页信息
      websiteData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      },
      // 证书信息，包括列表和分页信息
      certificationData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      },
      // 商标信息，包括列表和分页信息
      tmInfoData: {
        pageNo: 1,
        pageSize: 10,
        totalRecords: 0,
        result: [],
        loading: true
      }
    };
  },
  created: function() {
    // 获取参数
    this.companyId = this.$route.query.id;

    // 调用接口
    this.getAssetPatentDetailByPage();
    this.getSoftwareCopyrightsByPage();
    this.getOperationCopyrightByPage();
    this.getOperationWebsiteByPage();
    this.getAssetCertificationByPage();
    this.getAssetTmInfoByPage();
  },
  methods: {
    // 获取专利信息
    getAssetPatentDetailByPage() {
      this.patentData.loading = true;
      Api_getBasicInfo(6, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.patentData.pageNo,
        pageSize: this.patentData.pageSize
      })
        .then(res => {
          if (res) {
            this.patentData.result = res.result;
            this.patentData.totalRecords = res.totalRecords;
          } else {
            this.patentData.result = [];
            this.patentData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.patentData.loading = false;
        });
    },
    // 获取软件著作权信息
    getSoftwareCopyrightsByPage() {
      this.softwareCopyrightsData.loading = true;
      Api_getBasicInfo(7, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.softwareCopyrightsData.pageNo,
        pageSize: this.softwareCopyrightsData.pageSize
      })
        .then(res => {
          if (res) {
            this.softwareCopyrightsData.result = res.result;
            this.softwareCopyrightsData.totalRecords = res.totalRecords;
          } else {
            this.softwareCopyrightsData.result = [];
            this.softwareCopyrightsData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.softwareCopyrightsData.loading = false;
        });
    },
    // 获取作品著作权信息
    getOperationCopyrightByPage() {
      this.copyrightData.loading = true;
      Api_getBasicInfo(20, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.copyrightData.pageNo,
        pageSize: this.copyrightData.pageSize
      })
        .then(res => {
          if (res) {
            this.copyrightData.result = res.result;
            this.copyrightData.totalRecords = res.totalRecords;
          } else {
            this.copyrightData.result = [];
            this.copyrightData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.copyrightData.loading = false;
        });
    },
    // 获取网站信息
    getOperationWebsiteByPage() {
      this.websiteData.loading = true;
      Api_getBasicInfo(21, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.websiteData.pageNo,
        pageSize: this.websiteData.pageSize
      })
        .then(res => {
          if (res) {
            this.websiteData.result = res.result;
            this.websiteData.totalRecords = res.totalRecords;
          } else {
            this.websiteData.result = [];
            this.websiteData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.websiteData.loading = false;
        });
    },
    // 获取证书信息
    getAssetCertificationByPage() {
      this.certificationData.loading = true;
      Api_getBasicInfo(22, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.certificationData.pageNo,
        pageSize: this.certificationData.pageSize
      })
        .then(res => {
          if (res) {
            this.certificationData.result = res.result;
            this.certificationData.totalRecords = res.totalRecords;
          } else {
            this.certificationData.result = [];
            this.certificationData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.certificationData.loading = false;
        });
    },
    // 获取商标信息
    getAssetTmInfoByPage() {
      this.tmInfoData.loading = true;
      Api_getBasicInfo(8, {
        companyId: this.companyId,
        companyName: this.companyName,
        pageNo: this.tmInfoData.pageNo,
        pageSize: this.tmInfoData.pageSize
      })
        .then(res => {
          if (res) {
            this.tmInfoData.result = res.result;
            this.tmInfoData.totalRecords = res.totalRecords;
          } else {
            this.tmInfoData.result = [];
            this.tmInfoData.totalRecords = 0;
          }
        })
        .finally(() => {
          this.tmInfoData.loading = false;
        });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
