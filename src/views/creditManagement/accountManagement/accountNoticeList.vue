<template>
  <div>
    <div class="title-name">
      <span class="name-1">收款通知单</span>
    </div>
    <div class="search-wrap">
      <el-form :model="account" :inline="true">
        <el-form-item>
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="account.paymentno"
            placeholder="收款通知单编号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 200px"
            :clearable="true"
            v-model="account.contractNo"
            placeholder="合同编号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :clearable="true"
            value-format="yyyy-MM-dd"
            style="width： 320px"
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="计费开始日期"
            end-placeholder="计费截止日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-select
            :clearable="true"
            @change="handleChangeProject"
            v-model="account.project"
            filterable
            placeholder="所属项目"
          >
            <el-option
              v-for="item in projectList"
              :key="item.BUSINESSID"
              :label="item.BUSINESSNAME"
              :value="item.BUSINESSID"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            :clearable="true"
            v-model="account.building"
            filterable
            placeholder="所在楼宇"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.ID"
              :label="item.BUILD_NAME"
              :value="item.ID"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="handleRest">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="title">
      收款单列表
      <div class="btns">
        <el-button type="primary" icon="el-icon-bottom" @click="download(0)"
          >批量下载收款通知单</el-button
        >
        <el-button type="success" @click="download(1)">导出</el-button>
      </div>
    </div>
    <div class="filters">
      <span>快捷筛选</span>
      <ul>
        <li :class="{ active: type === '' }" @click="handleFilter('')">全部</li>
        <li :class="{ active: type === '0' }" @click="handleFilter('0')">
          未付清
        </li>
        <li :class="{ active: type === '1' }" @click="handleFilter('1')">
          已付清
        </li>
      </ul>
    </div>
    <div class="accountDetails">
      <el-card
        shadow="never"
        v-for="(item, index) in accountList"
        :key="index"
        class="accountLists"
        @click.native="linkToAccountDetail(item)"
      >
        <div slot="header" class="clearfix accountTitle">
          <span style="font-weight: 700" @click.stop
            ><el-checkbox
              @change="change(item, index)"
              v-model="item.checked"
              >{{ item.PAYMENT_NO }}</el-checkbox
            ></span
          >
          <el-tag
            effect="dark"
            style="float: right"
            :type="item.STATUS !== '2' ? 'warning' : 'success'"
            >{{ item.STATUS !== "2" ? "未付清" : "已付清" }}</el-tag
          >
        </div>
        <div class="text item">
          <span>计费周期：{{ item.timeSlot || "--" }}</span>
          <span>所属合同：{{ item.CONTRACT_NO || "--" }}</span>
        </div>
        <div class="text item">
          <span>所属项目：{{ item.PROJECT_NAME }}</span>
          <span>物业位置：{{ item.ROOMS || "--" }}</span>
        </div>
        <div class="text item jineItem">
          <span
            ><i class="iconfontCXCY icon-jine2 color5e9dec"></i
            >应付金额&nbsp;&nbsp;<b class="color5e9dec">{{
              item.YSJE || "--"
            }}</b
            >&nbsp;&nbsp;元</span
          >
          <span
            ><i class="iconfontCXCY icon-jine2 color8fc585"></i
            >已付金额&nbsp;&nbsp;<b class="color8fc585">{{
              item.LJJY || "--"
            }}</b
            >&nbsp;&nbsp;元</span
          >
          <span
            ><i class="iconfontCXCY icon-jine2 colord9544e"></i
            >欠费金额&nbsp;&nbsp;<b class="colord9544e">{{
              (item.YSJE - item.LJJY).toFixed(2)
            }}</b
            >&nbsp;&nbsp;元</span
          >
        </div>
      </el-card>
      <el-pagination
        background
        v-if="totalPageNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="account.currentPage"
        class="pagination"
        :page-size="account.pageSize"
        layout="prev, pager, next"
        :total="totalPageNumber"
      >
      </el-pagination>
    </div>
    <img
      v-if="!accountList.length"
      src="@/assets/images/bg/no.jpg"
      style="margin: 0 auto; display: block"
    />
  </div>
</template>
<script>
import {
  api_search,
  api_getProject,
  api_getBuilding,
} from "@/api/creditManagement/companyAccount/companyAccount";
export default {
  data() {
    return {
      account: {
        paymentno: "",
        contractNo: "",
        jfStartDate: "",
        jfEndDate: "",
        project: "",
        building: "",
        status: "",
        currentPage: 1,
        pageSize: 10,
      },
      totalPageNumber: 0,
      daterange: [],
      accountList: [], //列表数据
      projectList: [],
      buildingList: [],
      paymentIds: [],
      type: "",
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  created() {
    this.getProjectLists();
    this.getPageList();
  },
  methods: {
    download(type) {
      let url = type ? "payment/excel" : "payment/downSktzs";
      let { currentPage, pageSize, ...params } = this.account;
      let paymentIds = this.paymentIds.join(",");
      const data = { paymentIds, ...params };
      window.location = `${process.env.VUE_APP_BASE_API}/park/${url}?paymentIds=${data.paymentIds}&paymentno=${data.paymentno}&contractNo=${data.contractNo}&jfStartDate=${data.jfStartDate}&jfEndDate=${data.jfEndDate}&project=${data.project}&building=${data.building}&status=${data.status}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`
      // window.open(
      //   `${process.env.VUE_APP_BASE_API}/park/${url}?paymentIds=${data.paymentIds}&paymentno=${data.paymentno}&contractNo=${data.contractNo}&jfStartDate=${data.jfStartDate}&jfEndDate=${data.jfEndDate}&project=${data.project}&building=${data.building}&status=${data.status}&saasCode=${this.userInfo.parkCode}&enterpriseId=${this.userInfo.saasCode}`
      // );
    },
    handleFilter(cur) {
      this.type = cur;
      this.account.status = cur;
      this.getPageList();
    },
    handleRest() {
      this.account = {
        paymentno: "",
        contractNo: "",
        jfStartDate: "",
        jfEndDate: "",
        project: "",
        building: "",
        status: "",
        currentPage: 1,
        pageSize: 10,
      };
      this.type ="";
      this.daterange = [];
      this.buildingList = [];
      this.accountList.forEach((v) => (v.checked = false));
      this.paymentIds = [];
      this.getPageList();
    },
    search() {
      this.getPageList();
    },
    handleSizeChange(size) {
      this.account.pageSize = size;
    },
    handleCurrentChange(currentPage) {
      this.account.currentPage = currentPage;
      this.getPageList();
    },
    getPageList() {
      if (!this.daterange) {
        this.daterange = [];
      }
      this.account.jfStartDate = this.daterange[0] || "";
      this.account.jfEndDate = this.daterange[1] || "";
      api_search(this.account)
        .then((res) => {
          if (res.data.length) {
            res.data.forEach((v) => {
              v.checked = false;
            });
            this.accountList = res.data;
            this.accountList.forEach((v) => {
              this.paymentIds.forEach((K) => {
                if (v.ID === K) {
                  v.checked = true;
                }
              });
            });
            this.totalPageNumber = res.totalRecordNumber;
          } else {
            this.accountList = [];
            this.totalPageNumber = 0;
          }
        })
        .catch((err) => console.log(err));
    },
    async getProjectLists() {
      let res = await api_getProject();
      this.projectList = res;
    },
    async handleChangeProject() {
      this.buildingList = await api_getBuilding(this.account.project);
    },
    change(item, index) {
      if (item.checked && this.paymentIds.indexOf(item.ID) === -1) {
        this.paymentIds.push(item.ID);
      } else {
        this.paymentIds.forEach((v, i) => {
          if (v === item.ID) {
            console.log(i);
            this.paymentIds.splice(i, 1);
          }
        });
      }
    },
    linkToAccountDetail(item) {
      this.$router.push({
        name: "accountDetails",
        params: {
          id: item.ID,
        },
      });
    },
  },

  mounted() {
    console.log(api_search());
  },
};
</script>
<style scoped lang="scss">
.accountTitle {
  line-height: 30px;
}
.title {
  font-size: 16px;
  line-height: 20px;
  padding-left: 20px;
  border-left: 4px solid $--color-primary;
  .btns {
    float: right;
  }
}
.filters {
  height: 50px;
  display: flex;
  align-items: center;
  span {
    font-weight: 700;
  }
  ul > li {
    float: left;
    margin-left: 40px;
    cursor: pointer;
    &.active {
      color: $--color-primary;
    }
  }
}
/deep/.el-card__header {
  border-bottom: 0;
  padding: 18px 20px 0;
}
.accountLists {
  background: #f5f7fa;
  margin-bottom: 20px;
  cursor: pointer;
}
.accountLists .item {
  display: flex;
  align-items: center;
  line-height: 30px;
}
.accountLists .item > span {
  flex: 0 0 33.33%;
  display: block;
}
.pagination {
  float: right;
}
</style>