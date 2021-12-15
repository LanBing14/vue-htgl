<template>
  <div class="serve-content-wrapper">
    <div class="title-name">
      <span class="name-1">物业报修</span>
    </div>
    <el-form ref="searchForm" :model="listQuery" :inline="true">
      <el-form-item prop="noticeTitle">
        <el-input
          v-model="listQuery.roomNo"
          placeholder="报修房间"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </el-form-item>
      <el-form-item prop="createTime">
        <el-date-picker
          v-model="bxTime"
          cellClassName="decoraTime"
          type="daterange"
          start-placeholder="报修开始时间"
          end-placeholder="报修截止时间"
          @change="changeTime"
        >
        </el-date-picker>
        <!-- <el-date-picker v-model="listQuery.createTime"   value-format="yyyy-MM-dd" type="date" placeholder="报修日期"></el-date-picker> -->
      </el-form-item>
      <el-form-item class="btns">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
          >查询</el-button
        >
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          @click="handleReset('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <p class="title1-mechanism">物业报修列表</p>
    <div class="clearfix tabWrap">
      <p class="is-active" @click="searchStatus($event, '')">全部</p>
      <p @click="searchStatus($event, '0')">未处理</p>
      <p @click="searchStatus($event, '1')">已处理</p>
    </div>
    <TableWrapper
      ref="child"
      :fetchDataFn="Api_getRepairList"
      :query="listQuery"
      :columns="tableCol"
    />
  </div>
</template>
<script>
import { Api_getRepairList } from "@/api/userCenter/propertyRepair.js";
export default {
  data() {
    return {
      bxTime: [],
      listQuery: {
        roomNo: "",
        startDate: "",
        endDate: "",
        state: "",
      },
      tableCol: [
        {
          key: "CONTENTS",
          label: "报修内容",
          width: 150,
        },
        {
          key: "TYPE",
          label: "报修类型",
          align: "left",
          render: (h, data, row) => {
            return data == 0
              ? "强电维修"
              : data == 1
              ? "质量检查"
              : data == 2
              ? "排水维修"
              : data == 3
              ? "清洁"
              : data == 4
              ? "暖通空调维修"
              : "其他";
          },
        },
        {
          key: "ROOMNO",
          label: "报修房间",
          align: "left",
        },
        {
          key: "CREATETIME",
          label: "报修时间",
          align: "left",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: "STATE",
          label: "报修状态",
          align: "left",
          render: (h, data, row) => {
            return data == 0 ? "未处理" : "已处理";
          },
        },
        {
          key: "HANDLETIME",
          label: "处理时间",
          align: "left",
          render: (h, data, row) => {
            return this.$dateFormat(data, "yyyy-MM-dd");
          },
        },
        {
          key: null,
          label: "操作",
          render: (h, data, row) => {
            return (
              <span
                class="btn-see"
                style="color: #409eff"
                onClick={this.handleSee.bind(this, row)}
              >
                查看
              </span>
            );
          },
        },
      ],
    };
  },
  computed: {
    companyId() {
      return this.$store.getters.userInfo.companyId;
    },
  },
  methods: {
    getList(flag) {
      this.$refs.child.fetchData(flag);
    },
    Api_getRepairList,
    handleSee(row) {
      this.$emit("handleFromNotice", true, row.ID);
    },
    handleFilter() {
      this.getList(true);
    },
    //  选择时间
    changeTime(e) {
      this.listQuery.startDate = e && this.$moment(e[0]).format("YYYY-MM-DD");
      this.listQuery.endDate = e && this.$moment(e[1]).format("YYYY-MM-DD");
    },
    handleReset(formName) {
      this.listQuery = {
        roomNo: "",
        startDate: "",
        endDate: "",
        state: ""
      }
      this.bxTime = [];
      setTimeout(() => {
        this.$refs[formName].resetFields();
        this.getList(true);
      },0)
      
    },
    searchStatus(event, id) {
      var divAll = document.getElementsByClassName("tabWrap")[0].children;
      for (var i = 0; i < divAll.length; i++) {
        divAll[i].className = "";
      }
      event.target.className = "is-active";
      this.listQuery.state = id;
      this.getList(true);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.child.fetchData();
    });
  },
};
</script>
<style lang="scss" scoped>
.serve-content-wrapper {
  padding: 12px 25px;
  background-color: #fff;

  /deep/ .el-input__inner {
    line-height: 30px;
    height: 30px;
  }

  /deep/ .el-button {
    padding: 7px 20px;
  }

  .page-mechanism {
    text-align: right;
    margin-top: 15px;
  }

  .title-name {
    margin-bottom: 20px;

    .name-1 {
      height: 42px;
      display: inline-block;
      line-height: 42px;
      font-size: 16px;
      border-bottom: 2px solid $light-blue;
    }

    .name-back {
      padding: 6px 14px;
      float: right;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      color: #606266;
    }
  }

  .title1-mechanism {
    line-height: 54px;
    font-size: 16px;
    color: #606266;
  }

  .tabWrap {
    display: flex;
    margin-bottom: 10px;

    p.is-active {
      color: $light-blue;
    }

    p {
      margin-right: 38px;
      line-height: 30px;
      cursor: pointer;
    }
  }
}


</style>
<style>
.el-date-editor .serve-content-wrapper[data-v-1ebc9035] .el-input__inner {
  vertical-align: middle;
}
.el-date-editor .el-range__icon,
.el-date-editor .el-range-separator,
.el-date-editor .el-range__close-icon {
  line-height: 24px;
}
</style>